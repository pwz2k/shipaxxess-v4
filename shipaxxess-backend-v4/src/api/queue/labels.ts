import { Model } from "@lib/model";
import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { fetch_ } from "@utils/fetch";
import { eq } from "drizzle-orm";

export const batchLabelQueue = async (
	batch: MessageBatch<{ batch_uuid: string; user_cost: number; reseller_cost: number }>,
	env: Bindings,
) => {
	for (const item of batch.messages) {
		const model = new Model(env.DB);

		const batch = await model.get(batchs, eq(batchs.uuid, item.body.batch_uuid));

		const labels_pdf: { label_uuid: string; pdf: string }[] = [];

		for (const recipient of batch.recipients) {
			try {
				await model.insert(labels, {
					uuid: recipient.uuid,
					user_id: batch.user_id,
					batch_uuid: item.body.batch_uuid,

					// Costs
					cost_user: item.body.user_cost,
					cost_reseller: item.body.reseller_cost,

					// Package
					package_id: batch.package_id,
					package_uuid: batch.package_uuid,
					package_name: batch.package_name,
					package_width: batch.package_width,
					package_height: batch.package_height,
					package_length: batch.package_length,
					package_weight: batch.package_weight,

					// Recipient
					recipent_city: recipient.city,
					recipent_country: recipient.country,
					recipent_full_name: recipient.full_name,
					recipent_state: recipient.state,
					recipent_street_one: recipient.street_one,
					recipent_zip: recipient.zip,
					recipent_company_name: recipient.company_name,
					recipent_street_two: recipient.street_two,

					// Sender
					sender_city: batch.sender_city,
					sender_country: batch.sender_country,
					sender_full_name: batch.sender_full_name,
					sender_state: batch.sender_state,
					sender_street_one: batch.sender_street_one,
					sender_zip: batch.sender_zip,
					sender_company_name: batch.sender_company_name,
					sender_street_two: batch.sender_street_two,

					// Type
					type: batch.type,
					type_label: batch.type_label,
					type_unit: batch.type_unit,
					type_value: batch.type_value,

					shipping_date: batch.shipping_date,
				});

				const res = await fetch_<{ pdf: string; code: string; id: number }>("/api/label/generate", {
					type: batch.type_value,
					weight: batch.package_weight,
					date: batch.shipping_date,
					fromCountry: batch.sender_country,
					fromName: batch.sender_full_name,
					fromRefNumber: batch.sender_company_name,
					fromStreetNumber: batch.sender_street_one,
					fromStreetNumber2: batch.sender_street_two,
					fromZip: batch.sender_zip,
					fromCity: batch.sender_city,
					fromState: batch.sender_state,
					toCountry: recipient.country,
					toName: recipient.full_name,
					toRefNumber: recipient.company_name,
					toStreetNumber: recipient.street_one,
					toStreetNumber2: recipient.street_two,
					toZip: recipient.zip,
					toCity: recipient.city,
					toState: recipient.state,
				});

				await model.update(
					labels,
					{
						remote_id: res.payload.id,
						remote_tracking_number: res.payload.code,
						remote_pdf_link: res.payload.pdf.split("/")[4],
						remote_pdf_r2_link: res.payload.pdf.split("/")[4],
						status_label: "awaiting",
					},
					eq(labels.uuid, recipient.uuid),
				);

				labels_pdf.push({ label_uuid: recipient.uuid, pdf: res.payload.pdf.split("/")[4] });
			} catch (err) {
				await model.update(
					labels,
					{
						status_message: (err as Error).message,
						status_label: "failed",
					},
					eq(labels.uuid, recipient.uuid),
				);

				await model.update(
					batchs,
					{
						failed_labels: batch.failed_labels! + 1,
					},
					eq(batchs.uuid, item.body.batch_uuid),
				);
			}
		}

		await env.BATCH_PDF_QUEUE.send(labels_pdf, { contentType: "json" });

		item.ack();
	}
};
