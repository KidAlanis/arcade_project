import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getAuthTables } from "better-auth/db";
import { authOptions } from "./server/auth-options";

test("prepared SQL covers the installed Better Auth model names, field types and nullability (offline)", () => {
  const sql = readFileSync(
    "db/migrations/001_better_auth.sql",
    "utf8",
  ).replaceAll('"', "");
  const tables = getAuthTables(authOptions);
  for (const table of Object.values(tables)) {
    const block = sql.match(
      new RegExp(
        `CREATE TABLE public\\.${table.modelName} \\(([\\s\\S]*?)\\);`,
        "i",
      ),
    )?.[1];
    assert.ok(block, `Missing table ${table.modelName}`);
    assert.match(block, /id text not null primary key/i);
    for (const [name, field] of Object.entries(table.fields)) {
      const column = field.fieldName || name;
      const type =
        field.type === "string"
          ? "text"
          : field.type === "boolean"
            ? "boolean"
            : field.type === "date"
              ? "timestamptz"
              : field.bigint
                ? "bigint"
                : "integer";
      assert.match(
        block,
        new RegExp(
          `\\b${column} ${type}${field.required ? "(?: default [^,]+)? NOT NULL" : ""}`,
          "i",
        ),
        `${table.modelName}.${column}`,
      );
      if (field.unique)
        assert.match(block, new RegExp(`\\b${column} [^,]*UNIQUE`, "i"));
      if (field.references)
        assert.match(
          block,
          new RegExp(
            `\\b${column}[^,]*REFERENCES public\\.arcade_user \\(id\\) ON DELETE CASCADE`,
            "i",
          ),
        );
    }
  }
});

test("the applyable auth migration retains exact CLI SQL and RLS hardening", () => {
  const raw = readFileSync(
    "db/migrations/generated/001_better_auth.sql",
    "utf8",
  );
  const authSql = readFileSync("db/migrations/001_better_auth.sql", "utf8");
  const appSql = readFileSync("db/migrations/002_player_data.sql", "utf8");
  assert.ok(
    authSql.includes(raw),
    "Generated SQL must remain verbatim in the secured migration",
  );
  const expected = [
    ...Object.values(getAuthTables(authOptions)).map(
      (table) => table.modelName,
    ),
    "arcade_wallets",
    "arcade_prizes",
    "arcade_redemptions",
    "arcade_game_results",
  ];
  const allSql = (authSql + "\n" + appSql).replaceAll('"', "");
  const actual = [...allSql.matchAll(/create table public\.([a-z_]+)/gi)].map(
    (match) => match[1],
  );
  assert.deepEqual(actual.sort(), expected.sort());
  for (const table of expected)
    assert.match(
      allSql,
      new RegExp(
        `ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`,
        "i",
      ),
    );
  assert.doesNotMatch(allSql, /CREATE POLICY|DROP TABLE|TRUNCATE|DELETE FROM/i);
  assert.match(
    appSql,
    /prize_id text NOT NULL REFERENCES public\.arcade_prizes\(id\) ON DELETE RESTRICT/,
  );
  assert.match(appSql, /UNIQUE \(user_id, request_id\)/);
});
