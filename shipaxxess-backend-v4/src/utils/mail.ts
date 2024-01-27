import nodemailer from "nodemailer";
import { log } from "./log";
import { getSettings } from "./settings";

export const mail = async (db: D1Database, payload: Payload) => {
	try {
		const settings = await getSettings(db);

		if (!settings["email_smtp_host"]) throw new Error("SMTP host not set");
		if (!settings["email_smtp_port"]) throw new Error("SMTP port not set");
		if (!settings["email_smtp_user"]) throw new Error("SMTP user not set");
		if (!settings["email_smtp_password"]) throw new Error("SMTP password not set");
		if (!settings["email_from_name"]) throw new Error("From name not set");
		if (!settings["email_from_address"]) throw new Error("From address not set");

		const transporter = nodemailer.createTransport({
			host: settings["email_smtp_host"],
			port: Number(settings["email_smtp_port"]),
			auth: {
				user: settings["email_smtp_user"],
				pass: settings["email_smtp_password"],
			},
		});

		const info = await transporter.sendMail({
			from: `"${settings["email_from_name"]}" <${settings["email_from_address"]}>`,
			to: payload.to,
			subject: payload.subject,
			html: payload.html,
		});

		log(`Message sent: ${info.messageId}`);
	} catch (error) {
		log(`Error sending email: ${(error as Error).message}`);
	}
};
