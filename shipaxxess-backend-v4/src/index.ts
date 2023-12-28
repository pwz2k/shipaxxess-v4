import app from "@handlers/app";
import { queue } from "@handlers/queue";

export default {
	fetch(req: Request, env: Bindings, ctx: ExecutionContext) {
		return app.fetch(req, env, ctx);
	},
	queue(batch: MessageBatch<any>, env: Bindings) {
		return queue(batch, env);
	},
};
