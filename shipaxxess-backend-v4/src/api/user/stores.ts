import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	return c.json([]);
};

export const StoreUser = { GetAll };
