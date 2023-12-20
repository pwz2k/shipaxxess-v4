import z from "zod";

export const ZODSCHEMA = z.object({
	message: z.string(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
