// Deliberately plan-only. The current project setup requires verified Supabase MCP.
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const names = ["001_better_auth.sql", "002_player_data.sql", "003_private_trigger_permissions.sql"];
if (process.argv.includes("--apply")) {
  console.error(
    "Apply blocked: this setup requires the verified Supabase MCP. No database connection or SQL execution was attempted. Use MCP list_migrations and apply_migration after confirming the project.",
  );
  process.exit(1);
}
console.log(
  "Local migration files (plan only; consult applied.json and live MCP history before applying):",
);
for (const name of names) {
  const sql = await readFile(
    new URL(`../db/migrations/${name}`, import.meta.url),
    "utf8",
  );
  console.log(
    `${name}  sha256:${createHash("sha256").update(sql).digest("hex")}`,
  );
}
console.log(
  "Raw generated/ artifacts are not a separate apply step. Database writes require the verified project-scoped Supabase MCP. No database connection was made.",
);
