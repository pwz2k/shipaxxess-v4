import { Context } from "hono";

const GetAll = (c: Context<App>) => {
	return c.json({});
};

const LabelsUser = { GetAll };

export { LabelsUser };
