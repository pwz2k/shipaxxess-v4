import { Context } from "hono";

const Get = (c: Context<App>) => {
	return c.json({});
};

const Find = async (c: Context<App, "/:ticket_id">) => {
	return c.json({});
};

const PostMessage = async (c: Context<App>) => {
	return c.json({});
};

const Close = async (c: Context<App>) => {
	return c.json({});
};

const TicketsAdmin = { Get, Find, PostMessage, Close };

export { TicketsAdmin };
