import { Model } from "@lib/model";
import { users } from "@schemas/users";
import { Settings } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const Get = async (c: Context<App>) => {
	const model = new Model(c.env.DB);
	const user = await model.get(users, eq(users.id, c.get("jwtPayload").id));

	return c.json(user);
};

const Edit = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = Settings.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const user = await model.get(users, eq(users.id, c.get("jwtPayload").id));
	if (!user) throw exception({ message: "User not found", code: 404 });

	await model.update(users, parse, eq(users.id, user.id));

	return c.json({ success: true });
};

export const SettingsUser = { Edit, Get };
