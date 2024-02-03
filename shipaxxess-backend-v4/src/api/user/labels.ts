import { LabelManager } from "@lib/label";
import { Model } from "@lib/model";
import { addresses } from "@schemas/addresses";
import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { Id, Labels } from "@shipaxxess/shipaxxess-zod-v4";
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

export const LabelsUser = { GetAll, Create, Get, DownloadSingle, DownloadBatch };
