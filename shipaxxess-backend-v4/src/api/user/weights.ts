import { adminWeights } from "@schemas/adminWeights";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";

const Post = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Weights.FETCHSCHEMA.parse(body);
	console.log(parse)
	// const weight = await drizzle(c.env.DB, { schema }).query.adminWeights.findFirst({
	// 	with: {
	// 		type: {
	// 			// @ts-ignore
	// 			where: eq(types.type, parse.type),
	// 		},
	// 	},
	// 	where: and(
	// 		eq(adminWeights.type_id, Number(parse.type_id)),
	// 		lte(adminWeights.from_weight, parse.weight),
	// 		gte(adminWeights.to_weight, parse.weight),
	// 	),
	// });

	const weight = await drizzle(c.env.DB).select().from(adminWeights).where(and(eq(adminWeights.type_id, parse.type_id))).get()
	console.log(weight)
	if (!weight) throw exception({ code: 40405, message: "Weight not found test" });

	return c.json(weight);
};

const WeightsUser = { Post };

export { WeightsUser };

