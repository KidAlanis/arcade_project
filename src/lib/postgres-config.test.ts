import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "pg";
import { postgresConfig, databaseFailureHint } from "./postgres-config";
const example =
  "postgresql://postgres.example:test-only-password@aws-0-example.pooler.supabase.com:6543/postgres";
test("transaction pooler uses one shared connection and verified TLS without startup session state", () => {
  const config = postgresConfig({ DATABASE_URL: example });
  assert.equal(config.max, 1);
  assert.deepEqual(config.ssl, { rejectUnauthorized: true });
  assert.equal(config.connectionString, undefined);
  assert.equal(config.options, undefined);
  assert.equal(config.statement_timeout, undefined);
});
test("URI SSL mode cannot override certificate verification in pg", () => {
  const config = postgresConfig({ DATABASE_URL: example + "?sslmode=require" });
  const client = new Client(config); // Does not connect.
  assert.deepEqual(client.ssl, { rejectUnauthorized: true });
  for (const suffix of [
    "?sslmode=no-verify",
    "?sslmode=disable",
    "?options=-c%20search_path%3Dother",
  ]) {
    assert.throws(
      () => postgresConfig({ DATABASE_URL: example + suffix }),
      /configuration is invalid/,
    );
  }
});
test("configuration rejects unsafe pool settings and session startup environment", () => {
  for (const size of ["0", "11", "1.5", "NaN"])
    assert.throws(() =>
      postgresConfig({ DATABASE_URL: example, DATABASE_POOL_MAX: size }),
    );
  assert.throws(() =>
    postgresConfig({
      DATABASE_URL: example,
      PGOPTIONS: "-c search_path=other",
    }),
  );
});
test("migration needs a separate direct connection and cannot fall back to runtime URI", () => {
  assert.throws(
    () => postgresConfig({ DATABASE_URL: example }, "migration"),
    /MIGRATION_DATABASE_URL is missing/,
  );
  assert.throws(
    () => postgresConfig({ MIGRATION_DATABASE_URL: example }, "migration"),
    /Migration configuration is invalid/,
  );
  const config = postgresConfig(
    {
      MIGRATION_DATABASE_URL:
        "postgresql://postgres:test-only-password@db.example.supabase.co:5432/postgres",
    },
    "migration",
  );
  assert.equal(config.max, 1);
});
test("errors disclose only known categories, never driver text", () => {
  const privateDetail = "test-private-detail";
  for (const code of [
    "28P01",
    "ENOTFOUND",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "unknown",
  ])
    assert.ok(
      !databaseFailureHint({ code, message: privateDetail }).includes(
        privateDetail,
      ),
    );
});
