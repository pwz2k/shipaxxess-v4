import { config } from "@config";
import { Model } from "@lib/model";
import { chats } from "@schemas/chats";
import { tickets } from "@schemas/tickets";
import { users } from "@schemas/users";
import { Chats, Tickets } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { mail } from "@utils/mail";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { v4, validate } from "uuid";

const Get = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const tk = await model.all(tickets, eq(tickets.user_id, c.get("jwtPayload").id));

	return c.json(tk);
};

const Create = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Tickets.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const user = await model.get(users, eq(users.id, c.get("jwtPayload").id));
	if (!user) throw exception({ message: "User not found", code: 5564 });

	const ticket_uuid = v4();
	await model.insert(tickets, {
		content: parse.content,
		title: parse.title,
		type: parse.type,
		user_id: c.get("jwtPayload").id,
		uuid: ticket_uuid,
		data_id: parse.data_id,
	});

	await model.insert(chats, {
		message: parse.content,
		message_author: `${user.first_name} ${user.last_name}`,
		message_profile: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
		ticket_uuid: ticket_uuid,
		user_id: user.id,
		uuid: v4(),
	});
	const admins = await model.all(users, eq(users.isadmin, true));
	const adminEmails = admins.map((a) => a.email_address);
	let emailBody = ``;

	let emailSubject = ``;

	if (parse.type === "label") {
		// tell the admin that new ticket has been created for label
		emailBody = `
	<p>Hi Admin,</p>
	<p>A new ticket has been created for label</p>
	<p>Thanks!</p>
	<p>The ${config.app.name} Team</p>
	`;
		emailSubject = `New ticket created for label`;
	}
	else if (parse.type === "payment") {
		// tell the admin that new ticket has been created for payment
		emailBody = `
	<p>Hi Admin,</p>
	<p>A new ticket has been created for payment</p>
	<p>Thanks!</p>
	<p>The ${config.app.name} Team</p>
	`;
		emailSubject = `New ticket created for payment`;
	}
	else if (parse.type === "referal") {
		// tell the admin that new ticket has been created for general
		emailBody = `
	<p>Hi Admin,</p>
	<p>A new ticket has been created for referal</p>
	<p>Thanks!</p>
	<p>The ${config.app.name} Team</p>
	`;
		emailSubject = `New ticket created for referal`;
	}
	else {
		// tell the admin that new ticket has been created for general
		emailBody = `
	<p>Hi Admin,</p>
	<p>A new ticket has been created for general</p>
	<p>Thanks!</p>
	<p>The ${config.app.name} Team</p>
	`;
		emailSubject = `New ticket created for general`;
	}


	console.log("adminEmails", adminEmails)
	if (admins.length > 0) {

		c.executionCtx.waitUntil(
			mail(c.env.DB, {
				to: adminEmails[0],
				subject: emailSubject,
				html: emailBody,
			}),
		);
	}


	return c.json({ success: true });
};

const Find = async (c: Context<App, "/:ticket_id">) => {
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
	if (!user) throw exception({ message: "User not found", code: 5564 });

	const chat_uuid = v4();
	await model.insert(chats, {
		message: parse.message,
		message_author: `${user.first_name} ${user.last_name} `,
		message_profile: `${user.first_name.charAt(0)}${user.last_name.charAt(0)} `,
		ticket_uuid: c.req.param("ticket_id"),
		user_id: user.id,
		uuid: chat_uuid,
	});

	const chat = await model.get(chats, eq(chats.uuid, chat_uuid));

	const admins = await model.all(users, eq(users.isadmin, true));
	// add message from user to admin 



	let emailBody = `
	<p>Hi Admin,</p>
	<p>A new message has been posted by ${user.first_name} ${user.last_name} </p>
	<p>Reply: ${parse.message}</p>
	
	<p>Thanks!</p>
	<p>The ${config.app.name} Team</p>
	`;
	let emailSubject = `
	New message from ${user.first_name} ${user.last_name}

	`;


	if (admins.length > 0) {
		const adminEmails = admins.map((a) => a.email_address);
		c.executionCtx.waitUntil(
			mail(c.env.DB, {
				to: adminEmails[0],
				subject: emailSubject,
				html: emailBody
			}),
		);
	}



	return c.json(chat);
};

const TicketsUser = { Create, Get, Find, PostMessage };

export { TicketsUser };

