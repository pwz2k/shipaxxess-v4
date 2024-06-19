export const config = {
	app: {
		name: "Xclusivelabels",
		support: "support@xclusivelabels.com",
		url: "https://xclusivelabels.com",
		loclhost: "http://localhost:5173",
		VAPID_PUBLIC_KEY: "BCK9cDqQ3T_Pgd2uUMqwSU6Yg4XSOuc5kYHUHgYq73xVRx88KYlp5T68vcHaXp-HVcoN30323jzsXRrlXk6sx-g",
		VAPID_PRIVATE_KEY: "YWPkthj1WqFzryEZOND0E-W8jhpLn_aVMjUJsKfTYC0",
		EMAIL: "mydev.com2@gmail.com"
	},
	jwt: {
		secret: "KRqub7QWY8nczJ9rGNYYcte6IevIcu9m",
		alg: "HS256",
		admin: "5aee2c98-3094-4c90-8229-a8f0bc27aa22",
	},
	mail: "https://nodemailer-vercel-ten.vercel.app/api",
	packages: {
		usps_max_girth: 108,
		ups_max_girth: 160,
	},
	cloudflare: {
		account_identifier: "554a824a7e17198451f2dd49f8d07636",
		api_email: "shakibhasan.me09@gmail.com",
		api_key: "f0fea3f7b48a8ffc6f3664a91dbf980607a71",
	},
	stores: {
		ebay: {
			baseurl: "https://api.sandbox.ebay.com",
			authurl: "https://auth.sandbox.ebay.com",
			client_id: "Corneliu-Saveneur-SBX-a94db0756-1ec480c7",
			client_secret: "SBX-94e46b3523b1-8058-4c95-b68c-5	7af",
			hex_code:
				"Q29ybmVsaXUtU2F2ZW5ldXItU0JYLWE5NGRiMDc1Ni0xZWM0ODBjNzpTQlgtOTRlNDZiMzUyM2IxLTgwNTgtNGM5NS1iNjhjLTU3YWY=",
			redirect_uri: "Cornelius_Wilso-Corneliu-Savene-votick",
			scopes:
				"https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/commerce.identity.readonly https://api.ebay.com/oauth/api_scope/commerce.notification.subscription https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly",
		},
	},
};
