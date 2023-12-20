import { config } from "@config";
import { findLabelCostByWeight } from "@helpers/query";
import { USPS } from "@lib/usps";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { girth } from "@utils/girth";
import { Context } from "hono";
import { v4 } from "uuid";

export const USPSSignleLabelUser = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = Usps.ZODSCHEMA.parse(body);

	const isGirthOk = girth([parse.package.height, parse.package.length, parse.package.width]);

	if (isGirthOk > config.packages.max_girth) {
		throw exception({ message: "Max girth exceeded", code: 97867 });
	}

	// Find cost
	const costs = await findLabelCostByWeight(c, {
		id: parse.type.id,
		type: "usps",
		weight: parse.package.weight,
	});

	const usps = new USPS(c);

	if (!(await usps.hasBalance(costs.user_cost))) {
		throw exception({ message: "Insufficient balance", code: 56786 });
	}

	// Set
	usps.setShippingDate(parse.shippingdate);
	usps.setSender({
		city: parse.sender.city,
		company_name: parse.sender.company_name,
		country: parse.sender.country,
		full_name: parse.sender.full_name,
		state: parse.sender.state,
		street_one: parse.sender.street_one,
		street_two: parse.sender.street_two,
		zip: parse.sender.zip,
	});
	usps.setRecipient({
		city: parse.recipient.city,
		company_name: parse.recipient.company_name,
		country: parse.recipient.country,
		full_name: parse.recipient.full_name,
		state: parse.recipient.state,
		street_one: parse.recipient.street_one,
		street_two: parse.recipient.street_two,
		zip: parse.recipient.zip,
	});
	usps.setPackage({
		height: parse.package.height,
		length: parse.package.length,
		name: parse.package.name,
		uuid: parse.package.uuid,
		weight: parse.package.weight,
		width: parse.package.width,
	});
	usps.setCost({ user_cost: costs.user_cost, reseller_cost: costs.reseller_cost });
	usps.setType({ label: parse.type.label, unit: parse.type.unit, value: parse.type.value, id: parse.type.id });

	// Action
	await usps.pay();
	await usps.insert();
	await usps.generate();
	await usps.download();

	return c.json({ message: "Success" });
};

export const USPSBatchLabelUser = async (c: Context<App>) => {
	// Validation
	const body = await c.req.json();
	const parse = Usps.BATCHZODSCHEMA.parse(body);

	const isGirthOk = girth([parse.package.height, parse.package.length, parse.package.width]);

	if (isGirthOk > config.packages.max_girth) {
		throw exception({ message: "Max girth exceeded", code: 97868 });
	}

	// Find cost
	const costs = await findLabelCostByWeight(c, {
		id: parse.type.id,
		type: "usps",
		weight: parse.package.weight,
	});

	const usps = new USPS(c);

	const total_labels_cost = costs.user_cost * parse.recipient.length;
	const total_labels_reseller_cost = costs.reseller_cost * parse.recipient.length;

	usps.setCost({ reseller_cost: total_labels_reseller_cost, user_cost: total_labels_cost });

	if (!(await usps.hasBalance(total_labels_cost))) {
		throw exception({ message: "Insufficient balance", code: 56789 });
	}

	// Store batch in KV
	const kv_batch_uuid = v4();
	await c.env.BATCH_KV.put(
		kv_batch_uuid,
		JSON.stringify({
			total_labels: parse.recipient.length,
			reseller_cost: total_labels_reseller_cost,
			user_cost: total_labels_cost,
			type: "usps",
			data: parse,
		}),
		{ metadata: c.get("jwtPayload") },
	);

	await usps.pay({ total_labels: parse.recipient.length });

	return c.json({ batch: kv_batch_uuid });
};
