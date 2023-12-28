import schema from "@schemas/index";
import { users } from "@schemas/users";
import { weights } from "@schemas/weights";
import { exception } from "@utils/error";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";

export const findUserById = async (c: Context<App>) => {
	const payload = c.get("jwtPayload") as { id: number };

	const user = await drizzle(c.env.DB).select().from(users).where(eq(users.id, payload.id)).get();
	if (!user) throw exception({ message: "User not found", code: 4005 });

	return user;
};

export const findLabelCostByWeight = async (c: Context<App>, params: { weight: number; type: string; id: number }) => {
	const we = await drizzle(c.env.DB)
		.select()
		.from(weights)
		.where(and(eq(weights.weight, params.weight), eq(weights.type, params.type), eq(weights.type_id, params.id)))
		.get();
	if (!we) throw exception({ message: "Not found", code: 4006 });

	return we;
};

export const findEmailToken = async (c: Context<App>, token: string) => {
	const tk = await drizzle(c.env.DB).select().from(users).where(eq(users.email_token, token)).get();
	if (!tk) throw exception({ message: "Email token not found", code: 4344 });

	return tk;
};

export const demoInsert = async (c: Context<App>) => {
	const da = await drizzle(c.env.DB, { schema }).query.weights.findFirst({
		with: {
			type: true,
		},
		where: eq(weights.id, 1),
	});
};
