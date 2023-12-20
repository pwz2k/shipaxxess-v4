import { z } from "zod";

export const ZODSCHEMA = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	email_address: z.string().email(),
	password: z.string().min(6),
	timezone: z.string().min(1),
	coupon: z.string().min(1),
	marketing_email_notify: z.boolean(),
	labels_email_notify: z.boolean(),
	topups_email_notify: z.boolean(),
	tickets_email_notify: z.boolean(),
});

export type ZODSCHEMA = z.infer<typeof ZODSCHEMA>;
