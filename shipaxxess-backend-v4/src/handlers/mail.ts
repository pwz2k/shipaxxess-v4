import { connect } from "cloudflare:sockets";
import { Context } from "hono";

export const mailhandler = async (c: Context<App>) => {
	const smtpAddr = { hostname: "mail.privateemail.com", port: 587 };

	try {
		const socket = connect(smtpAddr);

		const reader = socket.readable.getReader();
		const writer = socket.writable.getWriter();
		const encoder = new TextEncoder();

		const encoded = encoder.encode(`HELO ${smtpAddr.hostname}\r\n`);
		await writer.write(encoded);
		const encodedRead = await reader.read();
		console.log(encodedRead.value);

		// const encoded2 = encoder.encode(`AUTH LOGIN\r\n`);
		// await writer.write(encoded2);
		// const encodedRead2 = await reader.read();
		// console.log(encodedRead2.value);

		// const encoded3 = encoder.encode(`dGVzdEBzaGlwYXh4LmNvbQ==\r\n`);
		// await writer.write(encoded3);
		// const encodedRead3 = await reader.read();
		// console.log(encodedRead3.value);

		// const encoded4 = encoder.encode(`dGVzdEBzaGlwYXh4\r\n`);
		// await writer.write(encoded4);
		// const encodedRead4 = await reader.read();
		// console.log(encodedRead4.value);

		return new Response(socket.readable, { headers: { "Content-Type": "text/plain" } });
	} catch (error) {
		return new Response("Socket connection failed: " + error, { status: 500 });
	}
};
