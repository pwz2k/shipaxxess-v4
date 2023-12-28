import { z } from "zod";

export const FETCHSCHEMA = z.object({
	weight: z.number().min(1),
	type_id: z.number().min(1),
	type: z.enum(["usps", "ups"]),
});

export type FETCHSCHEMA = z.infer<typeof FETCHSCHEMA>;

export const CREATESCHEMA = z.object({
	weight: z.number().min(1),
	user_cost: z.number().min(1),
	reseller_cost: z.number().min(1),
	type_id: z.number().min(1),
});

export type CREATESCHEMA = z.infer<typeof CREATESCHEMA>;
