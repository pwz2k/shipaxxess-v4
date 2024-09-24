import { user } from "@api/user/routes";
import { config } from "@config";
import { Model } from "@lib/model";
import { payments } from "@schemas/payments";
import { users } from "@schemas/users";
import { Payment } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { mail } from "@utils/mail";
import { eq, ne } from "drizzle-orm";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const pt = await model.all(payments, ne(payments.gateway, "payment"));

	return c.json(pt);
};

const Accept = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Payment.ACCEPTSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const payment = await model.get(payments, eq(payments.id, parse.payment_id));
	if (!payment) throw exception({ message: "Payment not found", code: 404 });

	await model.update(
		payments,
		{
			status: "confirmed",
		},
		eq(payments.id, parse.payment_id),
	);

	await model.update(
		users,
		{
			current_balance: payment.new_balance,
		},
		eq(users.id, payment.user_id),
	);

	const emailBody = `<p>Hi ${payment.user_name},</p>
	<p>Your Payment request has been accepted by admin</p>
	<p>Payment Request Id: ${payment.uuid}</p>
	

	<p>Thanks</p>
	<p>The ${config.app.name} Team</p>

`;

	//send an email to user to notify payment decline on account
	c.executionCtx.waitUntil(
		mail(c.env.DB, {
			to: payment.user_email,
			subject: "Your payment requested accepted",
			html: emailBody,
		}),
	);

	return c.json({ success: true });
};

const Reject = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Payment.REJECTSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const payment = await model.get(payments, eq(payments.id, parse.payment_id));
	if (!payment) throw exception({ message: "Payment not found", code: 404 });

	await model.update(
		payments,
		{
			status: "rejected",
			new_balance: payment.current_balance,
		},
		eq(payments.id, parse.payment_id),
	);

	const emailBody = `<p>Hi ${payment.user_name},</p>
			<p>Your Payment request has been rejected by admin</p>
			<p>Payment Request Id: ${payment.uuid}</p>
			

			<p>Thanks</p>
			<p>The ${config.app.name} Team</p>

`;

	//send an email to user to notify payment decline on account
	c.executionCtx.waitUntil(
		mail(c.env.DB, {
			to: payment.user_email,
			subject: "Your payment requested rejected",
			html: emailBody,
		}),
	);

	return c.json({ success: true });
};

const PaymentsAdmin = { GetAll, Accept, Reject };

export { PaymentsAdmin };
