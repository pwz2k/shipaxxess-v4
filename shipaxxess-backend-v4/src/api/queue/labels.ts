import { LabelGenerator } from "@lib/label";

type MessageProps = { batch_uuid: string; user_cost: number; reseller_cost: number };

export const batchLabelQueue = async (batch: MessageBatch<MessageProps>, env: Bindings) => {
	for (const item of batch.messages) {
		// try {
		// 	const batch = await drizzle(env.DB).select().from(batchs).where(eq(batchs.uuid, item.body.batch_uuid)).get();
		// 	if (!batch) throw new Error("Not found any batch on the database");

		// 	const user = await drizzle(env.DB).select().from(users).where(eq(users.id, batch.user_id)).get();
		// 	if (!user) throw new Error("Not found any user on the database");

		// 	const _labels: any = [];
		// 	const pdfs: string[] = [];

		// 	for (const recipient of batch.recipients) {
		// 		const st = performance.now();

		// 		const req = await fetch(`${config.label.url}/api/label/generate`, {
		// 			method: "POST",
		// 			headers: config.label.headers,
		// 			body: JSON.stringify({
		// 				type: batch.type_value,
		// 				weight: batch.package_weight,
		// 				date: batch.shipping_date,
		// 				fromCountry: batch.sender_country,
		// 				fromName: batch.sender_full_name,
		// 				fromRefNumber: batch.sender_company_name,
		// 				fromStreetNumber: batch.sender_street_one,
		// 				fromStreetNumber2: batch.sender_street_two,
		// 				fromZip: batch.sender_zip,
		// 				fromCity: batch.sender_city,
		// 				fromState: batch.sender_state,
		// 				toCountry: recipient.country,
		// 				toName: recipient.full_name,
		// 				toRefNumber: recipient.company_name,
		// 				toStreetNumber: recipient.street_one,
		// 				toStreetNumber2: recipient.street_two,
		// 				toZip: recipient.zip,
		// 				toCity: recipient.city,
		// 				toState: recipient.state,
		// 			}),
		// 		});

		// 		if (!req.ok) {
		// 			_labels.push(
		// 				drizzle(env.DB).insert(labels).values({
		// 					shipping_date: batch.shipping_date,

		// 					cost_reseller: item.body.reseller_cost,
		// 					cost_user: item.body.user_cost,

		// 					status_label: "sent_to_cron",
		// 					status_message: "Request failed to api server",

		// 					// Package
		// 					package_height: batch.package_height,
		// 					package_length: batch.package_length,
		// 					package_weight: batch.package_weight,
		// 					package_width: batch.package_width,
		// 					package_id: batch.package_id,
		// 					package_name: batch.package_name,
		// 					package_uuid: batch.package_uuid,

		// 					// Recipient
		// 					recipent_city: recipient.city,
		// 					recipent_country: recipient.country!,
		// 					recipent_full_name: recipient.full_name,
		// 					recipent_state: recipient.state,
		// 					recipent_street_one: recipient.street_one,
		// 					recipent_zip: recipient.zip,
		// 					recipent_company_name: recipient.company_name,
		// 					recipent_street_two: recipient.street_two,

		// 					// Sender
		// 					sender_city: batch.sender_city,
		// 					sender_country: batch.sender_country,
		// 					sender_full_name: batch.sender_full_name,
		// 					sender_state: batch.sender_state,
		// 					sender_street_one: batch.sender_street_one,
		// 					sender_zip: batch.sender_zip,
		// 					sender_company_name: batch.sender_company_name,
		// 					sender_street_two: batch.sender_street_two,

		// 					// Type
		// 					type: batch.type,
		// 					type_label: batch.type_label,
		// 					type_unit: batch.type_unit,
		// 					type_value: batch.type_value,

		// 					// Ids
		// 					user_id: batch.user_id,
		// 					uuid: recipient.uuid,
		// 					batch_uuid: batch.uuid,
		// 				}),
		// 			);
		// 			continue;
		// 		}

		// 		const res = (await req.json()) as { payload: { code: string; pdf: string; id: number }; message: string };

		// 		_labels.push(
		// 			drizzle(env.DB)
		// 				.insert(labels)
		// 				.values({
		// 					shipping_date: batch.shipping_date,

		// 					cost_reseller: item.body.reseller_cost,
		// 					cost_user: item.body.user_cost,

		// 					status_label: "awaiting",
		// 					status_message: res.message,

		// 					// Package
		// 					package_height: batch.package_height,
		// 					package_length: batch.package_length,
		// 					package_weight: batch.package_weight,
		// 					package_width: batch.package_width,
		// 					package_id: batch.package_id,
		// 					package_name: batch.package_name,
		// 					package_uuid: batch.package_uuid,

		// 					// Recipient
		// 					recipent_city: recipient.city,
		// 					recipent_country: recipient.country!,
		// 					recipent_full_name: recipient.full_name,
		// 					recipent_state: recipient.state,
		// 					recipent_street_one: recipient.street_one,
		// 					recipent_zip: recipient.zip,
		// 					recipent_company_name: recipient.company_name,
		// 					recipent_street_two: recipient.street_two,

		// 					// Sender
		// 					sender_city: batch.sender_city,
		// 					sender_country: batch.sender_country,
		// 					sender_full_name: batch.sender_full_name,
		// 					sender_state: batch.sender_state,
		// 					sender_street_one: batch.sender_street_one,
		// 					sender_zip: batch.sender_zip,
		// 					sender_company_name: batch.sender_company_name,
		// 					sender_street_two: batch.sender_street_two,

		// 					// Type
		// 					type: batch.type,
		// 					type_label: batch.type_label,
		// 					type_unit: batch.type_unit,
		// 					type_value: batch.type_value,

		// 					// Remote
		// 					remote_id: res.payload.id,
		// 					remote_tracking_number: res.payload.code,
		// 					remote_pdf_link: res.payload.pdf,
		// 					remote_pdf_r2_link: res.payload.pdf.split("/")[4],

		// 					// Ids
		// 					user_id: batch.user_id,
		// 					uuid: recipient.uuid,
		// 					batch_uuid: batch.uuid,
		// 				}),
		// 		);

		// 		pdfs.push(res.payload.pdf);

		// 		console.log(`${recipient.uuid} took:`, performance.now() - st, "ms");
		// 	}

		// 	await drizzle(env.DB).batch(_labels);

		// 	await env.BATCH_PDF_QUEUE.send(
		// 		{ batch_uuid: batch.uuid, pdfs, email: user.email_address, name: user.first_name },
		// 		{ contentType: "json" },
		// 	);

		// 	await mail({
		// 		to: [user.email_address],
		// 		subject: `Batch #${batch.uuid} is completed`,
		// 		html: `
		// 			<p>Hi ${user.first_name},</p>
		// 			<p>Your batch is completed, We are merging all the labels together in a single label. We will let you know, once it done</p>
		// 			<br/>
		// 			<p>Thanks!</p>
		// 			<p>The ${config.app.name} Team</p>
		// 		`,
		// 	});
		// } catch (error) {
		// 	console.log(error, "TRYCATAH_ERROR");
		// }

		const generator = new LabelGenerator(env);

		const batch = await generator.getBatchByUUID(item.body.batch_uuid);
		if (!batch) throw new Error("Not found any batch on the database");

		const user = await generator.getUserById(batch.user_id);
		if (!user) throw new Error("Not found any user on the database");

		const payload = { batch_uuid: batch.uuid, email: user.email_address, name: user.first_name };

		for (const recipient of batch.recipients) {
			console.log(recipient.uuid);
			await generator.generateUSPSLabel({
				batch,
				recipient,
				cost: { user: item.body.user_cost, reseller: item.body.reseller_cost },
			});
		}

		await generator.saveLabels();
		await generator.sendToDownload(payload);
		await generator.mailNotify("batch_completed", payload);
	}
};
