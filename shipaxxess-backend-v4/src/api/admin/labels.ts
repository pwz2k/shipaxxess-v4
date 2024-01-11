import { Model } from "@lib/model";
import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const batches = await model.all(batchs);

	return c.json(batches);
};

const Get = async (c: Context<App, "/:uuid">) => {
	const batch_uuid = c.req.param("uuid");

	const model = new Model(c.env.DB);

	const batchLabels = await model.all(labels, eq(labels.batch_uuid, batch_uuid));

	return c.json(batchLabels);
};

export const LabelsAdmin = { GetAll, Get };
