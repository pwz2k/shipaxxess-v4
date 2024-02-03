import { Model } from "@lib/model";
import { refunds } from "@schemas/refunds";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const rt = await model.all(refunds);

	return c.json(rt);
};

export const RefundAdmin = { GetAll };
