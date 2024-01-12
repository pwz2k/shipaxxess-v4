import moment from "moment-timezone";
import { z } from "zod";
import * as Address from "./address";
import * as Package from "./package";
import * as Type from "./type";

export const COMMONSCHEMA = z.object({
	sender: Address.IDZODSCHEMA,
	sender_select: z.string().optional(),
	package: Package.IDOPTIONAL,
	package_select: z.string().optional(),
	type: Type.IDZODSCHEMA,
	type_select: z.string().optional(),
	shippingdate: z
		.string()
		.transform((val) => {
			return moment(val).format("MM/DD/YYYY");
		})
		.optional(),
	reference1: z.string().optional(),
	description: z.string().optional(),
	saturday: z.boolean().optional(),
	signature: z.boolean().optional(),
});

export type COMMONSCHEMA = z.infer<typeof COMMONSCHEMA>;

export const ZODSCHEMA = COMMONSCHEMA.merge(
	z.object({
		recipient: Address.ZODSCHEMA,
	}),
);

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;

export const RECIPIENTSCHEMAARRAY = z.array(Address.ZODSCHEMA.merge(z.object({ uuid: z.string().uuid() }))).min(1);

export type RECIPIENTSCHEMAARRAY = z.infer<typeof RECIPIENTSCHEMAARRAY>;

export const BATCHZODSCHEMA = COMMONSCHEMA.merge(
	z.object({
		batch_uuid: z.string().uuid(),
		recipient: RECIPIENTSCHEMAARRAY,
	}),
);

export type BATCHZODSCHEMA = z.infer<typeof BATCHZODSCHEMA>;
