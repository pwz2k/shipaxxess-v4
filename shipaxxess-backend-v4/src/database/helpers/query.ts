import schema from "@schemas/index";
import { types } from "@schemas/types";
import { weights } from "@schemas/weights";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export const getWeight = async (db: D1Database, parse: Weights.FETCHSCHEMA) => {
	return await drizzle(db, { schema }).query.weights.findFirst({
		with: {
			type: {
				// @ts-ignore
				where: and(eq(types.type, parse.type), eq(types.id, parse.type_id)),
			},
		},
		where: and(eq(weights.type_id, parse.type_id), eq(weights.weight, parse.weight)),
	});
};
