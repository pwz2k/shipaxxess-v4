import { Model } from "@lib/model";
import { Ebay } from "@lib/stores/ebay";
import { stores } from "@schemas/stores";
import { Context } from "hono";

const Init = async (c: Context<App>) => {
	const api = new Ebay();
	return c.json({ url: api.redirect() });
};

const Callback = async (c: Context<App>) => {
	const api = new Ebay();
	const code = c.req.query("code");

	if (!code) return c.json({ error: "No code provided in the query" });

	const { access_token, refresh_token, expires_in } = await api.exchangeCodeForToken(code);

	const model = new Model(c.env.DB);

	await model.insert(stores, {
		store_name: "",
		user_id: 1,
		uuid: "",
		type: "Ebay",
		eb_access_token: access_token,
		eb_refresh_token: refresh_token,
		eb_expires_in: expires_in,
	});

	return c.json({ success: true });
};

const FetchOrders = async (c: Context<App>) => {
	return c.json([]);
};

const StoreAsBatch = async (c: Context<App>) => {
	return c.json({ success: true });
};

export const EbayUser = { Init, Callback, FetchOrders, StoreAsBatch };
