// CLI generation only. Uses the runtime configuration with read-only connections.
import nextEnv from "@next/env";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import type { PostgresPool, PostgresQueryResult, PostgresCursor } from "kysely";
import { authConfiguration } from "../src/lib/server/auth-configuration";
import { postgresConfig } from "../src/lib/postgres-config";
nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const pool = new Pool(postgresConfig(process.env, "inspection"));
pool.on("error", () =>
  console.error("A schema-generation connection closed; details hidden."),
);
const readOnlyPool: PostgresPool = {
  options: pool.options,
  async connect() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN READ ONLY");
      await client.query("SET LOCAL statement_timeout = '10s'");
    } catch {
      client.release(true);
      throw new Error("Cannot start read-only schema generation.");
    }
    function query<R>(
      text: string,
      parameters: ReadonlyArray<unknown>,
    ): Promise<PostgresQueryResult<R>>;
    function query<R>(cursor: PostgresCursor<R>): PostgresCursor<R>;
    function query<R>(
      text: string | PostgresCursor<R>,
      parameters: ReadonlyArray<unknown> = [],
    ): Promise<PostgresQueryResult<R>> | PostgresCursor<R> {
      if (typeof text !== "string")
        throw new Error("Cursors are not permitted during schema generation.");
      if (
        /^\s*(?:begin|start\s+transaction|commit|rollback|end|abort|set\s+(?:session|transaction))\b/i.test(
          text,
        )
      )
        throw new Error("Schema generation must remain read-only.");
      return client
        .query(text, [...parameters])
        .then((result) => ({
          rows: result.rows as R[],
          rowCount: result.rowCount ?? 0,
          command: result.command as PostgresQueryResult<R>["command"],
        }));
    }
    return {
      query,
      release() {
        void client
          .query("ROLLBACK")
          .then(() => client.release())
          .catch(() => client.release(true));
      },
    };
  },
  async end() {
    await pool.end();
  },
};
export const auth = betterAuth({
  ...authConfiguration(readOnlyPool, process.env),
  // Same schema as runtime. CLI performs its own introspection; skip duplicate runtime checks.
  advanced: { database: { validateSchema: false } },
});
