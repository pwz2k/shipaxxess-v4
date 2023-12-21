import { Model } from "@lib/model";
import { weights } from "@schemas/weights";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { and, eq } from "drizzle-orm";
import { Context } from "hono";

const Get = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = Weights.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const wt = await model.get(
		weights,
		and(eq(weights.weight, parse.weight), eq(weights.type, parse.type), eq(weights.type_id, parse.id)),
	);

	return c.json(wt);
};

const WeightsUser = { Get };

export { WeightsUser };
