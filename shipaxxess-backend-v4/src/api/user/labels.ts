import { config } from "@config";
import { Model } from "@lib/model";
import { LabelsService } from "@lib/usps";
import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { Labels, Refund as RF } from "@shipaxxess/shipaxxess-zod-v4";
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

	const service = new LabelsService(c.env, parse, c.get("jwtPayload").id);

	const checked = await service.checkBeforeGenerate();

	await service.storeBatchData({
		batch_uuid: parse.batch_uuid,
		cost: checked.weight.user_cost,
		reseller_cost: checked.weight.reseller_cost,
		type: parse.type.type,
	});

	await service.payforLabel(checked.user, checked.weight);

	await service.sendToQueue({
		batch_uuid: parse.batch_uuid,
		reseller_cost: checked.weight.reseller_cost,
		user_cost: checked.weight.user_cost,
	});

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
