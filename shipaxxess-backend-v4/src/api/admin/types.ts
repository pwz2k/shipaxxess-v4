import { Model } from "@lib/model";
import { types } from "@schemas/types";
import { Type } from "@shipaxxess/shipaxxess-zod-v4";
import { Context } from "hono";
import { v4 } from "uuid";

const Get = (c: Context<App>) => {
	return c.json({});
};

const Create = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Type.CREATESCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const [insert] = await model.insert(types, {
		uuid: v4(),
		label: parse.label,
		value: parse.value,
		unit: parse.unit,
		type: parse.type,
	});

	return c.json(insert);
};

const Edit = async (c: Context<App>) => {
	return c.json({});
};

const Delete = async (c: Context<App>) => {
	return c.json({});
};

const TypesAdmin = { Get, Create, Edit, Delete };

export { TypesAdmin };
