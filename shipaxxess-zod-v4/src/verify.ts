import z from "zod";

export const ZODSCHEMA = z.object({
	email_address: z.string().email(),
	code: z.string(),
	type: z.enum(["email_verification", "reset"]),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
