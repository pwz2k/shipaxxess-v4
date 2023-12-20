import { Context } from "hono";

const Get = (c: Context<App>) => {
	return c.json({});
};

const Accept = async (c: Context<App>) => {
	return c.json({});
};

const Reject = async (c: Context<App>) => {
	return c.json({});
};

const PaymentsAdmin = { Get, Accept, Reject };

export { PaymentsAdmin };
