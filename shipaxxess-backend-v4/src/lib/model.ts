import { exception } from "@utils/error";
import { SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";

export class Model {
	private db: D1Database | null = null;

	/**
	 *
	 */
	constructor(c: D1Database) {
		this.db = c;
	}

	/**
	 *
	 */
	private required() {
		if (this.db === null) throw exception({ message: "Context not found", code: 7546456 });
	}

	/**
	 *
	 */
	async create<T extends SQLiteTable<TableConfig>>(table: T, params: T["$inferInsert"]) {
		this.required();

		const insert = await drizzle(this.db!).insert(table).values(params);
		if (!insert.success) throw exception({ message: "Failed to insert", code: 7666 });

		return insert;
	}

	/**
	 *
	 */
	async read<T extends SQLiteTable<TableConfig>>(table: T, condition: SQL<unknown> | undefined) {
		this.required();

		const data = await drizzle(this.db!).select().from(table).where(condition).get();
		if (!data) throw exception({ message: "Not found", code: 7667 });
		return data;
	}

	/**
	 *
	 */
	async readAll<T extends SQLiteTable<TableConfig>>(table: T, condition?: SQL<unknown>) {
		this.required();

		if (condition) {
			return await drizzle(this.db!).select().from(table).where(condition).all();
		}

		return await drizzle(this.db!).select().from(table).all();
	}

	/**
	 *
	 */
	async update<T extends SQLiteTable<TableConfig>>(
		table: T,
		params: Partial<T["$inferSelect"]>,
		condition: SQL<unknown>,
	) {
		this.required();

		const update = await drizzle(this.db!).update(table).set(params).where(condition);
		if (!update.success) throw exception({ message: "Failed to update", code: 7565 });

		return update;
	}

	/**
	 *
	 */
	async delete<T extends SQLiteTable<TableConfig>>(table: T, condition: SQL<unknown>) {
		this.required();

		const dt = await drizzle(this.db!).delete(table).where(condition);
		if (!dt.success) throw exception({ message: "Failed to delete", code: 7865 });

		return dt;
	}
}
