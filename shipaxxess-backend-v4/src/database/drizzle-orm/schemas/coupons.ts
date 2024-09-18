import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const coupons = sqliteTable("coupons", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    value: real("value").notNull(),
    code: text("code").notNull(),
    usedCount: integer('usedCount').default(0),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type CouponsSelectModel = InferSelectModel<typeof coupons>;
export type CouponsInsertModel = InferInsertModel<typeof coupons>;
