import { Model } from "@lib/model";
import { crons } from "@schemas/crons";
import { labels } from "@schemas/labels";
import { exception } from "@utils/error";
import { getSettings } from "@utils/settings";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const cr = await model.all(crons);

	return c.json(cr);
};

const Remove = async (c: Context<App, "/:id">) => {
	const cron_id = c.req.param("id");

	const model = new Model(c.env.DB);

	await model.delete(crons, eq(crons.id, parseInt(cron_id)));

	return c.json({ success: true });
};

const Reprocess = async (c: Context<App, "/:id">) => {
	const cron_id = c.req.param("id");

	const model = new Model(c.env.DB);

	const cron_data = await model.get(crons, eq(crons.id, parseInt(cron_id)));
	if (!cron_data) throw exception({ message: "Cron not found", code: 404 });

	const label = await model.get(labels, eq(labels.uuid, cron_data.label_uuid));
	if (!label) throw exception({ message: "Label not found", code: 404 });

	const settings = await getSettings(c.env.DB);

	return c.json({});
};

export const CronsAdmin = { GetAll, Remove, Reprocess };
