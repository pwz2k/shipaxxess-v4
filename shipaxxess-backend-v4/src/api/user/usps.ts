import { UspsBatchService } from "@lib/usps";
import { Labels } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";

export const USPSBatchLabelUser = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Labels.BATCHZODSCHEMA.parse(body);

	const usps = new UspsBatchService(c.env, parse, c.get("jwtPayload").id);

	const checked = await usps.checkBeforeGenerate();

	await usps.storeBatchData({
		batch_uuid: parse.batch_uuid,
		cost: checked.weight.user_cost,
		reseller_cost: checked.weight.reseller_cost,
	});
	await usps.payforLabel(checked.user, checked.weight);

	await usps.sendToQueue({
		batch_uuid: parse.batch_uuid,
		reseller_cost: checked.weight.reseller_cost,
		user_cost: checked.weight.user_cost,
	});

	return c.json({ success: true, message: "We are processing your batch. Please check back later." });
};
