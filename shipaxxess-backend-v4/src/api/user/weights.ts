import { getWeight } from "@helpers/query";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { Context } from "hono";

const Post = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Weights.FETCHSCHEMA.parse(body);

	const weight = await getWeight(c.env.DB, parse);

	if (!weight) throw exception({ code: 40405, message: "Weight not found" });

	return c.json(weight);
};

const GetAll = async (c: Context<App>) => {
	return c.json([]);
};

const WeightsUser = { Post, GetAll };

export { WeightsUser };
