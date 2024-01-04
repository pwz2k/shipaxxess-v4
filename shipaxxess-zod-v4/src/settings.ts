import { z } from "zod";

export const PROFILETAB = z.object({
	first_name: z.string(),
	last_name: z.string(),
	email_address: z.string().email(),
	password: z.string().optional(),
	timezone: z.string(),
});

export type PROFILETAB = z.infer<typeof PROFILETAB>;

export const NOTIFICATIONSTAB = z.object({
	type: z.string(),
	status: z.boolean(),
});

export type NOTIFICATIONSTAB = z.infer<typeof NOTIFICATIONSTAB>;

export const COUPONTAB = z.object({
	coupon_code: z.string(),
});

export type COUPONTAB = z.infer<typeof COUPONTAB>;
