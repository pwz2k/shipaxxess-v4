import { Model } from "@lib/model";
import { chats } from "@schemas/chats";
import { tickets } from "@schemas/tickets";
import { users } from "@schemas/users";
import { Chats, Id } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { v4 } from "uuid";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const tk = await model.all(tickets);

	return c.json(tk);
};

const Get = async (c: Context<App, "/:uuid">) => {
	const ticket_uuid = c.req.param("uuid");

	const model = new Model(c.env.DB);

	const tk = await model.get(tickets, eq(tickets.uuid, ticket_uuid));
	if (!tk) throw exception({ message: "Ticket not found", code: 404 });

	const cht = await model.all(chats, eq(chats.ticket_uuid, ticket_uuid));

	return c.json({ ticket: tk, chats: cht });
};

const PostMessage = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Chats.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const tk = await model.get(tickets, eq(tickets.id, parse.id));
	if (!tk) throw exception({ message: "Ticket not found", code: 404 });

	const user = await model.get(users, eq(users.id, c.get("jwtPayload").id));
	if (!user) throw exception({ message: "User not found", code: 5564 });

	const [cht] = await model.insert(chats, {
		message: parse.message,
		message_author: `${user.first_name} ${user.last_name}`,
		ticket_uuid: tk.uuid,
		message_profile: `${user.first_name.charAt(1)}${user.last_name.charAt(1)}`,
		user_id: c.get("jwtPayload").id,
		uuid: v4(),
	});

	return c.json(cht);
};

const Close = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Id.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const tk = await model.get(tickets, eq(tickets.id, parse.id));
	if (!tk) throw exception({ message: "Ticket not found", code: 404 });

	await model.update(
		tickets,
		{
			status: "closed",
		},
		eq(tickets.id, parse.id),
	);

	return c.json({ success: true });
};

const TicketsAdmin = { Get, GetAll, PostMessage, Close };

export { TicketsAdmin };
