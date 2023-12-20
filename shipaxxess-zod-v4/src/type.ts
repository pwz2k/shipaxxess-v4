import { z } from "zod";

export const ZODSCHEMA = z.object({
	label: z.string(),
	value: z.string(),
	unit: z.string(),
	id: z.number(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
