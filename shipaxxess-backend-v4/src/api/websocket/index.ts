import { Context } from "hono";

export const WebSocketUser = (c: Context<App>) => {
	const upgradeHeader = c.req.header("Upgrade");

	if (!upgradeHeader || upgradeHeader !== "websocket") {
		return new Response("Expected Upgrade: websocket", { status: 426 });
	}

	const webSocketPair = new WebSocketPair();
	const [client, server] = Object.values(webSocketPair);

	server.accept();

	server.addEventListener("open", async () => {
		
		server.send("hellow this is message")
	});

	server.addEventListener("message", async (event) => {
		
		server.send("message"+ event.data)
	});

	server.addEventListener("error", async () => {
		console.log("error")
		client.close();
		server.close();
	});

	server.addEventListener("close", async () => {
		console.log("server is closing")
		client.close();
		server.close();
	});

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
};
