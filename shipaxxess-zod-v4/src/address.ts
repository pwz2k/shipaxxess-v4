import { z } from "zod";

export const ZODSCHEMA = z.object({
	full_name: z.string().min(2),
	company_name: z.string().optional(),
	street_one: z.string().min(2),
	street_two: z.string().optional(),
	city: z.string().min(2),
	zip: z.string().min(2),
	state: z.string().min(2),
	country: z.string().min(2),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;

export const IDZODSCHEMA = ZODSCHEMA.merge(z.object({ id: z.number() }));

export type IDZODSCHEMA = z.infer<typeof IDZODSCHEMA>;
