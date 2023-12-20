import { z } from "zod";

export const ZODSCHEMA = z.object({
	gateway: z.string(),
	credit: z.number(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
