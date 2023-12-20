import { findUserById } from "@helpers/query";
import { Context } from "hono";

export const StatusUser = async (c: Context<App>) => {
	const user = await findUserById(c);
	return c.json(user);
};
