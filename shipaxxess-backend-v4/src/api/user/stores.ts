import { Context } from "hono";

export const StoresUser = (c: Context<App>) => {
	return c.json({});
};
