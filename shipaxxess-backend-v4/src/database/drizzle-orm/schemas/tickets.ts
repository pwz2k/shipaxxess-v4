import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tickets = sqliteTable("tickets", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	uuid: text("uuid").notNull(),
	user_id: integer("user_id").notNull(),
	title: text("title").notNull(),
	type: text("type").notNull(),
	data_id: integer("data_id"),
	content: text("content").notNull(),
	status: text("status").notNull().default("active"),
	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type TicketsSelectModel = InferSelectModel<typeof tickets>;
export type TicketsInsertModel = InferInsertModel<typeof tickets>;
