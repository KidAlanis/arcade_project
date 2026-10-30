# Accounts, tickets, and prizes

This adds Better Auth 1.7.14 to the existing Next.js App Router project. The home page and shared game registry are unchanged. Games remain Coming soon; the shop has no seeded prizes. Supabase is used only as Postgres through `pg`, not Supabase Auth or its browser SDK.

## Current setup status

The original public schema was empty. On 2026-10-30 the authenticated Supabase MCP and local pg connection were verified to reach the same arcade database (`jiaaqwdujaclbxulndjc`), then migrations 001–003 were applied through MCP only. The nine expected tables, their actual columns/constraints/indexes, RLS, and public-role privilege revocations were checked. Connected signup/signin/signout, isolated wallets/shelves, concurrent idempotent redemptions, stock limits and insufficient funds passed. See [MIGRATION_REVIEW.md](MIGRATION_REVIEW.md) for the full result and retained test fixtures. No further migration command is needed for this configured project.

Use Node.js **22.15+**. The TLS CA file is read through Node's runtime filesystem API to avoid Turbopack tracing an unknown path across the workspace and repeatedly refreshing pages. `next.config.ts` explicitly includes public CA files under `certs` for server deployment; an external CA path must also be made available in the deployment environment.
BETTER_AUTH_SECRET was generated locally with `openssl rand -base64 32`; existing nonempty values are preserved. Never commit or print `.env.local`. The connection/config checks only output categories, not driver messages, connection strings, passwords or secrets.

## Transaction pooler setup, then inspect before any migration

1. Copy the **Transaction pooler / URI** from the correct project's **Connect** panel into DATABASE_URL in `.env.local`. Use the exact provided host, pooler username and port (normally 6543), substitute the database password locally, and percent-encode reserved password characters. Do not paste the value into chat.
2. Keep BETTER_AUTH_URL pointed to the website origin (locally `http://localhost:3000`) and preserve the generated secret.
3. TLS is now always enabled with `rejectUnauthorized: true` and hostname verification. If the server chain is not trusted, download the project's server root certificate from **Database Settings → SSL configuration**. The supplied file is `certs/prod-ca-2021.crt`; set DATABASE_SSL_CA_FILE in `.env.local` to its local path. The directory README explains this. Do not disable verification to work around a failure.
4. The shared configuration parser strips no security protections: it parses URI fields itself so `pg` cannot overwrite verified TLS using URI SSL parameters. `sslmode=require` is strengthened to verified TLS; insecure SSL modes and session startup options are rejected. An optional `sslrootcert` path is supported, with DATABASE_SSL_CA_FILE taking precedence. No changes to the actual connection string are made by the app.
5. The runtime pool defaults to **1 connection per process/warm instance**. DATABASE_POOL_MAX can set an integer from 1 to 10 if measured concurrency requires it. Supabase's transaction pooler and the app-side `pg.Pool` are different layers; using a pooler does not remove the need to limit app connections.
6. There are no named prepared statements. The app and installed Kysely driver use parameterized `query(sql, values)` calls, which remain safe and compatible. SQL is awaited sequentially; queries are not pipelined.
7. Application table names are qualified with `public.`. Better Auth uses the documented PostgresDialect with the **same shared pg Pool** and `schemaName: "public"`. No connection startup search_path or statement_timeout is used. App transactions set `SET LOCAL statement_timeout` and `lock_timeout` after BEGIN on the same checked-out client. These settings end with that transaction. Standalone Better Auth queries use the server's timeout defaults; they do not inherit transaction-local settings from application requests.
8. After configuring the trusted CA file, run:

   ```sh
   npm run db:inspect
   ```

   This verifies TLS, begins a READ ONLY transaction, and reports public table names plus related column/constraint metadata. It does not read player records, execute the auth library, run migrations, seed data, or print credentials. A failed TLS handshake cannot verify the password or schema. Review existing user/wallet/prize tables before deciding whether the prepared schema should be adapted to reuse them.

9. Migrations `001_better_auth.sql`, `002_player_data.sql`, and `003_private_trigger_permissions.sql` are already applied to this project. Match any future changes to the live MCP migration history; `db/migrations/applied.json` records the verified versions/checksums. `npm run db:migrate` lists local files only and rejects `--apply`.
10. All future schema application must use the verified Supabase MCP after checking the project and existing schema. Do not use pg, CLI migrate, or SQL Editor as an unannounced fallback, and do not reapply these migrations.
11. The official Better Auth CLI (1.7.14) generated `db/migrations/generated/001_better_auth.sql` through the READ ONLY CLI configuration in `scripts/auth-schema.config.ts`. Runtime and generation share `authConfiguration()`. The secured root `001_better_auth.sql` contains that exact artifact plus RLS and integrity hardening; **do not apply the raw artifact separately**.
12. Restart this project's dev server after environment changes. Schema changes are never automatic at runtime.

All nine tables have RLS enabled, no browser access policies, and no table privileges for `anon`, `authenticated`, or PUBLIC. The wallet trigger also denies public/browser execution. The checked backend database role has **BYPASSRLS=true**, **superuser=false**: RLS does not restrict it. Verified Better Auth sessions and user-scoped server queries are essential for player ownership. Supabase JWT/`auth.uid()` is not used for Better Auth identities. Never put DATABASE_URL in a `NEXT_PUBLIC_` variable. Security advisor reports nine informational `rls_enabled_no_policy` entries, intentionally retained for this private backend-only design, with no warnings/errors at verification time.

The runtime never creates tables or automatically migrates. Unconfigured accounts return clear setup messages and 503 API responses. A configured URI is not proof of connectivity; TLS or missing-schema failures remain sanitized. When configured but disconnected or missing schema, errors are sanitized. Do not interpret a successful build or `/api/auth/ok` as a working database login.

## Shared files and routes

| Piece                                         | Location                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| Better Auth instance (lazy, server-only)      | `src/lib/auth.ts`                                                                      |
| Versioned auth schema options                 | `src/lib/server/auth-options.ts`                                                       |
| Shared Postgres Pool                          | `src/lib/server/db.ts`                                                                 |
| Better Auth handler                           | `src/app/api/auth/[...all]/route.ts`                                                   |
| Browser auth client                           | `src/lib/auth-client.ts`                                                               |
| Sign in/up UI                                 | `src/components/auth-form.tsx`, `src/app/sign-in/page.tsx`, `src/app/sign-up/page.tsx` |
| Server session checks                         | `src/lib/server/session.ts`                                                            |
| Shared wallet and shelf provider              | `src/components/ticket-wallet.tsx`                                                     |
| Authenticated wallet/award/redemption helpers | `src/lib/server/player-data.ts`                                                        |
| Server game reward allowlist                  | `src/lib/server/game-rewards.ts`                                                       |
| Input contracts and validation                | `src/lib/player-contract.ts`, `src/lib/player-validation.ts`                           |
| Header, name, balance, sign out               | `src/components/header.tsx`                                                            |
| Shop and own shelf                            | `/shop`, `/shelf`                                                                      |

Guests can browse `/` and the home game list. Game pages, the shop, and the shelf perform a real server session check. With a configured database, guests redirect to sign-in with a restricted local return path. There is no proxy-only authorization. Every player-data API request goes through helpers that independently obtain the user ID from Better Auth's verified session. If a teammate creates a dedicated game route or server action, it must also call the server guard; a layout or hidden button alone is insufficient.

## One wallet interface for all teammates

The former `addTickets(amount)` / `spendTickets(amount)` client methods were intentionally replaced; they accepted arbitrary amounts. No current games use them. There is one authoritative wallet in Postgres and one shared client provider. The existing pure arithmetic helper in `src/lib/wallet.ts` remains a validation utility, not a second store.

```tsx
"use client";
import { useTicketWallet } from "@/components/ticket-wallet";

// Inside a component:
const {
  user,
  tickets,
  status,
  pending,
  error,
  shelf,
  refresh,
  earnTickets,
  redeemPrize,
} = useTicketWallet();
// tickets is null while loading, signed out, or unavailable — never assume zero.
// Await these only from events/game completion handlers; show readable errors.
await earnTickets(serverVerifiedResultId);

const requestId = crypto.randomUUID();
await redeemPrize(prizeId, requestId);
// If the response is lost, retry THIS logical purchase with the SAME requestId.
```

- `GET /api/player` returns the current verified user's name, balance, and shelf. It accepts no user ID. Responses are private and no-store.
- `POST /api/player/rewards` accepts only `{ resultId }`. The result must already exist, belong to this session's user, and have been validated by trusted server game logic. The amount comes from the server policy. A result can be claimed once.
- `POST /api/player/redemptions` accepts only `{ prizeId, requestId }` (v4 UUID). Extra fields such as `userId`, `amount`, `price`, and `balance` are rejected. The server reads current price, active status, balance, and stock.
- Custom mutation APIs require same-origin JSON POSTs. Better Auth handles its own cookie and origin protections.
- Each transaction uses one checked-out `pg` client. Wallet and prize row locks serialize spending and stock changes. Wallet deduction, optional stock decrement, and the immutable redemption snapshot commit together. Database constraints enforce nonnegative balances/stock and a unique `(user_id, request_id)`.
- A repeated same-user request with the same key and prize returns the existing redemption without another deduction. Reusing the key for another prize returns 409. Retries after an ambiguous failure must keep the key. The shop keeps its in-flight key until success; a reload starts a new UI interaction, so verify the shelf before deliberately buying again if a previous response was lost.
- The provider refreshes after a mutation, on focus, periodically while visible, and on cross-tab wallet notifications. Auth identity changes remount account-scoped state, stale requests are ignored, and sign-out clears the snapshot immediately. Successful sign-in/up/out makes a fresh page navigation. No localStorage balance or guest import is used.

## Integrating a real game later

All three reward policies are **disabled** because the repository has no playable game or trusted score validator yet. There is no public endpoint that creates `arcade_game_results` or grants tickets for a browser-submitted score. This intentionally prevents a forged result or repeated button click from minting tickets.

For each future game:

1. Guard its page, APIs, and any server actions with `requirePlayer()`/`pageAccess()`. Never accept ownership from the browser.
2. Build trusted run tracking and server validation suitable for the game. Generate a server run UUID, bind it to the verified user, and enforce completion, replay, timing and score rules. A client-reported score or elapsed-time check alone is not proof of play.
3. After successful server validation, record one result in `arcade_game_results` with that session user's ID, a unique server run ID, the allowlisted game slug, outcome, and `verified_at`. Do not expose an unrestricted insert endpoint or an exported server action that merely trusts the submitted outcome.
4. Only then enable the corresponding policy in `game-rewards.ts` and choose its server-owned reward. The current proposed win amount is 10 tickets; it is not awarded while disabled. Use the shared `earnTickets(resultId)` claim path so all games update the same wallet and header.

Stronger anti-cheat cannot be verified or implemented against nonexistent games. A future fully client-side game still needs a deliberate server validation design; auth alone does not make its scores trustworthy.

The shop remains empty until a teammate adds reviewed catalog data through a trusted server/admin process. No catalog editor, test prizes, or stock seeding is included in these migrations.

## Verification

Locally runnable without a database:

```sh
npm test
npm run typecheck
npm run build
npm run db:migrate  # plan only; no connection or DDL
```

Tests cover amount/overflow safety, strict request inputs, safe sign-in redirects, disabled reward policies, and the offline Better Auth schema contract. With DATABASE_URL empty, public pages still render, setup pages explain the missing connection, and player/auth APIs return a setup error. These offline checks are separate from the connected integration checks recorded in the migration report.

The migration report records connected checks already completed. Remaining broader regression checks include the following (do not assume every item below was tested):

- Register player A: one wallet at 0; sign out/in and reload; balance stays persisted.
- Player B cannot read A's shelf or claim A's result. No API allows choosing a user ID.
- Signed-out protected pages redirect and protected APIs return 401.
- Wrong password/duplicate account errors remain readable; no SQL or credentials appear.
- Add a reviewed test prize in a controlled environment. Verify insufficient funds, stock exhaustion, simultaneous last-stock redemptions, and parallel spending cannot overspend.
- Send the same redemption key twice/concurrently: one deduction, one redemption, one stock update. Different prize with the same key: 409.
- Inject a transaction failure in a controlled test: wallet, redemption, and stock all roll back.
- Only after implementing a real game validator: claimed results cannot be replayed, awarded amounts follow server policy, and another user's result is rejected.
- Switch accounts and sign out across tabs: old balances and shelves disappear and the header reflects the active account.

References read during implementation: [Better Auth Next.js](https://better-auth.com/docs/integrations/next), [PostgreSQL adapter](https://better-auth.com/docs/adapters/postgresql), [email/password](https://better-auth.com/docs/authentication/email-password), [database/core schema](https://better-auth.com/docs/concepts/database), [node-postgres transactions](https://node-postgres.com/features/transactions), [Supabase connections](https://supabase.com/docs/guides/database/connecting-to-postgres).

## Integration with latest main (PR merge)

Main now includes Dreamio, Pixel Bath and Clawpop. Their game source is preserved and dedicated game pages require sign-in. The shared wallet is still server-authoritative. A compatibility adapter keeps the new UI compiling but deliberately rejects legacy arbitrary add/spend, daily rewards, score rewards and client-only purchases. Legacy wardrobe equip/appearance currently return defaults/no-op; durable cosmetics and validated game rewards need follow-up integration. The shop route uses the secure Postgres catalog. No legacy localStorage balance is imported. Earlier connected tests predate this merge; the merged tree passes 17 tests and production build but requires browser regression testing of the new Dreamio UI.
