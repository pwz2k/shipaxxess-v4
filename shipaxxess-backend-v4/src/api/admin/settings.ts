import { Model } from "@lib/model";
import { adminSettings } from "@schemas/adminSettings";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const settings = await model.all(adminSettings);

	return c.json(settings);
};

export const AdminSettings = { GetAll };
