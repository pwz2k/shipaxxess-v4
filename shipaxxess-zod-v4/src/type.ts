import { z } from "zod";

export const ZODSCHEMA = z.object({
	label: z.string(),
	value: z.string(),
	unit: z.enum(["oz", "lb"]),
	type: z.enum(["usps", "ups"]),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;

export const IDZODSCHEMA = ZODSCHEMA.merge(z.object({ id: z.number() }));

export type IDZODSCHEMA = z.infer<typeof IDZODSCHEMA>;
