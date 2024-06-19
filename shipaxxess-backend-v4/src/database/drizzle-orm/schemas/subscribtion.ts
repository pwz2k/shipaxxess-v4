
// create table to mange user notifcaton subscribtion from client


import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const subscribtion = sqliteTable("subscribtion", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    user_id: integer("user_id").notNull(),
    subscription: text("subscription").notNull(),
    token: text("token").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});