import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const discount = sqliteTable("discount", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    value: integer("value").default(20),

});

export type DiscountSelectModel = InferSelectModel<typeof discount>;
export type DiscountInsertModel = InferInsertModel<typeof discount>;
