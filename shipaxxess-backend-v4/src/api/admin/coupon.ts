import { Model } from "@lib/model";
import { coupons } from "@schemas/coupons";
import { Coupon, Id } from "@shipaxxess/shipaxxess-zod-v4";
import { exception } from "@utils/error";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const GetAll = async (c: Context<App>) => {
    const model = new Model(c.env.DB);

    const tp = await model.all(coupons);

    return c.json(tp);
};

const Get = async (c: Context<App, "/:id">) => {
    const coupon_id = c.req.param("id");

    const model = new Model(c.env.DB);

    const tp = await model.get(coupons, eq(coupons.id, parseInt(coupon_id)));

    return c.json(tp);
};

const Create = async (c: Context<App>) => {
    const body = await c.req.json();
    const parse = Coupon.CREATESCHEMA.parse(body);
    const model = new Model(c.env.DB);
    const check = await model.get(coupons, eq(coupons.code, parse.code));
    if (check) throw exception({ message: "Coupon already exists", code: 400 });

    await model.insert(coupons, {
        code: parse.code,
        value: parse.value,
        usedCount: parse.usedCount,
    });

    return c.json({ success: true });
};

const Edit = async (c: Context<App>) => {
    const body = await c.req.json();
    const parse = Coupon.EDITSCHEMA.parse(body);

    const model = new Model(c.env.DB);

    const check = await model.get(coupons, eq(coupons.id, parse.id));
    if (!check) throw exception({ message: "Type not found", code: 404 });

    await model.update(
        coupons,
        {
            value: parse.value,
            code: parse.code,
            usedCount: parse.usedCount
        },
        eq(coupons.id, parse.id),
    );

    return c.json({ success: true });
};

const Delete = async (c: Context<App>) => {
    const body = await c.req.json();
    const parse = Id.ZODSCHEMA.parse(body);

    const model = new Model(c.env.DB);

    const check = await model.get(coupons, eq(coupons.id, parse.id));
    if (!check) throw exception({ message: "Type not found", code: 404 });


    await model.delete(coupons, eq(coupons.id, parse.id));

    return c.json({ success: true });
};

const CouponsAdmin = { GetAll, Create, Edit, Delete, Get };

export { CouponsAdmin };

