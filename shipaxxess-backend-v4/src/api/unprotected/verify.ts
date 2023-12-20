import { config } from "@config";
import { Model } from "@lib/model";
import { users } from "@schemas/users";
import { hash } from "@utils/hash";
import { mail } from "@utils/mail";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { z } from "zod";

const VerifyZodSchema = z.object({
	token: z.string().uuid(),
	type: z.enum(["email_verification", "reset"]),
});

export const VerifyUser = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = VerifyZodSchema.parse(body);

	const model = new Model(c.env.DB);

	const us = await model.read(users, eq(users.email_token, parse.token));

	if (parse.type === "email_verification") {
		return c.json({ message: "Email verified. Please login" });
	}

	const pain_passwd = Math.floor(Math.random() * 1000000000).toString();
	const passwd_hash = await hash(pain_passwd);
	await model.update(users, { password: passwd_hash }, eq(users.id, us.id));

	// Verification mail
	await mail({
		to: [us.email_address],
		subject: `Your new ${config.app.name} password`,
		html: `
		<p>Hi ${us.first_name}, We generated a new password for your account. you can use it to login in your account. But we recommed once you logged in please change the generated password for better privacy</p>
		<p>Your username is:</p>
		<p>${us.email_address}</p>
		<p>Your password is:</p>
		<p>${pain_passwd}</p>
		<p>Thanks!</p>
		<p>The ${config.app.name} Team</p>`,
	});

	return c.json({ message: "We just sent you a mail with new password. please check your inbox" });
};
