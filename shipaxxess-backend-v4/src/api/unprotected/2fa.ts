import { config } from "@config";
import { Model } from "@lib/model";
import { users } from "@schemas/users";
import { Verify } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { and, eq } from "drizzle-orm";
import { Context } from "hono";
import { sign } from "hono/jwt";

const Post = async (c: Context<App>) => {
	const body = await c.req.json();
	const parse = Verify.ZODSCHEMA.parse(body);

	if (parse.type !== "two_fa") throw exception({ message: "Invalid type", code: 400 });

	const model = new Model(c.env.DB);

	const user = await model.get(
		users,
		and(eq(users.email_address, parse.email_address), eq(users.temp_fa_code, parse.code)),
	);

	if (!user) throw exception({ message: "Invalid code", code: 400 });

	const token = await sign(
		{
			id: user.id,
			uuid: user.uuid,
			email_address: user.email_address,
			first_name: user.first_name,
			last_name: user.last_name,
		},
		config.jwt.secret,
		config.jwt.alg as "HS256",
	);

	return c.json({ token });
};

export const FA = { Post };
