import { Model } from "@lib/model";
import { batchs } from "@schemas/batchs";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const batches = await model.all(batchs);

	return c.json(batches);
};

export const LabelsAdmin = { GetAll };
