import z from "zod";

export const ZODSCHEMA = z.object({
	message: z.string(),
	id: z.number(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
