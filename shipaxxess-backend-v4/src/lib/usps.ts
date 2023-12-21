import { config } from "@config";
import { batchs } from "@schemas/batchs";
import { payments } from "@schemas/payments";
import { UsersSelectModel, users } from "@schemas/users";
import { WeightsSelectModel, weights } from "@schemas/weights";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";
import { cloudflare } from "@utils/cloudflare";
import { exception } from "@utils/error";
import { girth } from "@utils/girth";
import { and, eq } from "drizzle-orm";
import { v4 } from "uuid";
import { Model } from "./model";

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

		await model.insert(payments, {
			credit: weight.user_cost * this.data.recipient.length,
			current_balance: user.current_balance,
			gateway: "Payment",
			new_balance: user.current_balance - weight.user_cost * this.data.recipient.length,
			user_id: this.userid,
			uuid: v4(),
		});
	}

	async storeInBatchTable(params: { cost: number; batch_uuid: string; reseller_cost: number }) {
		const model = new Model(this.context.DB);

		const insert = await model.insert(batchs, {
			cost_reseller: params.reseller_cost,
			cost_user: params.cost,
			package_height: this.data.package.height,
			package_length: this.data.package.length,
			package_weight: this.data.package.weight,
			package_width: this.data.package.width,
			recipient: "",
			sender_city: this.data.sender.city,
			sender_country: this.data.sender.country,
			sender_full_name: this.data.sender.full_name,
			sender_state: this.data.sender.state,
			sender_street_one: this.data.sender.street_one,
			sender_zip: this.data.sender.zip,
			type_label: this.data.type.label,
			type_unit: this.data.type.unit,
			type_value: this.data.type.value,
			shipping_date: this.data.shippingdate,
			type: "usps",
			user_id: this.userid,
			uuid: params.batch_uuid,
		});
	}
}
