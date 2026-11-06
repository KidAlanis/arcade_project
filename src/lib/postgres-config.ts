// Configuration only: used by server-only db.ts and local CLI scripts.
// Never log the returned object or pass it to browser code.
// Obtain the Node fs API at runtime so Turbopack does not trace an unknown
// certificate path as the whole workspace (including its own build outputs).
const { readFileSync } = process.getBuiltinModule("fs");
import type { PoolConfig } from "pg";

type Environment = Record<string, string | undefined>;
export function postgresConfig(
  env: Environment,
  purpose: "runtime" | "inspection" | "migration" = "runtime",
): PoolConfig {
  const raw = (
    purpose === "migration" ? env.MIGRATION_DATABASE_URL : env.DATABASE_URL
  )?.trim();
  if (!raw)
    throw new Error(
      purpose === "migration"
        ? "MIGRATION_DATABASE_URL is missing. Configure a separate direct migration connection after reviewing the SQL."
        : "DATABASE_URL is missing.",
    );
  try {
    const url = new URL(raw);
    const user = decodeURIComponent(url.username);
    const password = decodeURIComponent(url.password);
    const database = decodeURIComponent(url.pathname.slice(1));
    const port = url.port ? Number(url.port) : 5432;
    if (
      !["postgres:", "postgresql:"].includes(url.protocol) ||
      !url.hostname ||
      !user ||
      !password ||
      !database ||
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535 ||
      url.hash
    )
      throw new Error();
    // pg lets URI SSL parameters overwrite its ssl object. Parse fields ourselves
    // and always use verified TLS, even if the URI merely requests sslmode=require.
    for (const key of url.searchParams.keys()) {
      if (!["sslmode", "sslrootcert"].includes(key)) throw new Error();
    }
    const sslmode = url.searchParams.get("sslmode");
    if (sslmode && !["require", "verify-ca", "verify-full"].includes(sslmode))
      throw new Error();
    // No startup/session SQL through PGOPTIONS, and no reliance on search_path.
    if (env.PGOPTIONS?.trim()) throw new Error();
    if (
      purpose === "migration" &&
      (url.hostname.endsWith(".pooler.supabase.com") || port === 6543)
    )
      throw new Error();
    const max =
      purpose === "runtime" ? Number(env.DATABASE_POOL_MAX || "1") : 1;
    if (!Number.isInteger(max) || max < 1 || max > 10) throw new Error();
    const caPath =
      env.DATABASE_SSL_CA_FILE?.trim() || url.searchParams.get("sslrootcert");
    const ca = caPath ? readFileSync(caPath, "utf8") : undefined;
    return {
      host: url.hostname.replace(/^\[|\]$/g, ""),
      port,
      user,
      password,
      database,
      ssl: { rejectUnauthorized: true, ...(ca ? { ca } : {}) },
      max,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      keepAlive: true,
      // No connectionString override, statement_timeout, options, or named queries.
    };
  } catch {
    throw new Error(
      purpose === "migration"
        ? "Migration configuration is invalid. Use a separate direct URI, valid TLS certificate settings, and no session startup options."
        : "Postgres configuration is invalid. Check the URI, password encoding, verified TLS settings, and pool size locally. Session startup options and insecure TLS modes are not accepted.",
    );
  }
}

// Error text from pg can contain endpoints or credentials. Only classify known codes.
export function databaseFailureHint(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
  if (["28P01", "28000"].includes(code))
    return "Database authentication failed. Check the database password and pooler username locally.";
  if (
    [
      "ENOTFOUND",
      "EAI_AGAIN",
      "ENETUNREACH",
      "ECONNREFUSED",
      "ETIMEDOUT",
    ].includes(code)
  )
    return "The database endpoint could not be reached. Check project availability, network access, and the selected connection mode.";
  if (
    [
      "SELF_SIGNED_CERT_IN_CHAIN",
      "DEPTH_ZERO_SELF_SIGNED_CERT",
      "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
      "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
      "ERR_TLS_CERT_ALTNAME_INVALID",
      "CERT_HAS_EXPIRED",
    ].includes(code)
  )
    return "TLS certificate verification failed. Configure the appropriate trusted CA certificate; certificate verification has not been disabled.";
  return "Database inspection failed. Check connection settings, TLS trust, project availability, and permissions locally; raw error details are hidden.";
}
