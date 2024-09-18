import { z } from "zod";

export const ZODSCHEMA = z.object({
    code: z.string(),
    value: z.number(),
    usedCount: z.number(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;

export const IDZODSCHEMA = ZODSCHEMA.merge(z.object({ id: z.number() }));

export type IDZODSCHEMA = z.infer<typeof IDZODSCHEMA>;

export const CREATESCHEMA = z.object({
    code: z.string(),
    value: z.number().positive(),
    usedCount: z.number(),
});

export type CREATESCHEMA = z.infer<typeof CREATESCHEMA>;

export const EDITSCHEMA = CREATESCHEMA.merge(z.object({ id: z.number() }));

export type EDITSCHEMA = z.infer<typeof EDITSCHEMA>;
