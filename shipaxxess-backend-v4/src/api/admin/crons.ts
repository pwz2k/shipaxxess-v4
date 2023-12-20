import { Context } from "hono";

export const CronsAdmin = (c: Context<App>) => {
	return c.json({});
};
