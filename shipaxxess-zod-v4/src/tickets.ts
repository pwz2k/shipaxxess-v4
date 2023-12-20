import { z } from "zod";

export const ZODSCHEMA = z.object({
	title: z.string().min(2),
	type: z.string().min(1),
	content: z.string().min(2),
	data_id: z.number().optional(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;

export const IDZODSCHEMA = ZODSCHEMA.merge(z.object({ id: z.number() }));

export type IDZODSCHEMA = z.infer<typeof IDZODSCHEMA>;
