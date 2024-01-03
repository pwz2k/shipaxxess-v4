import { LabelDownloader } from "@lib/label";
import PDFMerger from "pdf-merger-js";

type QueueProps = { batch_uuid: string; pdfs: string[]; email: string; name: string };

export const pdfDownloadBatchQueue = async (batch: MessageBatch<QueueProps>, env: Bindings) => {
	for (const item of batch.messages) {
		const merger = new PDFMerger();
		const manager = new LabelDownloader(env, merger);

		for (const pdf of item.body.pdfs) {
			await manager.downloadLabel(pdf);
		}

		await manager.saveMergedPdf(item.body.batch_uuid);
		await manager.updateBatchStatus(item.body.batch_uuid);
		await manager.mailNotify({ batch_uuid: item.body.batch_uuid, email: item.body.email, name: item.body.name });
	}
};
