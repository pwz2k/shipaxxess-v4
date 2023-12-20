import { Context } from "hono";

const Get = (c: Context<App>) => {
	return c.json({});
};

const Create = async (c: Context<App>) => {
	return c.json({});
};

const Edit = async (c: Context<App>) => {
	return c.json({});
};

const Delete = async (c: Context<App>) => {
	return c.json({});
};

const WeightsAdmin = { Get, Create, Edit, Delete };

export { WeightsAdmin };
