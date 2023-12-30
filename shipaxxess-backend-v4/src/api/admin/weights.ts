import { Model } from "@lib/model";
import { weights } from "@schemas/weights";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";
import { v4 } from "uuid";

const Get = (c: Context<App>) => {
	return c.json({});
};

const Create = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Weights.CREATESCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const [insert] = await model.insert(weights, {
		reseller_cost: parse.reseller_cost,
		user_cost: parse.user_cost,
		weight: parse.weight,
		type_id: parse.type_id,
		uuid: v4(),
	});

	return c.json(insert);
};

const Edit = async (c: Context<App>) => {
	return c.json({});
};

const Delete = async (c: Context<App>) => {
	return c.json({});
};

const WeightsAdmin = { Get, Create, Edit, Delete };

export { WeightsAdmin };
