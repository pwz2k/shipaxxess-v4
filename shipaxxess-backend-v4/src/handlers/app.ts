import { admin } from "@api/admin/routes";
import { unprotected } from "@api/unprotected/routes";
import { user } from "@api/user/routes";
import { webhook } from "@api/webhooks/routes";
import { WebSocketUser } from "@api/websocket";
import { config } from "@config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { error } from "./error";

const app = new Hono<App>({ strict: true }).basePath("/v1");

/**
 * Middlewares
 */
app.use("*", logger());
app.use("*", cors());
app.use("*", prettyJSON());
app.use("/user/*", jwt({ secret: config.jwt.secret }));
app.use("/admin/*", jwt({ secret: config.jwt.admin }));

/**
 * Websocket routes
 */
app.get("/websocket", WebSocketUser);

/**
 * Webhooks routes
 */
app.route("/webhooks", webhook);

/**
 * Unprotected routes
 */
app.route("/", unprotected);

/**
 * Protected routes
 **/
app.route("/user", user);

/**
 * Admin routes
 */
app.route("/admin", admin);

/**
 * Error
 */
app.onError(error);

export default app;
