import { z } from "zod";

export const FETCHSCHEMA = z.object({
	weight: z.coerce.number().min(1),
	type_id: z.number().min(1),
	type: z.enum(["usps", "ups"]),
});

export type FETCHSCHEMA = z.infer<typeof FETCHSCHEMA>;

export const CREATESCHEMA = z.object({
	to_weight: z.coerce.number().min(1),
	from_weight: z.coerce.number().min(1),
	user_cost: z.coerce.number().min(1),
	reseller_cost: z.coerce.number().min(1),
	type_id: z.coerce.number().min(1),
});

export type CREATESCHEMA = z.infer<typeof CREATESCHEMA>;
