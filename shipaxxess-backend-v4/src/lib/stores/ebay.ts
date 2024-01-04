import { config } from "@config";
import { exception } from "@utils/error";
import { bytes2hex } from "@utils/hex";

export class Ebay {
	constructor() {}

	redirect() {
		return `${config.stores.ebay.authurl}/oauth2/authorize?client_id=${config.stores.ebay.client_id}&response_type=code&redirect_uri=${config.stores.ebay.redirect_uri}&scope=${config.stores.ebay.scopes}`;
	}

	async exchangeCodeForToken(code: string) {
		const bytes = new TextEncoder().encode(`${config.stores.ebay.client_id}:${config.stores.ebay.client_secret}`);

		const req = await fetch(`${config.stores.ebay.baseurl}/identity/v1/oauth2/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${bytes2hex(bytes)}`,
			},
			body: `grant_type=authorization_code&code=${code}&redirect_uri=${config.stores.ebay.redirect_uri}`,
		});

		if (!req.ok) throw exception({ message: "Failed to exchange code for token", code: req.status });

		return (await req.json()) as { access_token: string; refresh_token: string; expires_in: number };
	}

	async getOrders(token: string, limit: number) {
		const req = await fetch(`${config.stores.ebay.baseurl}/sell/fulfillment/v1/order?limit=${limit}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!req.ok) throw exception({ message: "Failed to get orders", code: req.status });

		return (await req.json()) as EbayFulfillmentResponseProps;
	}
}
