import { exception } from "@utils/error";
import { SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";

export class Model {
	constructor(private db: D1Database) {}

	async insert<T extends SQLiteTable<TableConfig>>(table: T, params: T["$inferInsert"]) {
		const insert = await drizzle(this.db).insert(table).values(params);
		if (!insert.success) throw exception({ message: "Failed to insert", code: 7666 });
		return insert;
	}

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

	async update<T extends SQLiteTable<TableConfig>>(
		table: T,
		params: Partial<T["$inferSelect"]>,
		condition: SQL<unknown>,
	) {
		const update = await drizzle(this.db).update(table).set(params).where(condition);
		if (!update.success) throw exception({ message: "Failed to update", code: 7565 });
		return update;
	}

	async delete<T extends SQLiteTable<TableConfig>>(table: T, condition: SQL<unknown>) {
		const dt = await drizzle(this.db).delete(table).where(condition);
		if (!dt.success) throw exception({ message: "Failed to delete", code: 7865 });
		return dt;
	}
}
