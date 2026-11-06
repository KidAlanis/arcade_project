// Shared with the offline schema check; contains no credentials or database client.
import type { BetterAuthOptions } from "better-auth";
export const authOptions = {
  appName: "Neon Quarter",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  user: { modelName: "arcade_user" },
  session: {
    modelName: "arcade_session",
    cookieCache: { enabled: false },
  },
  account: { modelName: "arcade_account" },
  verification: { modelName: "arcade_verification" },
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "arcade_rate_limit",
  },
  // Keep database failures out of client responses and server logs containing credentials.
  logger: { disabled: true },
} satisfies BetterAuthOptions;
