import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const labels = sqliteTable(
	"labels",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		uuid: text("uuid").notNull(),
		user_id: integer("user_id").notNull(),

		// Status
		status_message: text("status_message"),
		status_label: text("status_label").default("inqueue").notNull(),
		status_refund: integer("status_refund", { mode: "boolean" }).default(false).notNull(),
		is_downloaded: integer("is_downloaded", { mode: "boolean" }).notNull().default(false),

		// Remote data
		remote_pdf_r2_link: text("pdf_r2_link"),
		remote_id: integer("remote_id"),
		remote_pdf_link: text("remote_pdf_link"),
		remote_tracking_number: text("tracking_number"),

		// Sender
		sender_full_name: text("sender_full_name").notNull(),
		sender_company_name: text("sender_company_name"),
		sender_street_one: text("sender_street_one").notNull(),
		sender_street_two: text("sender_street_two"),
		sender_city: text("sender_city").notNull(),
		sender_zip: text("sender_zip").notNull(),
		sender_state: text("sender_state").notNull(),
		sender_country: text("sender_country").notNull(),

		// Recipent
		recipent_full_name: text("recipent_full_name").notNull(),
		recipent_company_name: text("recipent_company_name"),
		recipent_street_one: text("recipent_street_one").notNull(),
		recipent_street_two: text("recipent_street_two"),
		recipent_city: text("recipent_city").notNull(),
		recipent_zip: text("recipent_zip").notNull(),
		recipent_state: text("recipent_state").notNull(),
		recipent_country: text("recipent_country").notNull(),

		// Type
		type: text("type").notNull(),
		type_label: text("type_label").notNull(),
		type_value: text("type_value").notNull(),
		type_unit: text("weight_unit").notNull(),

		// Package
		package_id: integer("package_id"),
		package_uuid: text("package_uuid"),
		package_name: text("package_name"),
		package_width: integer("package_width").notNull(),
		package_height: integer("package_height").notNull(),
		package_length: integer("package_length").notNull(),
		package_weight: integer("package_weight").notNull(),

		// Costs
		cost_user: integer("cost_user").notNull(),
		cost_reseller: integer("cost_reseller").notNull(),

		// Date
		shipping_date: text("shipping_date").notNull(),
		created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
		updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => ({
		uuidIndex: uniqueIndex("uuidIndex").on(table.uuid),
		remoteIdIndex: uniqueIndex("remoteIdIndex").on(table.remote_id),
	}),
);

export type LabelsSelectModel = InferSelectModel<typeof labels>;
export type LabelsInsertModel = InferInsertModel<typeof labels>;
