import { Model } from "@lib/model";
import { payments } from "@schemas/payments";
import { users } from "@schemas/users";
import { Payment } from "@shipaxxess/shipaxxess-zod-v4";
import { coinbaseCharge } from "@utils/coinbase";
import { stripeCheckout } from "@utils/stripe";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { v4 } from "uuid";

const Get = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const pt = await model.all(payments, eq(payments.user_id, c.get("jwtPayload").id));

	return c.json(pt);
};

const Create = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = Payment.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const user = await model.get(users, eq(users.id, c.get("jwtPayload").id));

	const payment_uuid = v4();

	await model.create(payments, {
		credit: parse.credit,
		gateway: parse.gateway,
		current_balance: user.current_balance,
		new_balance: user.current_balance + parse.credit,
		user_id: user.id,
		uuid: payment_uuid,
	});

	// Handle card payment
	if (parse.gateway === "card") {
		const res = await stripeCheckout({
			amount: parse.credit,
			title: "Demo app topup",
			topup_uuid: payment_uuid,
			user_id: c.get("jwtPayload").id,
		});

		return c.json({ url: res.url });
	}

	// Hanlde crypto payment
	if (parse.gateway === "crypto") {
		const res = await coinbaseCharge({
			amount: parse.credit,
			topup_uuid: payment_uuid,
			user_id: c.get("jwtPayload").id,
		});
		return c.json({ url: res.hosted_url });
	}

	return c.json({ success: true });
};

const PaymentUser = { Create, Get };

export { PaymentUser };
