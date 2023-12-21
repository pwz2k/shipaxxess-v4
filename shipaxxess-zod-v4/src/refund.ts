import z from "zod";

export const ZODSCHEMA = z.object({
	batch: z.array(z.object({ id: z.number() })),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
