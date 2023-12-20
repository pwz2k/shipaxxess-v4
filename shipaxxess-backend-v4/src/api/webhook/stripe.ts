import { Context } from "hono";

export const StripeWebhook = (c: Context<App>) => {
	return c.json({});
};
