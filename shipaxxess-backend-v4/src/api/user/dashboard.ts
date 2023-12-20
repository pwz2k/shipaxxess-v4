import { Context } from "hono";

export const DashboardUser = (c: Context<App>) => {
	return c.json({});
};
