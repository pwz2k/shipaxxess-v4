import { LabelManager } from "@lib/label";
import { exception } from "@utils/error";
import { getSettings } from "@utils/settings";

type MessageProps = { batch_id: number };

export const batchLabelQueue = async (batch: MessageBatch<MessageProps>, env: Bindings) => {
	for (const item of batch.messages) {
		const settings = await getSettings(env.DB);

		const manager = new LabelManager(env, settings);

		const batch = await manager.getBatchData(item.body.batch_id);
		if (!batch) throw exception({ message: "Batch not found.", code: 404 });

		const user = await manager.getUserData(batch.user_id);
		if (!user) throw exception({ message: "User not found.", code: 404 });

		if (batch.type === "usps") {
			for (const recipient of batch.recipients) {
				await manager.generateUSPSLabelFromBatch(batch, recipient);
			}
		} else {
			for (const recipient of batch.recipients) {
				await manager.generateUPSLabelFromBatch(batch, recipient);
			}
		}

		await manager.saveIntoLabelTableWithDrizzleBatch();
		await manager.sendToBatchDownloadQueue(batch.uuid);

		await manager.saveIntoCronTable();

		item.ack();
	}
};
