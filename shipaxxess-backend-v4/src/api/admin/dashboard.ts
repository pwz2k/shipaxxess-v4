import { Context } from "hono";

export const DashboardAdmin = (c: Context<App>) => {
	return c.json({});
};
