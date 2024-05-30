import { Context } from "hono";

// Global storage for WebSocket connections
const connections = new Set<WebSocket>();

export const WebSocketUser = (c: Context<App>) => {
    const upgradeHeader = c.req.header("Upgrade");

    if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();

    // Add the connection to the global storage
    connections.add(server);

    server.addEventListener("open", async () => {
        server.send("Hello, this is a message");
    });

    server.addEventListener("message", async (event) => {
        server.send("Message: " + event.data);
    });

    server.addEventListener("error", async () => {
        console.log("Error");
        connections.delete(server);
        server.close();
    });

    server.addEventListener("close", async () => {
        console.log("Server is closing");
        connections.delete(server);
        server.close();
    });

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
};

// Function to send notifications to all connected clients
export const sendNotificationToAll = (message: string | ArrayBuffer | ArrayBufferView) => {
	console.log("sending notifictons")
    connections.forEach((socket) => {
        if (socket.readyState === WebSocket.READY_STATE_OPEN) {
            socket.send(message);
        }
    });
};
