import { Model } from "@lib/model";
import { payments } from "@schemas/payments";
import { users } from "@schemas/users";
import { Payment } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const Get = (c: Context<App>) => {
	return c.json({});
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

	return c.json({ success: true });
};

const Reject = async (c: Context<App>) => {
	return c.json({});
};

const PaymentsAdmin = { Get, Accept, Reject };

export { PaymentsAdmin };
