import { config } from "@config";
import { getWeight } from "@helpers/query";
import { batchs } from "@schemas/batchs";
import { payments } from "@schemas/payments";
import { UsersSelectModel, users } from "@schemas/users";
import { WeightsSelectModel } from "@schemas/weights";
import { Labels } from "@shipaxxess/shipaxxess-zod-v4";
import { cloudflare } from "@utils/cloudflare";
import { exception } from "@utils/error";
import { girth } from "@utils/girth";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { Model } from "./model";

type BatchDataProps = { cost: number; batch_uuid: string; reseller_cost: number; type: "usps" | "ups" };

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

		const [batch] = await model.insert(batchs, {
			cost_reseller: params.reseller_cost * this.data.recipient.length,
			cost_user: params.cost * this.data.recipient.length,
			package_height: this.data.package.height,
			package_length: this.data.package.length,
			package_weight: this.data.package.weight,
			package_width: this.data.package.width,
			recipients: this.data.recipient,
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
			type: params.type,
			user_id: this.userid,
			uuid: params.batch_uuid,
			total_labels: this.data.recipient.length,
		});

		return batch;
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

	async sendToQueue(params: { batch_uuid: string; user_cost: number; reseller_cost: number }) {
		await this.context.BATCH_QUEUE.send(
			{ batch_uuid: params.batch_uuid, user_cost: params.user_cost, reseller_cost: params.reseller_cost },
			{ contentType: "json" },
		);
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
}
