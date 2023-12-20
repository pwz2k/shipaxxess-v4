import { findUserById } from "@helpers/query";
import { labels } from "@schemas/labels";
import { payments } from "@schemas/payments";
import { UsersSelectModel, users } from "@schemas/users";
import { Address, Costs, Package, Type } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { fetch_ } from "@utils/fetch";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { v4 } from "uuid";

export class USPS {
	protected sender: Address.ZODSCHEMA | null = null;
	protected package_: Package.ZODSCHEMA | null = null;
	protected recipient: Address.ZODSCHEMA | null = null;
	protected shippingdate: string | null = null;
	protected type_: Type.ZODSCHEMA | null = null;
	protected context: Context<App> | null = null;
	protected labeluuid: string | null = null;
	protected remotepdf: string | null = null;
	protected reseller_cost: number | null = null;
	protected user_cost: number | null = null;
	protected user: UsersSelectModel | null = null;

	/**
	 *
	 */
	constructor(c: Context<App>) {
		this.context = c;
	}

	/**
	 *
	 */
	setSender(params: Address.ZODSCHEMA) {
		this.sender = params;
		return this;
	}

	/**
	 *
	 */
	setRecipient(params: Address.ZODSCHEMA) {
		this.recipient = params;
		return this;
	}

	/**
	 *
	 */
	setPackage(params: Package.ZODSCHEMA) {
		this.package_ = params;
		return this;
	}

	/**
	 *
	 */
	setType(params: Type.ZODSCHEMA) {
		this.type_ = params;
		return this;
	}

	/**
	 *
	 */
	setShippingDate(params: string) {
		this.shippingdate = params;
		return this;
	}

	/**
	 *
	 */
	setCost(params: Costs.ZODSCHEMA) {
		this.reseller_cost = params.reseller_cost;
		this.user_cost = params.user_cost;
		return this;
	}

	/**
	 *
	 */
	private required() {
		if (this.context === null) throw exception({ message: "Context not defined", code: 6006 });
		if (this.package_ === null) throw exception({ message: "Context not defined", code: 6007 });
		if (this.type_ === null) throw exception({ message: "Context not defined", code: 6008 });
		if (this.sender === null) throw exception({ message: "Context not defined", code: 6009 });
		if (this.recipient === null) throw exception({ message: "Context not defined", code: 6010 });
		if (this.shippingdate === null) throw exception({ message: "Context not defined", code: 6010 });
		if (this.user_cost === null) throw exception({ message: "User cost not defined", code: 6076 });
		if (this.reseller_cost === null) throw exception({ message: "Reseller cost not defined", code: 6077 });
	}

	async hasBalance(label_cost: number) {
		const user = await findUserById(this.context!.get("jwtPayload").id);

		if (user.current_balance < label_cost) {
			return false;
		}

		this.user = user;

		return true;
	}

	/**
	 *
	 */
	async pay(params?: { total_labels: number }) {
		if (!params) {
			this.required();
		}

		if (this.user === null) throw exception({ message: "User nod defined", code: 20587 });

		const update = await drizzle(this.context!.env.DB)
			.update(users)
			.set({
				current_balance: this.user.current_balance - this.user_cost!,
				total_labels: this.user.total_labels + (params ? params.total_labels : 1),
				total_spent: this.user!.total_spent + this.user_cost!,
			})
			.where(eq(users.id, this.user!.id));
		if (!update.success) {
			throw exception({ message: "Failed to update user balance", code: 8667 });
		}

		const insert = await drizzle(this.context!.env.DB)
			.insert(payments)
			.values({
				credit: this.user_cost!,
				current_balance: this.user.current_balance,
				gateway: "payment",
				new_balance: this.user.current_balance - this.user_cost!,
				user_id: this.user!.id,
				uuid: v4(),
				status: "confirmed",
			});
		if (!insert.success) {
			throw exception({ message: "Failed to create payment entry", code: 8668 });
		}
	}

	/**
	 *
	 */
	async insert() {
		this.required();

		const labeluuid = v4();

		// Insert
		const insert = await drizzle(this.context!.env.DB)
			.insert(labels)
			.values({
				uuid: labeluuid,
				cost_reseller: this.reseller_cost!,
				cost_user: this.user_cost!,
				package_height: this.package_!.height,
				package_length: this.package_!.length,
				package_weight: this.package_!.weight,
				package_width: this.package_!.width,
				package_id: 1,
				package_name: this.package_!.name,
				package_uuid: this.package_!.uuid,
				recipent_company_name: this.recipient!.company_name,
				recipent_street_two: this.recipient!.street_two,
				recipent_city: this.recipient!.city,
				recipent_country: this.recipient!.country,
				recipent_full_name: this.recipient!.full_name,
				recipent_state: this.recipient!.state,
				recipent_street_one: this.recipient!.street_one,
				recipent_zip: this.recipient!.zip,
				sender_company_name: this.sender!.company_name,
				sender_street_two: this.sender!.street_two,
				sender_city: this.sender!.city,
				sender_country: this.sender!.country,
				sender_full_name: this.sender!.full_name,
				sender_state: this.sender!.state,
				sender_street_one: this.sender!.street_one,
				sender_zip: this.sender!.zip,
				shipping_date: this.shippingdate!,
				type: "usps",
				type_label: this.type_!.label,
				type_unit: this.type_!.unit,
				type_value: this.type_!.value,
				user_id: this.context!.get("jwtPayload").id,
			});
		if (!insert.success) throw exception({ message: "Failed to insert label", code: 9908 });

		this.labeluuid = labeluuid;

		return insert;
	}

	async generate() {
		this.required();

		if (this.labeluuid === null) throw exception({ message: "Label uuid not defiend", code: 5087 });

		const res = await fetch_<{ id: number; code: string; pdf: string }>("/api/label/generate", {
			type: this.type_!.value,
			weight: this.package_!.weight,
			date: this.shippingdate!,
			fromCountry: this.sender!.country,
			fromName: this.sender!.full_name,
			fromRefNumber: this.sender?.company_name,
			fromStreetNumber: this.sender!.street_one,
			fromStreetNumber2: this.sender?.street_two,
			fromZip: this.sender!.zip,
			fromCity: this.sender!.city,
			fromState: this.sender!.state,
			toCountry: this.recipient!.country,
			toName: this.recipient!.full_name,
			toRefNumber: this.recipient?.company_name,
			toStreetNumber: this.recipient!.street_one,
			toStreetNumber2: this.recipient?.street_two,
			toZip: this.recipient!.zip,
			toCity: this.recipient!.city,
			toState: this.recipient!.state,
		});

		if (!res.payload.code || !res.payload.pdf || !res.payload.id) {
			throw exception({ message: "invalid payload value", code: 9870 });
		}

		const update = await drizzle(this.context!.env.DB).update(labels).set({
			remote_id: res.payload.id,
			remote_pdf_link: res.payload.pdf,
			remote_tracking_number: res.payload.code,
		});
		if (!update.success) throw exception({ message: "Failed to update label", code: 3765 });

		this.remotepdf = res.payload.pdf;
	}

	async download() {
		this.required();

		if (this.remotepdf === null) throw exception({ message: "Remote PDF not defiend", code: 5088 });
		if (this.labeluuid === null) throw exception({ message: "Label uuid not defiend", code: 5089 });

		const req = await fetch(`${this.remotepdf}`);

		if (!req.ok) {
			throw exception({
				message: "Failed to download the pdf from api",
				code: 67564,
			});
		}

		const buffer = await req.arrayBuffer();

		const r2object = await this.context!.env.LABELS_BUCKET.put("hello", buffer, {
			customMetadata: { pdf: this.remotepdf, label_uuid: this.labeluuid },
		});

		return r2object;
	}
}
