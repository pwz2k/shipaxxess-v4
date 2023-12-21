import { Model } from "@lib/model";
import { chats } from "@schemas/chats";
import { tickets } from "@schemas/tickets";
import { users } from "@schemas/users";
import { Chats, Tickets } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { v4, validate } from "uuid";

const Get = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const tk = await model.all(tickets, eq(tickets.user_id, c.get("jwtPayload").id));

	return c.json(tk);
};

const Create = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = Tickets.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const user = await model.get(users, eq(users.id, c.get("jwtPayload").id));

	const ticket_uuid = v4();
	await model.create(tickets, {
		content: parse.content,
		title: parse.title,
		type: parse.type,
		user_id: c.get("jwtPayload").id,
		uuid: ticket_uuid,
		data_id: parse.data_id,
	});

	await model.create(chats, {
		message: parse.content,
		message_author: `${user.first_name} ${user.last_name}`,
		message_profile: `${user.first_name.charAt(1)}${user.last_name.charAt(1)}`,
		ticket_uuid: ticket_uuid,
		user_id: user.id,
		uuid: v4(),
	});

	return c.json({ success: true });
};

const Find = async (c: Context<App, "/:ticket_id">) => {
	// Validation
	const ticket_id = c.req.param("ticket_id");

	if (!validate(ticket_id)) throw exception({ message: "Invalid ticket id", code: 5564 });

	const model = new Model(c.env.DB);

	const tk = await model.get(tickets, eq(tickets.uuid, ticket_id));

	const ct = await model.all(chats, eq(chats.ticket_uuid, ticket_id));

	return c.json({ ticket: tk, chats: ct });
};

const PostMessage = async (c: Context<App, "/:ticket_id">) => {
	const body = await c.req.json();
	const parse = Chats.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const user = await model.get(users, eq(users.id, c.get("jwtPayload").id));

	const chat_uuid = v4();
	await model.create(chats, {
		message: parse.message,
		message_author: `${user.first_name} ${user.last_name}`,
		message_profile: `${user.first_name.charAt(1)}${user.last_name.charAt(1)}`,
		ticket_uuid: c.req.param("ticket_id"),
		user_id: user.id,
		uuid: chat_uuid,
	});

	const chat = await model.get(chats, eq(chats.uuid, chat_uuid));

	return c.json(chat);
};

const TicketsUser = { Create, Get, Find, PostMessage };

export { TicketsUser };
