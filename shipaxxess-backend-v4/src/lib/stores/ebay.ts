import { config } from "@config";

export class Ebay {
	constructor() {}

	redirect() {
		return `${config.stores.ebay.baseurl}/oauth2/authorize?client_id=${config.stores.ebay.client_id}&response_type=code&redirect_uri=${config.stores.ebay.redirect_uri}&scope=${config.stores.ebay.scopes}`;
	}
}
