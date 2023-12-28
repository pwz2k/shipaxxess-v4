import { exception } from "@utils/error";
import { SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";

export class Model {
	constructor(private db: D1Database) {}

	async get<T extends SQLiteTable<TableConfig>>(table: T, condition: SQL<unknown> | undefined) {
		const data = await drizzle(this.db).select().from(table).where(condition).get();
		if (!data) throw exception({ message: "Not found", code: 7667 });
		return data;
	}

	async all<T extends SQLiteTable<TableConfig>>(table: T, condition?: SQL<unknown>) {
		if (condition) {
			return await drizzle(this.db).select().from(table).where(condition).all();
		}
		return await drizzle(this.db).select().from(table).all();
	}

	async insert<T extends SQLiteTable<TableConfig>>(table: T, params: T["$inferInsert"]) {
		return await drizzle(this.db).insert(table).values(params).returning();
	}

	async update<T extends SQLiteTable<TableConfig>>(
		table: T,
		params: Partial<T["$inferSelect"]>,
		condition: SQL<unknown>,
	) {
		return await drizzle(this.db).update(table).set(params).where(condition).returning();
	}

	async delete<T extends SQLiteTable<TableConfig>>(table: T, condition: SQL<unknown>) {
		return await drizzle(this.db).delete(table).where(condition).returning();
	}
}
