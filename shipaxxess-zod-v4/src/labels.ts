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

export const RECIPIENTSCHEMAARRAY = z.array(Address.ZODSCHEMA.merge(z.object({ uuid: z.string().uuid() }))).min(1);

export type RECIPIENTSCHEMAARRAY = z.infer<typeof RECIPIENTSCHEMAARRAY>;

export const BATCHZODSCHEMA = COMMONSCHEMA.merge(
	z.object({
		batch_uuid: z.string().uuid(),
		recipient: RECIPIENTSCHEMAARRAY,
	}),
);

export type BATCHZODSCHEMA = z.infer<typeof BATCHZODSCHEMA>;
