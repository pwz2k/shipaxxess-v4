import schema from "@schemas/index";
import { types } from "@schemas/types";
import { weights } from "@schemas/weights";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";

const Post = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Weights.FETCHSCHEMA.parse(body);

	const weight = await drizzle(c.env.DB, { schema }).query.weights.findFirst({
		with: {
			type: {
				// @ts-ignore
				where: and(eq(types.type, parse.type), eq(types.id, parse.type_id)),
			},
		},
		where: and(eq(weights.type_id, parse.type_id), eq(weights.weight, parse.weight)),
	});

	if (!weight) throw exception({ code: 40405, message: "Weight not found" });

	return c.json(weight);
};

const GetAll = async (c: Context<App>) => {
	return c.json([]);
};

const WeightsUser = { Post, GetAll };

export { WeightsUser };
