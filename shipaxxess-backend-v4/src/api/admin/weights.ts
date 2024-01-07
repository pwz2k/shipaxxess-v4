import { getAdminWeights } from "@helpers/query";
import { Model } from "@lib/model";
import { adminWeights } from "@schemas/adminWeights";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";
import { v4 } from "uuid";

const GetAll = async (c: Context<App>) => {
	const wt = await getAdminWeights(c.env.DB);

	return c.json(wt);
};

const Get = async (c: Context<App>) => {};

const Create = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Weights.CREATESCHEMA.parse(body);

	const model = new Model(c.env.DB);

	await model.insert(adminWeights, {
		reseller_cost: parse.reseller_cost,
		user_cost: parse.user_cost,
		type_id: parse.type_id,
		from_weight: parse.from_weight,
		to_weight: parse.to_weight,
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
