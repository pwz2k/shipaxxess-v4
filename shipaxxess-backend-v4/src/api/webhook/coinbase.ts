import { Context } from "hono";

export const CoinbaseWebhook = (c: Context<App>) => {
	return c.json({});
};
