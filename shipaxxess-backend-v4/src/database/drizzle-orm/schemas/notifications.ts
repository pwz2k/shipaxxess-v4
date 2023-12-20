import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notifications = sqliteTable("notifications", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	uuid: text("uuid").notNull(),
	user_id: integer("user_id").notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	read: integer("read", { mode: "boolean" }).default(false),
	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type NotificationsSelectModel = InferSelectModel<typeof notifications>;
export type NotificationsInsertModel = InferInsertModel<typeof notifications>;
