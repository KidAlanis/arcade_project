// One configuration factory for runtime auth and CLI schema generation.
// The actual runtime entry point (auth.ts) and pg pool (db.ts) are server-only.
import { PostgresDialect, type PostgresPool } from "kysely";
import { nextCookies } from "better-auth/next-js";
import { authOptions } from "./auth-options";

export function authConfiguration(
  pool: PostgresPool,
  env: Record<string, string | undefined>,
) {
  if (!env.BETTER_AUTH_SECRET || !env.BETTER_AUTH_URL)
    throw new Error("Authentication environment configuration is incomplete.");
  return {
    ...authOptions,
    database: {
      dialect: new PostgresDialect({ pool }),
      type: "postgres" as const,
      schemaName: "public",
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    plugins: [nextCookies()],
  };
}
