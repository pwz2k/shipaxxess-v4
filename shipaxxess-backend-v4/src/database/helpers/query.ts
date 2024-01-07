import { adminSettings } from "@schemas/adminSettings";
import { adminWeights } from "@schemas/adminWeights";
import schema from "@schemas/index";
import { types } from "@schemas/types";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { and, eq, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export const getWeight = async (db: D1Database, parse: Weights.FETCHSCHEMA) => {
	return await drizzle(db, { schema }).query.adminWeights.findFirst({
		with: {
			type: {
				// @ts-ignore
				where: eq(types.type, parse.type),
			},
		},
		where: and(
			eq(adminWeights.type_id, Number(parse.type_id)),
			lte(adminWeights.from_weight, parse.weight),
			gte(adminWeights.to_weight, parse.weight),
		),
	});
};

export const initSettings = async (db: D1Database) => {
	return await drizzle(db).batch([
		drizzle(db).insert(adminSettings).values({ setting_id: "stripe_key", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "stripe_secret", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "stripe_webhook_secret", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "coinbase_key", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "coinbase_webhook_secret", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "venmo_email", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "cashapp_email", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "zelle_email", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "postalserver_apikey", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "postalserver_host", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "postalserver_address", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "label_apikey", setting_value: "" }),
		drizzle(db).insert(adminSettings).values({ setting_id: "label_host", setting_value: "" }),
	]);
};

export const getAdminWeights = async (db: D1Database) => {
	return await drizzle(db, { schema }).query.adminWeights.findMany({ with: { type: true } });
};
