import { config } from "@config";
import { Model } from "@lib/model";
import { payments } from "@schemas/payments";
import { users } from "@schemas/users";
import { log } from "@utils/log";
import { mail } from "@utils/mail";
import { getSettings } from "@utils/settings";
import { and, eq } from "drizzle-orm";
import { Context } from "hono";
import Stripe from "stripe";

export const StripeWebhook = async (c: Context<App>) => {
	try {
		const settings = await getSettings(c.env.DB);
		

		if (!settings["stripe_key"] || !settings["stripe_secret"] || !settings["stripe_webhook_secret"]) {
			throw new Error("Can not initialize Stripe without STRIPE_KEY");
		}

		const stripe = new Stripe(settings["stripe_secret"], {
			httpClient: Stripe.createFetchHttpClient(),
		});

		const body = await c.req.raw.text();
	
	
		const sig = c.req.header("stripe-signature");
		if (!sig) throw new Error("No signature");

		const event = await stripe.webhooks.constructEventAsync(body, sig, settings["stripe_webhook_secret"]);

		switch (event.type) {
			case "checkout.session.completed":
				console.log("seesion complete")
				const { metadata } = event.data.object;
				if (!metadata) throw new Error("No metadata");

				const topup_uuid = metadata.topup_uuid;
				const user_id = parseInt(metadata.user_id);

				const model = new Model(c.env.DB);

				const user = await model.get(users, eq(users.id, user_id));
				if (!user) throw new Error("User not found");

				const topup = await model.get(payments, and(eq(payments.uuid, topup_uuid), eq(payments.user_id, user_id)));
				if (!topup) throw new Error("Topup not found");

				await model.update(
					users,
					{
						current_balance: user.current_balance + topup.credit,
					},
					eq(users.id, user_id),
				);

				await model.update(
					payments,
					{
						status: "confirmed",
					},
					eq(payments.uuid, topup_uuid),
				);

				log(`Stripe webhook: ${user.email_address} topped up ${topup.credit} credits`);
				c.executionCtx.waitUntil(
					mail(c.env.DB, {
						to: user.email_address, // Use user's email address
						subject: `Payment Confirmation - ${config.app.name}`,
						html: `
							<p>Hi ${user.first_name},</p>
							<p>Your payment of ${topup.credit} credits has been confirmed.</p>
							<p>Thank you for your purchase!</p>
							<p>Best regards,</p>
							<p>The ${config.app.name} Team</p>
							<p>${config.app.support}</p>`
					})
				);
				return c.json({ success: true });

			case "checkout.session.async_payment_failed":
				const data = event.data.object;
				if (!data.metadata) throw new Error("No metadata");

				const topup_uuid2 = data.metadata.topup_uuid;
				const user_id2 = parseInt(data.metadata.user_id);

				const model2 = new Model(c.env.DB);

				const user2 = await model2.get(users, eq(users.id, user_id2));
				if (!user2) throw new Error("User not found");

				const topup2 = await model2.get(payments, and(eq(payments.uuid, topup_uuid2), eq(payments.user_id, user_id2)));
				if (!topup2) throw new Error("Topup not found");

				await model2.update(
					payments,
					{
						status: "failed",
					},
					eq(payments.uuid, topup_uuid2),
				);
				c.executionCtx.waitUntil(
					mail(c.env.DB, {
						to: user2.email_address, // Use user's email address
						subject: `Payment Faild - ${config.app.name}`,
						html: `
							<p>Hi ${user2.first_name},</p>
							<p>Your payment of ${topup2.credit} credits has been Failed.</p>
							<p>Thank you for your purchase!</p>
							<p>Best regards,</p>
							<p>The ${config.app.name} Team</p>
							<p>${config.app.support}</p>`
					})
				);
				log(`Stripe webhook: ${user2.email_address} failed to top up ${topup2.credit} credits`);

				break;

			default:
				console.log(`Unhandled event type ${event.type}`);
		}
	} catch (err) {
		log(`Stripe webhook error: ${(err as Error).message}`);
		return c.json({ error: (err as Error).message }, 500);
	}
};
