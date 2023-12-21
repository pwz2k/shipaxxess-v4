import { config } from "@config";
import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { UsersSelectModel, users } from "@schemas/users";
import { WeightsSelectModel, weights } from "@schemas/weights";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";
import { cloudflare } from "@utils/cloudflare";
import { exception } from "@utils/error";
import { fetch_ } from "@utils/fetch";
import { girth } from "@utils/girth";
import { and, eq } from "drizzle-orm";
import { v4 } from "uuid";
import { Model } from "./model";

type GeneratePayloadProps = { id: number | null; code: string | null; pdf: string | null };

export class UspsService {
	constructor(private context: Bindings, private data: Usps.ZODSCHEMA, private userid: number) {
		const isGirthOk = girth([this.data.package.height, this.data.package.length, this.data.package.width]);

		if (isGirthOk > config.packages.max_girth) {
			throw exception({ message: "Girth is too big", code: 97867 });
		}
	}

	async checkBeforeGenerate() {
		const model = new Model(this.context.DB);

		const weight = await model.get(
			weights,
			and(
				eq(weights.type, "usps"),
				eq(weights.type_id, this.data.type.id),
				eq(weights.weight, this.data.package.weight),
			),
		);

		const user = await model.get(users, eq(users.id, this.userid));

		if (user.current_balance < weight.user_cost) {
			throw exception({ message: "User balance is not enough", code: 97868 });
		}

		return { user, weight };
	}

	async insertLabel(params: GeneratePayloadProps, costs: { user: number; reseller: number }) {
		const model = new Model(this.context.DB);

		const insert = await model.insert(labels, {
			uuid: v4(),
			user_id: this.userid,

			type: "usps",
			status_label: "awaiting",
			shipping_date: this.data.shippingdate,

			// Costs
			cost_user: costs.user,
			cost_reseller: costs.reseller,

			// Remote
			remote_id: params.id,
			remote_pdf_link: params.pdf,
			remote_tracking_number: params.code,

			// Package
			package_id: this.data.package.id,
			package_height: this.data.package.height,
			package_length: this.data.package.length,
			package_weight: this.data.package.weight,
			package_width: this.data.package.width,
			package_name: this.data.package.name,

			// Recipent
			recipent_company_name: this.data.recipient.company_name,
			recipent_street_two: this.data.recipient.street_two,
			recipent_city: this.data.recipient.city,
			recipent_country: this.data.recipient.country,
			recipent_full_name: this.data.recipient.full_name,
			recipent_state: this.data.recipient.state,
			recipent_street_one: this.data.recipient.street_one,
			recipent_zip: this.data.recipient.zip,

			// Sender
			sender_company_name: this.data.sender.company_name,
			sender_street_two: this.data.sender.street_two,
			sender_city: this.data.sender.city,
			sender_country: this.data.sender.country,
			sender_full_name: this.data.sender.full_name,
			sender_state: this.data.sender.state,
			sender_street_one: this.data.sender.street_one,
			sender_zip: this.data.sender.zip,

			// Type
			type_label: this.data.type.label,
			type_unit: this.data.type.unit,
			type_value: this.data.type.value,
		});

		return insert;
	}

	async generateLabel() {
		try {
			const res = await fetch_<GeneratePayloadProps>("/api/label/generate", {
				type: this.data.type.value,
				weight: this.data.package.weight,
				date: this.data.shippingdate,
				fromCountry: this.data.sender.country,
				fromName: this.data.sender.full_name,
				fromRefNumber: this.data.sender?.company_name,
				fromStreetNumber: this.data.sender.street_one,
				fromStreetNumber2: this.data.sender?.street_two,
				fromZip: this.data.sender.zip,
				fromCity: this.data.sender.city,
				fromState: this.data.sender.state,
				toCountry: this.data.recipient.country,
				toName: this.data.recipient.full_name,
				toRefNumber: this.data.recipient?.company_name,
				toStreetNumber: this.data.recipient.street_one,
				toStreetNumber2: this.data.recipient?.street_two,
				toZip: this.data.recipient.zip,
				toCity: this.data.recipient.city,
				toState: this.data.recipient.state,
			});

			if (!res.payload.code || !res.payload.pdf || !res.payload.id) {
				throw exception({ message: "invalid payload value", code: 9870 });
			}

			return res;
		} catch (err) {
			throw err;
		}
	}

	async downloadLabel(params: GeneratePayloadProps) {
		if (!params.code || !params.pdf || !params.id) {
			throw exception({ message: "invalid payload value", code: 9870 });
		}

		const req = await fetch(params.pdf);

		const buffer = await req.arrayBuffer();

		const r2object = await this.context.LABELS_BUCKET.put(`${params.id}-${params.code}.pdf`, buffer, {
			customMetadata: { pdf: params.pdf },
		});

		return r2object;
	}

	async payforLabel(user: UsersSelectModel, weight: WeightsSelectModel) {
		const model = new Model(this.context.DB);

		const update = await model.update(
			users,
			{
				current_balance: user.current_balance - weight.user_cost,
				total_labels: user.total_labels + 1,
				total_spent: user.total_spent + weight.user_cost,
			},
			eq(users.id, this.userid),
		);

		return update;
	}
}

export class UspsBatchService {
	constructor(private context: Bindings, private data: Usps.BATCHZODSCHEMA, private userid: number) {
		const isGirthOk = girth([this.data.package.height, this.data.package.length, this.data.package.width]);

		if (isGirthOk > config.packages.max_girth) {
			throw exception({ message: "Girth is too big", code: 97867 });
		}
	}

	async checkBeforeGenerate() {
		const model = new Model(this.context.DB);

		const weight = await model.get(
			weights,
			and(
				eq(weights.type, "usps"),
				eq(weights.type_id, this.data.type.id),
				eq(weights.weight, this.data.package.weight),
			),
		);

		const user = await model.get(users, eq(users.id, this.userid));

		if (user.current_balance < weight.user_cost * this.data.recipient.length) {
			throw exception({ message: "User balance is not enough", code: 97868 });
		}

		return { user, weight };
	}

	async bulkKVStore() {
		const kv_data = this.data.recipient.map((v) => ({ key: v.uuid, value: "haven't been processed yet" }));

		const req = await cloudflare(
			`/accounts/${config.cloudflare.account_identifier}/storage/kv/namespaces/286cdb9ad9e14440a96b712afc625ecb/bulk`,
			{ method: "PUT", body: kv_data },
		);

		if (!req.ok) {
			throw exception({ message: "failed to store kv data", code: 9870 });
		}
	}

	async sendToQueue() {
		await this.context.BATCH_QUEUE.send(this.data, { contentType: "json" });
	}

	async payforLabel(user: UsersSelectModel, weight: WeightsSelectModel) {
		const model = new Model(this.context.DB);

		await model.update(
			users,
			{
				current_balance: user.current_balance - weight.user_cost * this.data.recipient.length,
				total_labels: user.total_labels + this.data.recipient.length,
				total_spent: user.total_spent + weight.user_cost * this.data.recipient.length,
			},
			eq(users.id, this.userid),
		);
	}

	async storeInBatchTable(params: { cost: number; batch_uuid: string }) {
		const model = new Model(this.context.DB);

		await model.insert(batchs, {
			data: JSON.stringify(this.data),
			user_id: this.userid,
			uuid: params.batch_uuid,
			total_cost: params.cost,
			total_labels: this.data.recipient.length,
		});
	}
}
