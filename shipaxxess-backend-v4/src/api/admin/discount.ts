import { Model } from "@lib/model";
import { discount } from "@schemas/discount";
import { Discount } from "@shipaxxess/shipaxxess-zod-v4";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
    const model = new Model(c.env.DB);

    const cr = await model.all(discount);

    return c.json(cr);
};
const Edit = async (c: Context<App>) => {
    const body = await c.req.json();
    const parse = Discount.EDITSCHEMA.parse(body);
    const model = new Model(c.env.DB);
    const check = await model.all(discount);
    if (check.length === 0) {
        await model.insert(discount, {
            value: parse.value,
            id: 1,
        });
    } else {
        await model.update(
            discount,
            {
                value: parse.value,
            },
            eq(discount.id, check[0].id)
        );
    }
    return c.json({ success: true });
};


export const DiscountAdmin = { GetAll, Edit };
