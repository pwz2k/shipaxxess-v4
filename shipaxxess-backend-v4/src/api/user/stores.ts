import { Ebay } from "@lib/stores/ebay";
import { Context } from "hono";

const EbayInit = async (c: Context) => {
	const api = new Ebay();

	return c.json({ url: api.redirect() });
};

export const StoreUser = { EbayInit };
