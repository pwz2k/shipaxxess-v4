import { config } from "@config";
import { exception } from "./error";

const postalserver = async (payload: Payload, apikey: string, sender: string) => {
	try {
		const req = await fetch(`${config.mail.postalserver.url}/api/v1/send/message`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "X-Server-API-Key": apikey },
			body: JSON.stringify({
				from: sender,
				sender: sender,
				to: payload.to,
				subject: payload.subject,
				html_body: payload.html,
			}),
		});

		const parse = (await req.json()) as PostalserverResponse;

		if (parse.status === "error") {
			throw exception({ message: parse.data.message, code: 9000 });
		}
	} catch (err) {
		throw err;
	}
};

export const mail = async (payload: Payload, apiKey: string, sender: string) => {
	switch (payload.gateway) {
		case "sendgrid":
			break;

		case "mailjet":
			break;

		case "mailgun":
			break;

		default:
			return await postalserver(payload, apiKey, sender);
	}
};
