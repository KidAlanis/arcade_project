import nextEnv from "@next/env";
import { Pool } from "pg";
import {
  postgresConfig,
  databaseFailureHint,
} from "../src/lib/postgres-config.ts";
nextEnv.loadEnvConfig(process.cwd(), true, {
  info() {},
  error() {},
  warn() {},
});
let pool;
let client;
let inTransaction = false;
try {
  pool = new Pool(postgresConfig(process.env, "inspection"));
  pool.on("error", () =>
    console.error("An idle inspection connection closed; details hidden."),
  );
  client = await pool.connect();
  await client.query("BEGIN READ ONLY");
  inTransaction = true;
  await client.query("SET LOCAL statement_timeout = '10s'");
  await client.query("SET LOCAL lock_timeout = '5s'");
  const mode = await client.query(
    "SELECT current_setting('transaction_read_only') AS read_only",
  );
  if (mode.rows[0]?.read_only !== "on") throw new Error();
  const stream = client.connection.stream;
  if (!stream.encrypted || !stream.authorized) throw new Error();
  console.log(
    "Connection: successful. TLS: encrypted with server certificate verification. Transaction: READ ONLY.",
  );
  const tables =
    await client.query(`SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
    FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind IN ('r','p') ORDER BY c.relname`);
  const relevant = tables.rows.filter((row) =>
    /arcade|auth|user|profile|player|wallet|ticket|prize|redemp|game|account|session|verification/i.test(
      row.table_name,
    ),
  );
  const names = relevant.map((row) => row.table_name);
  const columns = await client.query(
    `SELECT table_name, column_name, data_type, is_nullable
    FROM information_schema.columns WHERE table_schema='public' AND table_name=ANY($1::text[])
    ORDER BY table_name, ordinal_position`,
    [names],
  );
  const constraints = await client.query(
    `SELECT c.relname AS table_name, con.conname AS constraint_name,
    con.contype AS type, r.relname AS referenced_table,
    ARRAY(SELECT a.attname FROM unnest(con.conkey) WITH ORDINALITY AS k(num, ord)
      JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum=k.num ORDER BY k.ord) AS columns
    FROM pg_constraint con JOIN pg_class c ON con.conrelid=c.oid
    JOIN pg_namespace n ON c.relnamespace=n.oid LEFT JOIN pg_class r ON con.confrelid=r.oid
    WHERE n.nspname='public' AND c.relname=ANY($1::text[]) ORDER BY c.relname, con.conname`,
    [names],
  );
  console.log(
    JSON.stringify(
      {
        publicTables: tables.rows,
        relevantTables: relevant,
        columns: columns.rows,
        constraints: constraints.rows,
      },
      null,
      2,
    ),
  );
  await client.query("ROLLBACK");
  inTransaction = false;
  console.log(
    "Inspection complete. No player rows read, no schema changes, no migrations, and no persistent data writes.",
  );
} catch (error) {
  console.error(databaseFailureHint(error));
  process.exitCode = 1;
} finally {
  if (client && inTransaction) await client.query("ROLLBACK").catch(() => {});
  client?.release();
  await pool?.end();
}
