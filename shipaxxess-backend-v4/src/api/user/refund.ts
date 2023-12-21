import { config } from "@config";
import { Refund } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";

export const RefundUser = async (c: Context<App>) => {
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
