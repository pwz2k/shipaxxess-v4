import { config } from "@config";
import { getWeight } from "@helpers/query";
import { BatchsSelectModel, batchs } from "@schemas/batchs";
import { LabelsInsertModel, LabelsSelectModel, labels } from "@schemas/labels";
import { payments } from "@schemas/payments";
import { UsersSelectModel, users } from "@schemas/users";
import { WeightsSelectModel } from "@schemas/weights";
import { Address, Labels } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { girth } from "@utils/girth";
import { mail } from "@utils/mail";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import PDFMerger from "pdf-merger-js";
import { v4 } from "uuid";
import { Model } from "./model";

type BatchDataProps = { cost: number; reseller_cost: number };

type ApiResponseProps = { payload: { code: string; pdf: string; id: number }; message: string };

type ApiUpsResponseProps = { payload: { tracking: string; pdf: string; id: number }; message: string };

type CreateLabelProps =
	| {
			batch: BatchsSelectModel;
			recipient: Address.UUIDSCHEMA;
			cost: { user: number; reseller: number };
			payload?: ApiResponseProps;
			type: "usps";
	  }
	| {
			batch: BatchsSelectModel;
			recipient: Address.UUIDSCHEMA;
			cost: { user: number; reseller: number };
			payload?: ApiUpsResponseProps;
			type: "ups";
	  };

export class LabelsService {
	constructor(private context: Bindings, private data: Labels.BATCHZODSCHEMA, private userid: number) {
		const isGirthOk = girth([this.data.package.height, this.data.package.length, this.data.package.width]);

		if (isGirthOk > config.packages.max_girth) {
			throw exception({ message: "Girth is too big", code: 97867 });
		}
	}

	async checkBeforeGenerate() {
		const model = new Model(this.context.DB);

		const weight = await getWeight(this.context.DB, {
			type: this.data.type.type,
			type_id: this.data.type.id,
			weight: this.data.package.weight,
		});
		if (!weight) throw exception({ message: "Weight not found", code: 40405 });

		const user = await model.get(users, eq(users.id, this.userid));
		if (!user) throw exception({ message: "User not found", code: 40405 });

		if (user.current_balance < weight.user_cost * this.data.recipient.length) {
			throw exception({ message: "User balance is not enough", code: 97868 });
		}

		return { user, weight };
	}

	async storeBatchData(params: BatchDataProps) {
		const model = new Model(this.context.DB);

		if (this.data.type.type === "usps") {
			const [batch] = await model.insert(batchs, {
				cost_reseller: params.reseller_cost * this.data.recipient.length,
				cost_user: params.cost * this.data.recipient.length,
				package_height: this.data.package.height,
				package_length: this.data.package.length,
				package_weight: this.data.package.weight,
				package_width: this.data.package.width,
				package_id: this.data.package.id,
				package_name: this.data.package.name,
				recipients: this.data.recipient,
				sender_city: this.data.sender.city,
				sender_country: this.data.sender.country || "United States",
				sender_full_name: this.data.sender.full_name,
				sender_state: this.data.sender.state,
				sender_street_one: this.data.sender.street_one,
				sender_zip: this.data.sender.zip,
				sender_company_name: this.data.sender.company_name,
				sender_phone: this.data.sender.phone,
				sender_street_two: this.data.sender.street_two,
				type_label: this.data.type.label,
				type_unit: this.data.type.unit,
				type_value: this.data.type.value,
				shipping_date: this.data.shippingdate,
				type: this.data.type.type,
				user_id: this.userid,
				uuid: this.data.batch_uuid,
				total_labels: this.data.recipient.length,
			});

			return batch;
		}

		const [batch] = await model.insert(batchs, {
			cost_reseller: params.reseller_cost * this.data.recipient.length,
			cost_user: params.cost * this.data.recipient.length,
			package_height: this.data.package.height,
			package_length: this.data.package.length,
			package_weight: this.data.package.weight,
			package_width: this.data.package.width,
			package_id: this.data.package.id,
			package_name: this.data.package.name,
			recipients: this.data.recipient,
			sender_city: this.data.sender.city,
			sender_country: this.data.sender.country || "United States",
			sender_full_name: this.data.sender.full_name,
			sender_state: this.data.sender.state,
			sender_street_one: this.data.sender.street_one,
			sender_zip: this.data.sender.zip,
			sender_company_name: this.data.sender.company_name,
			sender_phone: this.data.sender.phone,
			sender_street_two: this.data.sender.street_two,
			type_label: this.data.type.label,
			type_unit: this.data.type.unit,
			type_value: this.data.type.value,
			shipping_date: this.data.shippingdate,
			type: this.data.type.type,
			user_id: this.userid,
			uuid: this.data.batch_uuid,
			total_labels: this.data.recipient.length,
			description: this.data.description,
			reference1: this.data.reference1,
			saturday: this.data.saturday,
			signature: this.data.signature,
		});

		return batch;
	}

	async payforLabel(user: UsersSelectModel, weight: WeightsSelectModel) {
		const model = new Model(this.context.DB);

		const [update] = await model.update(
			users,
			{
				current_balance: user.current_balance - weight.user_cost * this.data.recipient.length,
				total_labels: user.total_labels + this.data.recipient.length,
				total_spent: user.total_spent + weight.user_cost * this.data.recipient.length,
			},
			eq(users.id, this.userid),
		);

		const [insert] = await model.insert(payments, {
			credit: weight.user_cost * this.data.recipient.length,
			current_balance: user.current_balance,
			gateway: "Payment",
			new_balance: user.current_balance - weight.user_cost * this.data.recipient.length,
			user_id: this.userid,
			uuid: v4(),
		});

		return { update, insert };
	}

	async sendToQueue(params: { batch_uuid: string; user_cost: number; reseller_cost: number }) {
		await this.context.BATCH_QUEUE.send(
			{ batch_uuid: params.batch_uuid, user_cost: params.user_cost, reseller_cost: params.reseller_cost },
			{ contentType: "json" },
		);
	}
}

export class LabelGenerator {
	private labels: LabelsInsertModel[] = [];
	private pdfs: string[] = [];
	private failed_labels: Error[] = [];

	constructor(private env: Bindings, private settings: { [x: string]: string }) {
		if (!this.settings["label_apikey"]) {
			throw exception({ message: "label_apikey is not defined", code: 404 });
		}

		if (!this.settings["label_host"]) {
			throw exception({ message: "label_host is not defined", code: 404 });
		}
	}

	async createLabel({ batch, recipient, payload, cost, type }: CreateLabelProps) {
		this.labels.push({
			shipping_date: batch.shipping_date,

			cost_reseller: cost.reseller,
			cost_user: cost.user,

			// Package
			package_height: batch.package_height,
			package_length: batch.package_length,
			package_weight: batch.package_weight,
			package_width: batch.package_width,
			package_id: batch.package_id,
			package_name: batch.package_name,

			// Recipient
			recipent_city: recipient.city,
			recipent_country: recipient.country!,
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
			remote_id: payload && payload.payload.id,
			remote_tracking_number: type === "usps" ? payload && payload.payload.code : payload && payload.payload.tracking,
			remote_pdf_link: payload && payload.payload.pdf,
			remote_pdf_r2_link:
				type === "usps" ? payload && payload.payload.pdf.split("/")[4] : payload && payload.payload.pdf.split("/")[5],

			status_label: "awaiting",
			status_message: payload && payload.message,

			// Ids
			user_id: batch.user_id,
			uuid: recipient.uuid,
			batch_uuid: batch.uuid,
		});
	}

	async getBatchByUUID(uuid: string) {
		return await drizzle(this.env.DB).select().from(batchs).where(eq(batchs.uuid, uuid)).get();
	}

	async getUserById(id: number) {
		return await drizzle(this.env.DB).select().from(users).where(eq(users.id, id)).get();
	}

	async generateUSPSLabel({
		batch,
		recipient,
		cost,
	}: {
		batch: BatchsSelectModel;
		recipient: Address.UUIDSCHEMA;
		cost: { user: number; reseller: number };
	}) {
		const req = await fetch(`${config.label.url}/api/label/generate`, {
			method: "POST",
			headers: config.label.headers,
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

		try {
			const payload = (await req.json()) as ApiResponseProps;

			if (!req.ok) {
				throw new Error(payload.message);
			}

			this.createLabel({ batch, payload, cost, recipient, type: "usps" });
			this.pdfs.push(payload.payload.pdf);

			return payload;
		} catch (err) {
			this.failed_labels.push(err as Error);
		}
	}

	async generateSimpleUSPSLabel(label: LabelsSelectModel) {
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

		try {
			const payload = (await req.json()) as ApiResponseProps;

			if (!req.ok) {
				throw new Error(payload.message);
			}

			return payload;
		} catch (err) {
			throw exception({ message: (err as Error).message, code: 404 });
		}
	}

	async generateUPSLabel({
		batch,
		cost,
		recipient,
	}: {
		batch: BatchsSelectModel;
		recipient: Address.UUIDSCHEMA;
		cost: { user: number; reseller: number };
	}) {
		const req = await fetch(`${config.label.url}/api/label/generate-ups`, {
			method: "POST",
			headers: config.label.headers,
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

		try {
			const payload = (await req.json()) as ApiUpsResponseProps;

			if (!req.ok) {
				throw new Error(payload.message);
			}

			this.createLabel({ batch, payload, cost, recipient, type: "ups" });
			this.pdfs.push(payload.payload.pdf);

			return payload;
		} catch (err) {
			this.failed_labels.push(err as Error);
		}
	}

	async generateSimpleUPSLabel(label: LabelsSelectModel) {
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
				fromPhone: label.fromPhone,
				fromStreetNumber: label.sender_street_one,
				fromStreetNumber2: label.sender_street_two,
				fromZip: label.sender_zip,
				fromCity: label.sender_city,
				fromState: label.sender_state,
				toCountry: label.recipent_country,
				toName: label.recipent_full_name,
				toCompany: label.recipent_company_name,
				toPhone: label.toPhone,
				toStreetNumber: label.recipent_street_one,
				toStreetNumber2: label.recipent_street_two,
				toZip: label.recipent_zip,
				toCity: label.recipent_city,
				toState: label.recipent_state,
			}),
		});

		try {
			const payload = (await req.json()) as ApiUpsResponseProps;

			if (!req.ok) {
				throw new Error(payload.message);
			}

			return payload;
		} catch (err) {
			throw exception({ message: (err as Error).message, code: 404 });
		}
	}

	async sendToDownload(params: { batch_uuid: string; email: string; name: string; type: "usps" | "ups" }) {
		return await this.env.BATCH_PDF_QUEUE.send(
			{ batch_uuid: params.batch_uuid, pdfs: this.pdfs, email: params.email, name: params.name, type: params.type },
			{ contentType: "json" },
		);
	}

	async saveLabels() {
		return await drizzle(this.env.DB).batch(
			// @ts-ignore
			this.labels.map((label) => drizzle(this.env.DB).insert(labels).values(label)),
		);
	}

	async mailNotify(
		code: "batch_completed" | "batch_download_completed",
		payload: { email: string; batch_uuid: string; name: string },
	) {
		try {
			switch (code) {
				case "batch_completed":
					return await mail({
						to: [payload.email],
						subject: `Batch #${payload.batch_uuid} is completed`,
						html: `
						<p>Hi ${payload.name},</p>
						<p>Your batch is completed, We are merging all the labels together in a single label. We will let you know, once it done</p>
						<br/>
						<p>Thanks!</p>
						<p>The ${config.app.name} Team</p>
					`,
					});

				case "batch_download_completed":
					return;

				default:
					return;
			}
		} catch (err) {
			console.log(err);
		}
	}

	async updateBatchStatus(batch_uuid: string, status: string) {
		return await drizzle(this.env.DB)
			.update(batchs)
			.set({ status_label: status, status_message: "Batch is completed", failed_labels: this.failed_labels.length })
			.where(eq(batchs.uuid, batch_uuid))
			.execute();
	}
}

export class LabelDownloader {
	constructor(private env: Bindings, private merger: PDFMerger) {}

	async downloadLabel(pdf: string, type: "usps" | "ups") {
		const req = await fetch(pdf);
		const buffer = await req.arrayBuffer();

		const r2 = await this.env.LABELS_BUCKET.put(pdf.split("/")[type === "usps" ? 4 : 5], buffer);
		if (r2 === null) throw new Error("buffer in null");

		try {
			await this.merger.add(buffer, "1-1");
		} catch (error) {
			await this.merger.add(buffer);
		}
	}

	async saveMergedPdf(batch_uuid: string) {
		const mergePdfBuffer = await this.merger.saveAsBuffer();

		const r2batch = await this.env.LABELS_BUCKET.put(`${batch_uuid}.pdf`, mergePdfBuffer);
		if (r2batch === null) throw new Error("something went wrong with batch pdf merger r2");
	}

	async updateBatchStatus(batch_uuid: string) {
		return await drizzle(this.env.DB)
			.update(batchs)
			.set({ is_downloaded: true, merge_pdf_key: `${batch_uuid}.pdf` })
			.where(eq(batchs.uuid, batch_uuid))
			.execute();
	}

	async mailNotify(payload: { email: string; batch_uuid: string; name: string }) {
		return await mail({
			to: [payload.email],
			subject: `Batch #${payload.batch_uuid} is ready to download`,
			html: `
						<p>Hi ${payload.name},</p>
						<p>Your batch is ready to download.</p>
						<br/>
						<p>Thanks!</p>
						<p>The ${config.app.name} Team</p>
					`,
		});
	}
}
