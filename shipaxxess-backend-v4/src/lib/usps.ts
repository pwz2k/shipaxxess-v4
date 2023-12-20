import { config } from "@config";
import { findLabelCostByWeight, findUserById } from "@helpers/query";
import { labels } from "@schemas/labels";
import { UsersSelectModel, users } from "@schemas/users";
import { WeightsSelectModel } from "@schemas/weights";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { fetch_ } from "@utils/fetch";
import { girth } from "@utils/girth";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { v4 } from "uuid";
import { Model } from "./model";

type GeneratePayloadProps = { id: number; code: string; pdf: string };

export class UspsService {
	constructor(private context: Context<App>, private data: Usps.ZODSCHEMA) {}

	async checkBeforeGenerate() {
		const isGirthOk = girth([this.data.package.height, this.data.package.length, this.data.package.width]);

		if (isGirthOk > config.packages.max_girth) {
			throw exception({ message: "Girth is too big", code: 97867 });
		}

		const weight = await findLabelCostByWeight(this.context, {
			id: this.data.type.id,
			type: "usps",
			weight: this.data.package.weight,
		});

		const user = await findUserById(this.context);

		if (user.current_balance < weight.user_cost) {
			throw exception({ message: "User balance is not enough", code: 97868 });
		}

		return { user, weight };
	}

	async insertLabel(params: GeneratePayloadProps) {
		const labeluuid = v4();

		const model = new Model(this.context.env.DB);

		const insert = await model.create(labels, {
			uuid: labeluuid,
			user_id: this.context.get("jwtPayload").id,

			type: "usps",
			status_label: "awaiting",
			shipping_date: this.data.shippingdate,

			// Costs
			cost_user: 1,
			cost_reseller: 1,

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
		const req = await fetch(params.pdf);

		const buffer = await req.arrayBuffer();

		const r2object = await this.context.env.LABELS_BUCKET.put(`${params.id}-${params.code}.pdf`, buffer, {
			customMetadata: { pdf: params.pdf },
		});

		return r2object;
	}

	async payforLabel(user: UsersSelectModel, weight: WeightsSelectModel) {
		const model = new Model(this.context.env.DB);

		const update = await model.update(
			users,
			{
				current_balance: user.current_balance - weight.user_cost,
				total_labels: user.total_labels + 1,
				total_spent: user.total_spent + weight.user_cost,
			},
			eq(users.id, this.context.get("jwtPayload").id),
		);

		return update;
	}
}
