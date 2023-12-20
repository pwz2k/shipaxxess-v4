import { config } from "@config";
import Stripe from "stripe";

type PayloadProps = { amount: number; topup_uuid: string; title: string; user_id: number };

export const stripeCheckout = async (payload: PayloadProps) => {
	const stripe = new Stripe(config.stripe.seckey, {
		apiVersion: "2023-10-16",
	});

	const session = await stripe.checkout.sessions.create({
		success_url: `${config.stripe.success_url}/topups?response=success&gateway=stripe`,
		cancel_url: `${config.stripe.cancel_url}/topups?response=cancel&gateway=stripe`,
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: { name: payload.title },
					unit_amount: payload.amount * 100,
				},
				quantity: 1,
			},
		],
		metadata: {
			topup_uuid: payload.topup_uuid,
			user_id: payload.user_id,
		},
		mode: "payment",
	});

	if (!session.url) throw new Error("URL not found");

	return session;
};
