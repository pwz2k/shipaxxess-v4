import { config } from "@config";
import { exception } from "./error";

const postalserver = async (payload: Payload) => {
	try {
		const req = await fetch(`${config.mail.postalserver.url}/api/v1/send/message`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "X-Server-API-Key": config.mail.postalserver.apiKey },
			body: JSON.stringify({
				from: config.mail.postalserver.from,
				sender: config.mail.postalserver.sender,
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

export const mail = async (payload: Payload) => {
	switch (payload.gateway) {
		case "sendgrid":
			break;

		case "mailjet":
			break;

		case "mailgun":
			break;

		default:
			return await postalserver(payload);
	}
};
