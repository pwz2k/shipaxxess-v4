import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const batchs = sqliteTable("batchs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	uuid: text("uuid").notNull(),
	user_id: integer("user_id").notNull(),
	data: text("data").notNull(),
	total_labels: integer("total_labels").notNull(),
	total_cost: integer("total_cost").notNull(),
	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type BatchsSelectModel = InferSelectModel<typeof batchs>;
export type BatchsInsertModel = InferInsertModel<typeof batchs>;
