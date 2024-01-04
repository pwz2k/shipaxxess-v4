import { LabelGenerator } from "@lib/label";

type MessageProps = { batch_uuid: string; user_cost: number; reseller_cost: number };

export const batchLabelQueue = async (batch: MessageBatch<MessageProps>, env: Bindings) => {
	for (const item of batch.messages) {
		const generator = new LabelGenerator(env);

		const batch = await generator.getBatchByUUID(item.body.batch_uuid);
		if (!batch) throw new Error("Not found any batch on the database");

		const user = await generator.getUserById(batch.user_id);
		if (!user) throw new Error("Not found any user on the database");

		const payload = { batch_uuid: batch.uuid, email: user.email_address, name: user.first_name };

		for (const recipient of batch.recipients) {
			if (batch.type === "usps") {
				await generator.generateUSPSLabel({
					batch,
					recipient,
					cost: { user: item.body.user_cost, reseller: item.body.reseller_cost },
				});
			} else {
				await generator.generateUPSLabel({
					batch,
					recipient,
					cost: { user: item.body.user_cost, reseller: item.body.reseller_cost },
				});
			}
		}

		await generator.saveLabels();
		await generator.sendToDownload({ ...payload, type: batch.type as "usps" });
		await generator.mailNotify("batch_completed", payload);
		await generator.updateBatchStatus(batch.uuid, "completed");
	}
};
