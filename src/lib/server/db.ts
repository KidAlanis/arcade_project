import "server-only";
import { Pool } from "pg";
import { PlayerError } from "./errors";
import { postgresConfig } from "@/lib/postgres-config";

const globalDb = globalThis as unknown as { arcadePool?: Pool };
export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new PlayerError(
      "SETUP_REQUIRED",
      "Player accounts are not connected yet. Set DATABASE_URL in .env.local and apply the reviewed database migrations.",
      503,
    );
  }
  if (!globalDb.arcadePool) {
    try {
      globalDb.arcadePool = new Pool(postgresConfig(process.env));
    } catch {
      throw new PlayerError(
        "DATABASE_CONFIG_INVALID",
        "Database configuration needs attention. Check the server connection URI, TLS certificate settings and pool size.",
        503,
      );
    }
    globalDb.arcadePool.on("error", () => {
      // Do not log connection strings or raw driver errors.
      console.error("The arcade database pool lost an idle connection.");
    });
  }
  return globalDb.arcadePool;
}
