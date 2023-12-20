import { UspsService } from "@lib/usps";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";

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
	return c.json({});
};
