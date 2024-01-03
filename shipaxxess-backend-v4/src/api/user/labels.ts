import { config } from "@config";
import { LabelsService } from "@lib/usps";
import { Labels, Refund as RF } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";

const GetAll = (c: Context<App>) => {
	return c.json({});
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

export const LabelsUser = { GetAll, Create, Refund };
