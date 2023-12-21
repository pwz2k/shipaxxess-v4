import { UspsBatchService } from "@lib/usps";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";
import { v4 } from "uuid";

export const USPSBatchLabelUser = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Usps.BATCHZODSCHEMA.parse(body);

	const usps = new UspsBatchService(c.env, parse, c.get("jwtPayload").id);

	const checked = await usps.checkBeforeGenerate();

	const batch_uuid = v4();
	await usps.storeBatchData({
		batch_uuid,
		cost: checked.weight.user_cost,
		reseller_cost: checked.weight.reseller_cost,
	});
	await usps.payforLabel(checked.user, checked.weight);

	await usps.sendToQueue(batch_uuid);

	return c.json({ success: true, message: "We are processing your batch. Please check back later." });
};
