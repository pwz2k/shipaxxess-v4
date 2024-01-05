import { config } from "@config";
import { LabelManager } from "@lib/label";
import { Model } from "@lib/model";
import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { Labels, Refund as RF } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { getSettings } from "@utils/settings";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const batches = await model.all(batchs, eq(batchs.user_id, c.get("jwtPayload").id));

	return c.json(batches);
};

const Get = async (c: Context<App, "/:uuid">) => {
	const batch_uuid = c.req.param("uuid");

	const model = new Model(c.env.DB);

	const batchLabels = await model.all(labels, eq(labels.batch_uuid, batch_uuid));

	return c.json(batchLabels);
};

const Create = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Labels.BATCHZODSCHEMA.parse(body);

	const settings = await getSettings(c.env.DB);
	const manager = new LabelManager(c.env, settings);

	if (!manager.haveGrithOk(parse.package.height, parse.package.width, parse.package.length)) {
		throw exception({ message: "Package dimensions are too large.", code: 508 });
	}

	const weight = await manager.getWeightData(parse.type.type, parse.type.id, parse.package.weight);
	if (!weight) {
		throw exception({ message: "Weight not found.", code: 404 });
	}

	const total_labels = parse.recipient.length;
	const user_cost = weight.user_cost * total_labels;
	const reseller_cost = weight.reseller_cost * total_labels;

	const user = await manager.getUserData(c.get("jwtPayload").id);
	if (!user) {
		throw exception({ message: "User not found.", code: 404 });
	}

	if (user.current_balance < user_cost) {
		throw exception({ message: "Insufficient funds.", code: 402 });
	}

	const batch = await manager.saveIntoBatchTable(parse, user_cost, reseller_cost, user.id);

	c.executionCtx.waitUntil(manager.chargeUserForBatch(user, user_cost, total_labels));
	c.executionCtx.waitUntil(manager.sendToBatchProcessQueue(batch.id));

	return c.json({ success: true, message: "We are processing your batch. Please check back later." });
};

const Refund = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = RF.ZODSCHEMA.parse(body);

	for (const label of parse.batch) {
		await fetch(`https://api.labelaxxess.com/api/admin/ex-recycle-label`, {
			method: "POST",
			headers: config.label.headers,
			body: JSON.stringify({ id: label.id }),
		});
	}

	return c.json({ success: true, body });
};

export const LabelsUser = { GetAll, Create, Refund, Get };
