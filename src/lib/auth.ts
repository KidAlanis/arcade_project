import "server-only";
import { betterAuth } from "better-auth";
import { getPool } from "./server/db";
import { PlayerError } from "./server/errors";
import { authConfiguration } from "./server/auth-configuration";

function createAuth() {
  return betterAuth(authConfiguration(getPool(), process.env));
}
let instance: ReturnType<typeof createAuth> | undefined;
export function authSetupMessage(): string | null {
  if (!process.env.DATABASE_URL?.trim())
    return "Player accounts are not connected yet. Set DATABASE_URL in .env.local and apply the reviewed database migrations.";
  if (
    !process.env.BETTER_AUTH_SECRET?.trim() ||
    process.env.BETTER_AUTH_SECRET.trim().length < 32
  )
    return "Authentication setup is incomplete. Configure a generated BETTER_AUTH_SECRET of at least 32 characters on the server.";
  if (!process.env.BETTER_AUTH_URL?.trim())
    return "Authentication setup is incomplete. Set BETTER_AUTH_URL to this website’s origin.";
  return null;
}
// Lazy initialization keeps public pages and builds working without a database.
export function getAuth() {
  const message = authSetupMessage();
  if (message) throw new PlayerError("SETUP_REQUIRED", message, 503);
  instance ??= createAuth();
  return instance;
}
