import { Context } from "hono";

export const CoinbaseWebhook = async (c: Context<App>) => {
	return c.json({});
};
