import { batchs } from "@schemas/batchs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import PDFMerger from "pdf-merger-js";

export const pdfDownloadBatchQueue = async (
	batch: MessageBatch<{ batch_uuid: string; pdfs: string[] }>,
	env: Bindings,
) => {
	for (const item of batch.messages) {
		const merger = new PDFMerger();

		for (const pdf of item.body.pdfs) {
			const st = performance.now();

			const req = await fetch(pdf);
			const buffer = await req.arrayBuffer();

			const r2 = await env.LABELS_BUCKET.put(pdf.split("/")[4], buffer);
			if (r2 === null) {
				console.log("buffer in null");
				continue;
			}

			try {
				await merger.add(buffer, "1-1");
			} catch (error) {
				await merger.add(buffer);
			}

			console.log(`${pdf.split("/")[4]} took:`, performance.now() - st, "ms");
		}

		const mergePdfBuffer = await merger.saveAsBuffer();

		const r2batch = await env.LABELS_BUCKET.put(`${item.body.batch_uuid}.pdf`, mergePdfBuffer);
		if (r2batch === null) {
			console.log("something went wrong with batch pdf merger r2");
		}

		const update = await drizzle(env.DB)
			.update(batchs)
			.set({ is_downloaded: true })
			.where(eq(batchs.uuid, item.body.batch_uuid));
		if (!update) {
			console.log("Update failed");
		}
	}
};
