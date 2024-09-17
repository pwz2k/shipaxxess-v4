import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./src/database/drizzle-orm/schemas/*",  // Path to schema files
  out: "./src/database/drizzle-orm/migrations",    // Path to migration files
  dialect: "sqlite",
  // driver: "pglite",                              // Dialect for PostgreSQL
};

export default config satisfies Config;
