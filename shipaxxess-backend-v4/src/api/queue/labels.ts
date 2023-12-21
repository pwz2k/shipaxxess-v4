type MessageProps = { batch_uuid: string; user_cost: number; reseller_cost: number };

export const batchLabelQueue = async (batch: MessageBatch<MessageProps>, env: Bindings) => {
	for (const item of batch.messages) {
	}
};
