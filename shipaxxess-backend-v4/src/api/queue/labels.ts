import { Model } from "@lib/model";
import { batchs } from "@schemas/batchs";
import { eq } from "drizzle-orm";

export const batchLabelQueue = async (batch: MessageBatch<{ batch_uuid: string }>, env: Bindings) => {
	const model = new Model(env.DB);

	for (const item of batch.messages) {
		const batch = await model.get(batchs, eq(batchs.uuid, item.body.batch_uuid));

		for (const recipient of batch.recipients) {
			console.log(recipient, recipient.state, "------------WOOW");
		}
	}
};
