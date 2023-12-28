import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	return c.json([]);
};

const TypeUser = { GetAll };

export { TypeUser };
