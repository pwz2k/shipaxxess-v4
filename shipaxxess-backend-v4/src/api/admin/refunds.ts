import { Model } from "@lib/model";
import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { refunds } from "@schemas/refunds";
import { exception } from "@utils/error";
import { log } from "@utils/log";
import { getSettings } from "@utils/settings";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const rt = await model.all(refunds);

	return c.json(rt);
};

const Refund = async (c: Context<App>) => {};

const Recycle = async (c: Context<App, "/:uuid">) => {
	const model = new Model(c.env.DB);

	const settings = await getSettings(c.env.DB);

	const batch = await model.get(batchs, eq(batchs.uuid, c.req.param("uuid")));
	if (!batch) {
		throw exception({ message: "Batch not found", code: 404 });
	}

	for (const recipient of batch.recipients) {
		const label = await model.get(labels, eq(labels.uuid, recipient.uuid));
		if (!label) {
			log("Label not found");
			continue;
		}

		if (!label.remote_id) {
			log("Label not synced");
			continue;
		}

		const req = await fetch(`${settings["label_host"]}/api/admin/ex-recycle-label`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": settings["label_apikey"],
			},
			body: JSON.stringify({ id: label.remote_id }),
		});

		if (!req.ok) {
			log("Error recycling label");
			continue;
		}
	}

	await model.update(
		refunds,
		{
			is_recycled: true,
		},
		eq(refunds.batch_uuid, batch.uuid),
	);

	return c.json({ success: true, message: "Recycled successfully" });
};

export const RefundAdmin = { GetAll, Refund, Recycle };
