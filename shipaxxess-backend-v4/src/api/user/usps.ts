import { UspsBatchService, UspsService } from "@lib/usps";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";

export const USPSSignleLabelUser = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Usps.ZODSCHEMA.parse(body);

	const usps = new UspsService(c.env, parse, c.get("jwtPayload").id);

	const checked = await usps.checkBeforeGenerate();

	const generated = await usps.generateLabel();

	await usps.insertLabel(generated.payload, { user: checked.weight.user_cost, reseller: checked.weight.reseller_cost });

	await usps.downloadLabel(generated.payload);

	await usps.payforLabel(checked.user, checked.weight);

	return c.json({ message: "Label generated" });
};

export const USPSBatchLabelUser = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Usps.BATCHZODSCHEMA.parse(body);

	const usps = new UspsBatchService(c.env, parse, c.get("jwtPayload").id);

	const checked = await usps.checkBeforeGenerate();

	await usps.bulkKVStore();
	await usps.sendToQueue();

	await usps.payforLabel(checked.user, checked.weight);

	await usps.storeInBatchTable({
		cost: checked.weight.user_cost * parse.recipient.length,
		batch_uuid: parse.batch_uuid,
	});

	return c.json({ success: true, message: "We are processing your batch. Please check back later." });
};
