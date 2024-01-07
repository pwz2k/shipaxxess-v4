import { Model } from "@lib/model";
import { weights } from "@schemas/weights";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";
import { v4 } from "uuid";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const wt = await model.all(weights);

	return c.json(wt);
};

const Get = async (c: Context<App>) => {};

const Create = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Weights.CREATESCHEMA.parse(body);

	const model = new Model(c.env.DB);

	await model.insert(weights, {
		reseller_cost: parse.reseller_cost,
		user_cost: parse.user_cost,
		weight: parse.weight,
		type_id: parse.type_id,
		uuid: v4(),
	});

	return c.json({ success: true });
};

const Edit = async (c: Context<App>) => {
	return c.json({});
};

const Delete = async (c: Context<App>) => {
	return c.json({});
};

const WeightsAdmin = { GetAll, Create, Edit, Delete };

export { WeightsAdmin };
