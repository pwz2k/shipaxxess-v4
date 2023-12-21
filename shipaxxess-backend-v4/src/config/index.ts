export const config = {
	app: {
		name: "Shipaxxess",
		support: "support@shipaxxess.com",
	},
	jwt: {
		secret: "KRqub7QWY8nczJ9rGNYYcte6IevIcu9m",
		alg: "HS256",
	},
	mail: {
		postalserver: {
			sender: "support@xclusivelabels.com",
			apiKey: "tmGguA24F3jDLs1RbhGD6FEX",
			from: "support@xclusivelabels.com",
			url: "https://smtp.sakibhasan.dev",
		},
	},
	label: {
		url: "https://api.labelaxxess.com",
		headers: { "Content-Type": "application/json", "x-api-key": "RO-ujX-u50l-ANtj78rl-8vNHE69y-qY" },
	},
	packages: {
		max_girth: 108,
	},
	stripe: {
		pubkey:
			"pk_test_51NWzojEUBhXVxoOBfBKOmakGEoongxYWGQ6yiGDgg4F4qK0Ne3xUuylAMfPhjDNcqKss4UM0LJeYBPw2BWlTn1FU00SfA3SFiV",
		seckey:
			"sk_test_51NWzojEUBhXVxoOBJZWPDYz3CPWmGNGxDWkCdVveD9YibuqIE1iHEu60OxggysmhH8YubFwI7Fslwp8ih6jMOihE00riK4M0vh",
		success_url: "http://localhost:5173/payments",
		cancel_url: "http://localhost:5173/payments?payment=canceled&method=card",
	},
	coinbase: {
		apikey: "8a4015b9-6a3c-48d5-a424-5b989edd5ade",
		baseurl: "https://api.commerce.coinbase.com",
		redirect_url: "http://localhost:5173/payments",
		cancel_url: "http://localhost:5173/payments?payment=canceled&method=crypto",
	},
	cloudflare: {
		account_identifier: "554a824a7e17198451f2dd49f8d07636",
		api_email: "shakibhasan.me09@gmail.com",
		api_key: "f0fea3f7b48a8ffc6f3664a91dbf980607a71",
	},
};
