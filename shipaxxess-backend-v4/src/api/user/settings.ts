import { Model } from "@lib/model";
import { users } from "@schemas/users";
import { Settings } from "@shipaxxess/shipaxxess-zod-v4";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const Edit = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = Settings.ZODSCHEMA.parse(body);

	const model = new Model(c.env.DB);

	const user = await model.read(users, eq(users.id, c.get("jwtPayload").id));

	await model.update(users, parse, eq(users.id, user.id));

	return c.json({ success: true });
};

const SettingsUser = { Edit };

export { SettingsUser };
