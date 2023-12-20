import { z } from "zod";
import * as Address from "./address";
import * as Package from "./package";
import * as Type from "./type";

const COMMONSCHEMA = z.object({
	sender: Address.ZODSCHEMA,
	shippingdate: z.string().min(2),
	package: Package.ZODSCHEMA.merge(z.object({ id: z.number().optional() })),
	type: Type.ZODSCHEMA,
});

export type COMMONSCHEMA = z.infer<typeof COMMONSCHEMA>;

export const ZODSCHEMA = COMMONSCHEMA.merge(
	z.object({
		recipient: Address.ZODSCHEMA,
	}),
);

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;

export const BATCHZODSCHEMA = COMMONSCHEMA.merge(
	z.object({
		recipient: z.array(Address.ZODSCHEMA).min(1),
	}),
);

export type BATCHZODSCHEMA = z.infer<typeof BATCHZODSCHEMA>;
