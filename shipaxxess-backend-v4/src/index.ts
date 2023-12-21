import { admin } from "@api/admin/routes";
import { batchLabelQueue } from "@api/queue/labels";
import { unprotected } from "@api/unprotected/routes";
import { user } from "@api/user/routes";
import { webhook } from "@api/webhook/routes";
import { WebSocketUser } from "@api/websocket";
import { config } from "@config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { ZodError } from "zod";

const app = new Hono<App>({ strict: true }).basePath("/v1");

/**
 * Middlewares
 */
app.use("*", logger());
app.use("*", cors());
app.use("*", prettyJSON());
app.use("/user/*", jwt({ secret: config.jwt.secret }));
app.use("/admin/*", jwt({ secret: config.jwt.secret }));

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
app.onError((err, c) => {
	if (err instanceof ZodError) {
		if (err.issues[0].path[2]) {
			return c.json(
				{
					message: `${err.issues[0].path[2]} is ${err.issues[0].message} on row ${
						parseInt(err.issues[0].path[1] as string) + 1
					}`,
				},
				500,
			);
		}

		if (err.issues[0].path[0]) {
			return c.json(
				{
					message: `${err.issues[0].path[0]} is ${err.issues[0].message}`,
				},
				500,
			);
		}
	}

	if (err instanceof HTTPException) {
		return err.getResponse();
	}

	try {
		return c.json(JSON.parse(err.message), 500);
	} catch (error) {
		return c.json({ message: err.message }, 500);
	}
});

export default {
	fetch(req: Request, env: Bindings, ctx: ExecutionContext) {
		return app.fetch(req, env, ctx);
	},
	queue(batch: MessageBatch<any>, env: Bindings) {
		switch (batch.queue) {
			case "batch-labels": {
				return batchLabelQueue(batch, env);
			}

			default: {
				return;
			}
		}
	},
};
