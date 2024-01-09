import { Model } from "@lib/model";
import { users } from "@schemas/users";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
	const model = new Model(c.env.DB);

	const urs = await model.all(users);

	return c.json(urs);
};

const Get = async (c: Context<App, "/:uuid">) => {
	const user_uuid = c.req.param("uuid");

	const model = new Model(c.env.DB);

	const user = await model.get(users, eq(users.uuid, user_uuid));

	return c.json(user);
};

const Create = async (c: Context<App>) => {
	return c.json({});
};

const Edit = async (c: Context<App>) => {
	return c.json({});
};

const Delete = async (c: Context<App>) => {
	return c.json({});
};

const UsersAdmin = { Get, Create, Edit, Delete, GetAll };

export { UsersAdmin };
