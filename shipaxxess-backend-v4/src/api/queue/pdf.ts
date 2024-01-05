import { LabelManager } from "@lib/label";
import { getSettings } from "@utils/settings";
import PDFMerger from "pdf-merger-js";

type QueueProps = { pdfs: PDFInsertModel[]; batch_uuid: string };

export const pdfDownloadBatchQueue = async (batch: MessageBatch<QueueProps>, env: Bindings) => {
	for (const item of batch.messages) {
		const settings = await getSettings(env.DB);

		const merger = new PDFMerger();
		const manager = new LabelManager(env, settings);

		for (const pdf of item.body.pdfs) {
			if (pdf.pdf === "") continue;

			var buffer: ArrayBuffer;

			if (pdf.type === "usps") {
				buffer = await manager.downloadUSPSLabel(pdf.pdf);
			} else {
				buffer = await manager.downloadUPSLabel(pdf.pdf);
			}

			try {
				await merger.add(buffer, "1-1");
			} catch (error) {
				await merger.add(buffer);
			}
		}

		await manager.downloadMergePdf(`${item.body.batch_uuid}.pdf`, merger);

		await manager.updateLabelBatchStatus(item.body.batch_uuid);

		await manager.notifyBatchDownloadCompleteEvent(item.body.batch_uuid);
	}
};
