import { Context } from "hono";

export const WebSocketUser = (c: Context<App>) => {
	const upgradeHeader = c.req.header("Upgrade");

	if (!upgradeHeader || upgradeHeader !== "websocket") {
		return new Response("Expected Upgrade: websocket", { status: 426 });
	}

	const webSocketPair = new WebSocketPair();
	const [client, server] = Object.values(webSocketPair);

	server.accept();

	server.addEventListener("open", async () => {});

	server.addEventListener("message", async (event) => {});

	server.addEventListener("error", async () => {
		client.close();
		server.close();
	});

	server.addEventListener("close", async () => {
		client.close();
		server.close();
	});

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
};
