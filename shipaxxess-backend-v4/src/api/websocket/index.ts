import { labels } from "@schemas/labels";
import { Labels } from "@shipaxxess/shipaxxess-zod-v4";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { v4 } from "uuid";
import { z } from "zod";

const WebSocketZodSchema = z.object({
	type: z.enum(["batch_label", "message"]),
	data: z.any(),
});

type kv_parse = {
	total_labels: number;
	reseller_cost: number;
	user_cost: number;
	type: "usps" | "ups";
	data: Labels.BATCHZODSCHEMA;
};

export const WebSocketUser = (c: Context<App>) => {
	const upgradeHeader = c.req.header("Upgrade");

	if (!upgradeHeader || upgradeHeader !== "websocket") {
		return new Response("Expected Upgrade: websocket", { status: 426 });
	}

	const webSocketPair = new WebSocketPair();
	const [client, server] = Object.values(webSocketPair);

	server.accept();

	server.addEventListener("open", async () => {});

	server.addEventListener("message", async (event) => {
		try {
			// Parse
			const parse = WebSocketZodSchema.parse(event.data);

			switch (parse.type) {
				case "batch_label":
					if (!parse.data) throw new Error("KV uuid not found");

					const kv_data = await c.env.BATCH_KV.get(parse.data);
					if (!kv_data) throw new Error("KV record not found");
					const kv_parse = JSON.parse(kv_data) as kv_parse;

					for (const recipient of kv_parse.data.recipient) {
						try {
							const insert = await drizzle(c.env.DB)
								.insert(labels)
								.values({
									uuid: v4(),
									cost_reseller: kv_parse.reseller_cost,
									cost_user: kv_parse.user_cost,
									package_height: kv_parse.data.package.height,
									package_length: kv_parse.data.package.length,
									package_weight: kv_parse.data.package.weight,
									package_width: kv_parse.data.package.width,
									package_id: kv_parse.data.package.id,
									package_name: kv_parse.data.package.name,
									recipent_company_name: recipient.company_name,
									recipent_street_two: recipient.street_two,
									recipent_city: recipient.city,
									recipent_country: recipient.country,
									recipent_full_name: recipient.full_name,
									recipent_state: recipient.state,
									recipent_street_one: recipient.street_one,
									recipent_zip: recipient.zip,
									sender_company_name: kv_parse.data.sender.company_name,
									sender_street_two: kv_parse.data.sender.street_two,
									sender_city: kv_parse.data.sender.city,
									sender_country: kv_parse.data.sender.country,
									sender_full_name: kv_parse.data.sender.full_name,
									sender_state: kv_parse.data.sender.state,
									sender_street_one: kv_parse.data.sender.street_one,
									sender_zip: kv_parse.data.sender.zip,
									shipping_date: kv_parse.data.shippingdate,
									type: kv_parse.type,
									type_label: kv_parse.data.type.label,
									type_unit: kv_parse.data.type.unit,
									type_value: kv_parse.data.type.value,
									user_id: c.get("jwtPayload").id,
								});
							if (!insert.success) throw new Error("Failed to create label");
						} catch (err) {}
					}

					// TODO: insert in db
					// TODO: generate pdf
					// TODO: var store all pdf links and track error
					break;

				case "message":
					break;

				default:
			}
		} catch (err) {
			server.send(JSON.stringify({ message: (err as Error).message }));
		}
	});

	server.addEventListener("error", async () => {
		client.close();
		server.close();
	});

	server.addEventListener("close", async () => {
		client.close();
		server.close();
	});

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
};
