import { config } from "@config";
import { LabelManager } from "@lib/label";
import { Model } from "@lib/model";
import { addresses } from "@schemas/addresses";
import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { payments } from "@schemas/payments";
import { users } from "@schemas/users";
import { Id, Labels, Refund } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { log } from "@utils/log";
import { getSettings } from "@utils/settings";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { v4 } from "uuid";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const batches = await model.all(batchs, eq(batchs.user_id, c.get("jwtPayload").id));

	return c.json(batches);
};

const Get = async (c: Context<App, "/:uuid">) => {
	const batch_uuid = c.req.param("uuid");

	const model = new Model(c.env.DB);

	const batch = await model.get(batchs, eq(batchs.uuid, batch_uuid));
	if (!batch) {
		throw exception({ message: "Batch not found.", code: 404 });
	}

	const batchLabels = await model.all(labels, eq(labels.batch_uuid, batch_uuid));

	return c.json({ labels: batchLabels, batch: { name: batch.name } });
};

const Create = async (c: Context<App>) => {
	log("Hit label batch endpoint.");

	const body = await c.req.json();
	const parse = Labels.BATCHZODSCHEMA.parse(body);
	log("Parsed body.");

	const settings = await getSettings(c.env.DB);
	const manager = new LabelManager(c.env, settings);
	log("Created label manager.");

	if (!manager.haveGrithOk(parse.package.height, parse.package.width, parse.package.length, parse.type.type)) {
		throw exception({ message: "Package dimensions are too large.", code: 508 });
	}
	log("Package dimensions are ok.");

	const weight = await manager.getWeightData(parse.type.type, parse.type.id, parse.package.weight);
	if (!weight) {
		throw exception({ message: "Weight not found.", code: 404 });
	}
	log("Weight is ok.");

	const total_labels = parse.recipient.length;
	const user_cost = weight.user_cost * total_labels;
	const reseller_cost = weight.reseller_cost * total_labels;

	const user = await manager.getUserData(c.get("jwtPayload").id);
	if (!user) {
		throw exception({ message: "User not found.", code: 404 });
	}
	log("User is ok.");

	if (user.current_balance < user_cost) {
		throw exception({ message: "Insufficient funds.", code: 402 });
	}
	log("User has enough funds.");

	const batch = await manager.saveIntoBatchTable(parse, user_cost, reseller_cost, user.id);
	log("Batch saved.");

	c.executionCtx.waitUntil(manager.chargeUserForBatch(user, user_cost, total_labels));
	c.executionCtx.waitUntil(manager.sendToBatchProcessQueue(batch.id));
	log("User charged and batch sent to queue.");

	const savedSender = async () => {
		const model = new Model(c.env.DB);

		return await model.insert(addresses, {
			uuid: v4(),
			user_id: user.id,
			full_name: parse.sender.full_name,
			company_name: parse.sender.company_name,
			city: parse.sender.city,
			zip: parse.sender.zip,
			state: parse.sender.state,
			street_one: parse.sender.street_one,
			street_two: parse.sender.street_two,
			country: parse.sender.country,
		});
	};

	if (parse.saved_sender) {
		c.executionCtx.waitUntil(savedSender());
	}

	return c.json({ success: true, message: "We are processing your batch. Please check back later." });
};

const RefundAsBatch = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Refund.ZODSCHEMA.parse(body);

	for (const label of parse.batch) {
		await fetch(`https://api.labelaxxess.com/api/admin/ex-recycle-label`, {
			method: "POST",
			headers: config.label.headers,
			body: JSON.stringify({ id: label.id }),
		});
	}

	return c.json({ success: true, body });
};

const RefundSingle = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Id.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const label = await model.get(labels, eq(labels.id, parse.id));
	if (!label) {
		throw exception({ message: "Label not found.", code: 404 });
	}

	// if (label.status_label === "awaiting") {
	// 	return c.json({ success: true, message: "Refund funds will be added in your balance within 2-3 days" });
	// }

	if (label.status_label === "refunded") {
		throw exception({ message: "Label already refunded.", code: 404 });
	}

	const req = await fetch(`https://api.labelaxxess.com/api/admin/ex-recycle-label`, {
		method: "POST",
		headers: config.label.headers,
		body: JSON.stringify({ id: label.remote_id }),
	});

	const res = (await req.json()) as { message: string };

	if (!req.ok) throw exception({ message: res.message, code: 404 });

	await model.update(labels, { status_label: "refunded" }, eq(labels.id, label.id));

	const user = await model.get(users, eq(users.id, label.user_id));
	if (!user) {
		throw exception({ message: "User not found.", code: 404 });
	}

	c.executionCtx.waitUntil(
		model.update(
			users,
			{
				current_balance: user.current_balance + label.cost_user,
				total_refund: user.total_refund + label.cost_user,
				total_labels: user.total_labels - 1,
				total_spent: user.total_spent - label.cost_user,
			},
			eq(users.id, label.user_id),
		),
	);

	c.executionCtx.waitUntil(
		model.insert(payments, {
			credit: label.cost_user,
			current_balance: user.current_balance,
			gateway: "Refund",
			new_balance: user.current_balance + label.cost_user,
			user_email: user.email_address,
			user_id: user.id,
			user_name: `${user.first_name} ${user.last_name}`,
			status: "confirmed",
			uuid: v4(),
		}),
	);

	return c.json({ success: true });
};

const DownloadSingle = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Id.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const label = await model.get(labels, eq(labels.id, parse.id));
	if (!label) {
		throw exception({ message: "Label not found.", code: 404 });
	}
	if (!label.remote_pdf_r2_link) {
		throw exception({ message: "Label not ready to download.", code: 404 });
	}

	const r2data = await c.env.LABELS_BUCKET.get(label.remote_pdf_r2_link);
	if (!r2data) {
		throw exception({ message: "pdf not found.", code: 404 });
	}

	return new Response(r2data.body, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="${label.remote_pdf_r2_link}"`,
		},
	});
};

const DownloadBatch = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Id.UUIDSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const batch = await model.get(batchs, eq(batchs.uuid, parse.uuid));
	if (!batch) {
		throw exception({ message: "Batch not found.", code: 404 });
	}

	if (!batch.merge_pdf_key) {
		throw exception({ message: "Batch not ready to download.", code: 404 });
	}

	const r2data = await c.env.LABELS_BUCKET.get(batch.merge_pdf_key);
	if (!r2data) {
		throw exception({ message: "pdf not found.", code: 404 });
	}

	return new Response(r2data.body, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="${batch.merge_pdf_key}"`,
		},
	});
};

export const LabelsUser = { GetAll, Create, RefundAsBatch, Get, DownloadSingle, RefundSingle, DownloadBatch };
