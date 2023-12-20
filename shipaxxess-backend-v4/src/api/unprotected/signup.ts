import { config } from "@config";
import { users } from "@schemas/users";
import { Signup } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { hash } from "@utils/hash";
import { mail } from "@utils/mail";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { v4 } from "uuid";

export const SignUpUser = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = Signup.ZODSCHEMA.parse(body);

	//  Check account
	const haveUser = await drizzle(c.env.DB)
		.select()
		.from(users)
		.where(eq(users.email_address, parse.email_address))
		.get();
	if (haveUser) throw exception({ message: "Already have an account", code: 1000 });

	//  Entry user
	const email_token = v4();
	const passwordHash = await hash(parse.password);
	const insert = await drizzle(c.env.DB)
		.insert(users)
		.values({
			uuid: v4(),
			first_name: parse.first_name,
			last_name: parse.last_name,
			email_address: parse.email_address,
			password: passwordHash,
			email_token,
			refer_from: parse.refer_from ? parse.refer_from : null,
			remember_last_ip: c.req.header("cf-connecting-ip"),
		});
	if (!insert.success) throw exception({ message: "Failed to insert the user", code: 1005 });

	// Verification mail
	c.executionCtx.waitUntil(
		mail({
			to: [parse.email_address],
			subject: `Please verify your ${config.app.name} Account`,
			html: `
		<p>Thanks for signing up! Please verify this is your correct email by simply clicking the link below. You can then log into your account.</p>
		<p>Your Username is</p>
		<p>${parse.email_address}</p>
		<p>Thanks!</p>
		<p>The ${config.app.name} Team</p>
		<br/>
		<a href="${c.env.FRONTEND_URL}/verify?token=${email_token}&date=${Date.now()}">${
				c.env.FRONTEND_URL
			}/verify?token=${email_token}&date=${Date.now()}</a>
		`,
		}),
	);

	return c.json({
		message: "Verification mail is sent to your email address, please check the inbox/spam folder",
		code: 1004,
	});
};
