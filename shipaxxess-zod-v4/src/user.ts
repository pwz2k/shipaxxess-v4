import z from "zod";

export const ZODSCHEMA = z.object({
	first_name: z.string(),
	last_name: z.string(),
	email_address: z.string().email(),
	password: z.string().min(6).max(100),
	timezone: z.string(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
