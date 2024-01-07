import { config } from "@config";
import { getWeight } from "@helpers/query";
import { BatchsSelectModel, batchs } from "@schemas/batchs";
import { crons } from "@schemas/crons";
import { LabelsInsertModel, LabelsSelectModel, labels } from "@schemas/labels";
import { notifications } from "@schemas/notifications";
import { UsersSelectModel, users } from "@schemas/users";
import { Address, Labels } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { girth } from "@utils/girth";
import { log } from "@utils/log";
import { mail } from "@utils/mail";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import PDFMerger from "pdf-merger-js";
import { v4 } from "uuid";

export class LabelManager {
	private labels: LabelsInsertModel[] = [];
	private pdfs: PDFInsertModel[] = [];
	private crons: { uuid: string; message: string }[] = [];

	constructor(private env: Bindings, private settings: { [x: string]: string }) {
		if (!this.settings["label_apikey"]) {
			throw exception({ message: "label_apikey is not defined", code: 404 });
		}

		if (!this.settings["label_host"]) {
			throw exception({ message: "label_host is not defined", code: 404 });
		}

		log("Label manager is ready.");
	}

	haveGrithOk(height: number, length: number, width: number) {
		const isGirthOk = girth([height, length, width]);

		if (isGirthOk > config.packages.max_girth) {
			return false;
		}

		return true;
	}

	async getUserData(user_id: number) {
		return await drizzle(this.env.DB).select().from(users).where(eq(users.id, user_id)).get();
	}

	async getWeightData(type: "usps" | "ups", type_id: number, weight: number) {
		return await getWeight(this.env.DB, { type, type_id, weight });
	}

	async getBatchData(batch_id: number) {
		return await drizzle(this.env.DB).select().from(batchs).where(eq(batchs.id, batch_id)).get();
	}

	async saveIntoBatchTable(params: Labels.BATCHZODSCHEMA, user_cost: number, reseller_cost: number, user_id: number) {
		const [insert] = await drizzle(this.env.DB)
			.insert(batchs)
			.values({
				cost_reseller: reseller_cost,
				cost_user: user_cost,
				package_height: params.package.height,
				package_length: params.package.length,
				package_weight: params.package.weight,
				package_width: params.package.width,
				package_id: params.package.id,
				package_name: params.package.name,
				recipients: params.recipient,
				sender_city: params.sender.city,
				sender_country: params.sender.country || "United States",
				sender_full_name: params.sender.full_name,
				sender_state: params.sender.state,
				sender_street_one: params.sender.street_one,
				sender_zip: params.sender.zip,
				sender_company_name: params.sender.company_name,
				sender_phone: params.sender.phone,
				sender_street_two: params.sender.street_two,
				type_label: params.type.label,
				type_unit: params.type.unit,
				type_value: params.type.value,
				shipping_date: params.shippingdate,
				type: params.type.type,
				user_id: user_id,
				uuid: params.batch_uuid,
				total_labels: params.recipient.length,
				description: params.description,
				reference1: params.reference1,
				saturday: params.saturday,
				signature: params.signature,
			})
			.returning({ id: batchs.id });

		log("Saved into batch table.");

		return insert;
	}

	async saveIntoCronTable() {
		await drizzle(this.env.DB).batch(
			// @ts-expect-error type error
			this.crons.map((nod) =>
				drizzle(this.env.DB).insert(crons).values({ label_uuid: nod.uuid, uuid: v4(), meta_data: nod.message }),
			),
		);

		console.log(this.crons);

		log("Saved into cron table.");
	}

	async saveIntoLabelTable() {}

	async saveIntoLabelTableWithDrizzleBatch() {
		await drizzle(this.env.DB).batch(
			// @ts-expect-error type error
			this.labels.map((label) => drizzle(this.env.DB).insert(labels).values(label)),
		);
		log("Saved into label table.");
	}

	async chargeUserForLabel() {}

	async chargeUserForBatch(user: UsersSelectModel, user_cost: number, total_labels: number) {
		await drizzle(this.env.DB)
			.update(users)
			.set({
				current_balance: user.current_balance - user_cost,
				total_labels: user.total_labels + total_labels,
				total_spent: user.total_spent + user_cost,
			})
			.where(eq(users.id, user.id))
			.execute();
		log("Charged user for batch.");
	}

	async sendToBatchProcessQueue(batch_id: number) {
		return await this.env.BATCH_QUEUE.send({ batch_id }, { contentType: "json" });
	}

	async sendToBatchDownloadQueue(batch_uuid: string) {
		return await this.env.BATCH_PDF_QUEUE.send({ pdfs: this.pdfs, batch_uuid }, { contentType: "json" });
	}

	async generateUSPSLabel(label: LabelsSelectModel) {
		const req = await fetch(`${this.settings["label_host"]}/api/label/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-api-key": this.settings["label_apikey"] },
			body: JSON.stringify({
				type: label.type_value,
				weight: label.package_weight,
				date: label.shipping_date,
				fromCountry: label.sender_country,
				fromName: label.sender_full_name,
				fromRefNumber: label.sender_company_name,
				fromStreetNumber: label.sender_street_one,
				fromStreetNumber2: label.sender_street_two,
				fromZip: label.sender_zip,
				fromCity: label.sender_city,
				fromState: label.sender_state,
				toCountry: label.recipent_country,
				toName: label.recipent_full_name,
				toRefNumber: label.recipent_company_name,
				toStreetNumber: label.recipent_street_one,
				toStreetNumber2: label.recipent_street_two,
				toZip: label.recipent_zip,
				toCity: label.recipent_city,
				toState: label.recipent_state,
			}),
		});
		log("Generated USPS label.");

		var payload: ApiResponseProps;

		try {
			payload = (await req.json()) as ApiResponseProps;
		} catch (err) {
			payload = { message: (err as Error).message, payload: {} };
			this.crons.push({ uuid: label.uuid, message: payload.message });
		}
		log("Parsed USPS label. Payload: " + JSON.stringify(payload));

		return payload;
	}

	async generateUSPSLabelFromBatch(batch: BatchsSelectModel, recipient: Address.UUIDSCHEMA) {
		const req = await fetch(`${this.settings["label_host"]}/api/label/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-api-key": this.settings["label_apikey"] },
			body: JSON.stringify({
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
			}),
		});
		log("Generated USPS label.");

		var payload: ApiResponseProps;

		try {
			payload = (await req.json()) as ApiResponseProps;
		} catch (err) {
			payload = { message: (err as Error).message, payload: {} };
			this.crons.push({ uuid: recipient.uuid, message: payload.message });
		}
		log(`Parsed USPS label. Payload: ${payload.message}`);

		this.pushLabelToPrivateArray(batch, recipient, {
			code: req.ok && payload.payload.code ? payload.payload.code : null,
			id: req.ok && payload.payload.id ? payload.payload.id : null,
			pdf: req.ok && payload.payload.pdf ? payload.payload.pdf.split("/")[4] : "",
			status: req.ok ? "awaiting" : "pending",
			message: payload.message,
		});

		log("Pushed label to private array.");
	}

	async generateUPSLabel(label: LabelsSelectModel) {
		const req = await fetch(`${this.settings["label_host"]}/api/label/generate-ups`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-api-key": this.settings["label_apikey"] },
			body: JSON.stringify({
				type: label.type,
				weight: label.package_weight,
				height: label.package_height,
				width: label.package_width,
				length: label.package_length,
				reference1: label.reference1,
				description: label.description,
				saturday: label.saturday,
				signature: label.signature,
				date: label.shipping_date,
				fromCountry: label.sender_country,
				fromName: label.sender_full_name,
				fromCompany: label.sender_company_name,
				sender_phone: label.sender_phone,
				fromStreetNumber: label.sender_street_one,
				fromStreetNumber2: label.sender_street_two,
				fromZip: label.sender_zip,
				fromCity: label.sender_city,
				fromState: label.sender_state,
				toCountry: label.recipent_country,
				toName: label.recipent_full_name,
				toCompany: label.recipent_company_name,
				recipent_phone: label.recipent_phone,
				toStreetNumber: label.recipent_street_one,
				toStreetNumber2: label.recipent_street_two,
				toZip: label.recipent_zip,
				toCity: label.recipent_city,
				toState: label.recipent_state,
			}),
		});
		log("Generated UPS label.");

		var payload: ApiUpsResponseProps;

		try {
			payload = (await req.json()) as ApiUpsResponseProps;
		} catch (err) {
			payload = { message: (err as Error).message, payload: {} };
			this.crons.push({ uuid: label.uuid, message: payload.message });
		}
		log(`Parsed UPS label. Payload: ${payload.message}`);

		return payload;
	}

	async generateUPSLabelFromBatch(batch: BatchsSelectModel, recipient: Address.UUIDSCHEMA) {
		const req = await fetch(`${this.settings["label_host"]}/api/label/generate-ups`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-api-key": this.settings["label_apikey"] },
			body: JSON.stringify({
				type: batch.type,
				weight: batch.package_weight,
				height: batch.package_height,
				width: batch.package_width,
				length: batch.package_length,
				reference1: batch.reference1,
				description: batch.description,
				saturday: batch.saturday,
				signature: batch.signature,
				date: batch.shipping_date,
				fromCountry: batch.sender_country,
				fromName: batch.sender_full_name,
				fromCompany: batch.sender_company_name,
				fromPhone: batch.sender_phone,
				fromStreetNumber: batch.sender_street_one,
				fromStreetNumber2: batch.sender_street_two,
				fromZip: batch.sender_zip,
				fromCity: batch.sender_city,
				fromState: batch.sender_state,
				toCountry: recipient.country,
				toName: recipient.full_name,
				toCompany: recipient.company_name,
				toPhone: recipient.phone,
				toStreetNumber: recipient.street_one,
				toStreetNumber2: recipient.street_two,
				toZip: recipient.zip,
				toCity: recipient.city,
				toState: recipient.state,
			}),
		});
		log("Generated UPS label.");

		var payload: ApiUpsResponseProps;

		try {
			payload = (await req.json()) as ApiUpsResponseProps;
		} catch (err) {
			payload = { message: (err as Error).message, payload: {} };
			this.crons.push({ uuid: recipient.uuid, message: payload.message });
		}
		log("Parsed UPS label. Payload: " + JSON.stringify(payload));

		this.pushLabelToPrivateArray(batch, recipient, {
			code: req.ok && payload.payload.tracking ? payload.payload.tracking : null,
			id: req.ok && payload.payload.id ? payload.payload.id : null,
			pdf: req.ok && payload.payload.pdf ? payload.payload.pdf.split("/")[5] : "",
			status: req.ok ? "awaiting" : "pending",
			message: payload.message,
		});
		log("Pushed label to private array.");
	}

	async downloadUSPSLabel(pdfkey: string) {
		const req = await fetch(`${this.settings["label_host"]}/labels/${pdfkey}`);
		const buffer = await req.arrayBuffer();
		log("Downloaded USPS label.");

		await this.env.LABELS_BUCKET.put(pdfkey, buffer);
		log("Uploaded USPS label to R2.");

		return buffer;
	}

	async downloadUPSLabel(pdfkey: string) {
		const req = await fetch(`${this.settings["label_host"]}/labels/ups/${pdfkey}`);
		const buffer = await req.arrayBuffer();
		log("Downloaded UPS label.");

		await this.env.LABELS_BUCKET.put(pdfkey, buffer);
		log("Uploaded UPS label to R2.");

		return buffer;
	}

	async downloadMergePdf(filename: string, merger: PDFMerger) {
		const buffer = await merger.saveAsBuffer();

		await this.env.LABELS_BUCKET.put(filename, buffer);
		log("Uploaded merged pdf to R2.");

		return buffer;
	}

	async notifyBatchDownloadCompleteEvent(batch_uuid: string) {
		const batch = await drizzle(this.env.DB).select().from(batchs).where(eq(batchs.uuid, batch_uuid)).get();
		if (!batch) throw exception({ message: "Batch not found.", code: 404 });
		log("Batch found.");

		const user = await this.getUserData(batch.user_id);
		if (!user) throw exception({ message: "User not found.", code: 404 });
		log("User found.");

		const subject = `Batch #${batch.id} is ready to download`;
		const body = `Hi ${user.first_name}, Your batch #${batch.id} is ready to download. please check the batch page to download the labels.`;

		await drizzle(this.env.DB).insert(notifications).values({
			description: body,
			title: subject,
			user_id: batch.user_id,
			uuid: v4(),
		});
		log("Notification saved.");

		if (!user.labels_email_notify) return;

		await mail({
			to: [user.email_address],
			from: this.settings["postalserver_address"],
			subject,
			html: body,
		});
		log("Email sent.");
	}

	async updateLabelBatchStatus(batch_uuid: string) {
		await drizzle(this.env.DB)
			.update(batchs)
			.set({ status_label: "completed", status_message: "Batch is completed", merge_pdf_key: `${batch_uuid}.pdf` })
			.where(eq(batchs.uuid, batch_uuid))
			.execute();
		log("Updated batch status.");
	}

	async updateUSPSLabelStatus({ payload, id }: { payload: ApiResponseProps; id: number }) {
		return await drizzle(this.env.DB)
			.update(labels)
			.set({
				remote_tracking_number: payload.payload.code,
				remote_pdf_link: payload.payload.pdf!.split("/")[4] || "",
				remote_pdf_r2_link: payload.payload.pdf!.split("/")[4] || "",
				status_label: "awaiting",
				status_message: payload.message,
			})
			.where(eq(labels.id, id))
			.execute();
	}

	async updateUPSLabelStatus({ payload, id }: { payload: ApiUpsResponseProps; id: number }) {
		return await drizzle(this.env.DB)
			.update(labels)
			.set({
				remote_tracking_number: payload.payload.tracking,
				remote_pdf_link: payload.payload.pdf!.split("/")[5] || "",
				remote_pdf_r2_link: payload.payload.pdf!.split("/")[5] || "",
				status_label: "awaiting",
				status_message: payload.message,
			})
			.where(eq(labels.id, id))
			.execute();
	}

	private pushLabelToPrivateArray(
		batch: BatchsSelectModel,
		recipient: Address.UUIDSCHEMA,
		payload: { code?: string | null; id?: number | null; pdf?: string; status: string; message: string },
	) {
		this.labels.push({
			shipping_date: batch.shipping_date,

			cost_reseller: batch.cost_reseller,
			cost_user: batch.cost_user,

			// Package
			package_height: batch.package_height,
			package_length: batch.package_length,
			package_weight: batch.package_weight,
			package_width: batch.package_width,
			package_id: batch.package_id,
			package_name: batch.package_name,

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

			// Remote
			remote_id: payload.id,
			remote_tracking_number: payload.code,
			remote_pdf_link: payload.pdf,
			remote_pdf_r2_link: payload.pdf,

			status_label: payload.status,
			status_message: payload.message,

			// Ids
			user_id: batch.user_id,
			uuid: recipient.uuid,
			batch_uuid: batch.uuid,
		});

		if (!payload.pdf || payload.pdf === null || payload.pdf === "") return;

		this.pdfs.push({ type: batch.type, pdf: payload.pdf });
	}
}
