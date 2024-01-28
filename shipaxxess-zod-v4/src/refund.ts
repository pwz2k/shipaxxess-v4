import z from "zod";

export const ZODSCHEMA = z.object({
	batch_uuid: z.string(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
