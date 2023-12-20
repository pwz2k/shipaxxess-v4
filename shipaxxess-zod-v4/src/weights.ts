import { z } from "zod";

export const ZODSCHEMA = z.object({
	weight: z.number().min(1),
	type: z.enum(["ups", "usps"]),
	id: z.number().min(1),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
