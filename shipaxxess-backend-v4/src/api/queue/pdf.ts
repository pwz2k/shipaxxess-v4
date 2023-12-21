export const pdfDownloadBatchQueue = (batch: MessageBatch<{ label_uuid: string; pdf: string }[]>, env: Bindings) => {
	for (const item of batch.messages) {
		console.log(item.body[0].label_uuid, "-----------------------------WOW");
	}
};
