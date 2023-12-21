import { UspsBatchService, UspsService } from "@lib/usps";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";
import { v4 } from "uuid";

export const USPSSignleLabelUser = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Usps.ZODSCHEMA.parse(body);

	const usps = new UspsService(c, parse);

	const checked = await usps.checkBeforeGenerate();
	const generated = await usps.generateLabel();

	await usps.insertLabel(generated.payload);
	await usps.downloadLabel(generated.payload);

	await usps.payforLabel(checked.user, checked.weight);

	return c.json({ message: "Label generated" });
};

export const USPSBatchLabelUser = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Usps.BATCHZODSCHEMA.parse(body);

	const usps = new UspsBatchService(c, parse);

	const checked = await usps.checkBeforeGenerate();

	const kv_data = parse.recipient.map((v) => ({ key: v4(), value: v.uuid }));
	const res = await usps.bulkKVStore(kv_data);

	return c.json(res);
};
