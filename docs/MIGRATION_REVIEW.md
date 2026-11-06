# Arcade database verification — 2026-10-30

## Connected project and applied migrations

`supabase-arcade` authenticated successfully. Its project scope is `jiaaqwdujaclbxulndjc`. The local pg pooler project reference matches, and both connections returned the same fingerprint of the running database (database/OID/backend address/version/start time). No credentials were displayed. Before application, MCP showed no public tables and no migration history, so there were no equivalent application tables to reuse. Supabase-managed schemas were not modified.

Only these previously unapplied migrations were applied, all using MCP `apply_migration`:

| Version | Name | Purpose |
| --- | --- | --- |
| 20261030163804 | arcade_001_better_auth | Actual Better Auth CLI schema plus integrity, RLS and public privilege hardening |
| 20261030163809 | arcade_002_player_data | Wallets, prize catalog, redemptions, validated results, constraints/indexes and zero-wallet trigger |
| 20261030164026 | arcade_003_private_trigger_permissions | Revoke Supabase browser roles' default execute grants on the wallet trigger function |

`db/migrations/applied.json` records the applied versions and exact local SQL checksums. Do not edit or reapply these SQL files. The local `npm run db:migrate` is plan-only and rejects `--apply`; no pg/CLI/SQL Editor migration fallback was used. No boards/items, resets, drops, or deletion of pre-existing player data occurred.

## Official schema generation

The latest official CLI reported `auth` **1.7.14**, matching installed Better Auth. It ran:

```sh
npm exec --yes --package=auth@latest -- auth generate --config scripts/auth-schema.config.ts --output db/migrations/generated/001_better_auth.sql --yes
```

Generation shares the runtime `authConfiguration()` factory (model names, schema, email/password, database rate limiting, plugins). The generation pool wraps catalog inspection in READ ONLY transactions and rolls back on release. Generation wrote local SQL only. The exact generated artifact is included unchanged in the secured root migration; **the generated subdirectory is not another apply step**.

## Actual tables

All user foreign keys use **text**, matching Better Auth's actual user primary key. The complete live columns, nullability, defaults, constraints and indexes are recorded in [DATABASE_SCHEMA_VERIFIED.json](DATABASE_SCHEMA_VERIFIED.json); it contains schema metadata only.

| Table | Purpose and checked safeguards | RLS |
| --- | --- | --- |
| arcade_user | Better Auth player identity; text PK and unique email | Enabled |
| arcade_session | Cookie sessions/expiry; unique token, indexed user FK and expiry | Enabled |
| arcade_account | Credential account/password hash; user FK, unique provider/account pair | Enabled |
| arcade_verification | Verification records/expiration; identifier index | Enabled |
| arcade_rate_limit | Database-backed auth rate-limit counters | Enabled |
| arcade_wallets | One wallet per user PK/FK; zero default; nonnegative integer balance | Enabled |
| arcade_prizes | Server catalog; positive ticket price, optional nonnegative limited stock, inactive-by-default | Enabled |
| arcade_redemptions | Own shelf/history; paid price/name snapshot/time; unique (user_id, request_id), indexed user/time and prize FKs | Enabled |
| arcade_game_results | Future server-verified results; user FK, unique run, win/loss check, consistent one-time claim fields | Enabled |

Prize deletion is restricted while history references it. Remove a prize from sale with `active=false`; paid price/name snapshots remain after catalog edits.

## Access and advisor

Live checks confirmed all nine tables have RLS enabled, zero policies, and no table privileges for `anon`/`authenticated`. PUBLIC grants are revoked. The trigger function also denies execute to both browser roles (verified after migration 003). No `auth.uid()` assumptions or permissive public policies were added. Better Auth data stays behind the app server rather than Supabase's public Data API.

The local pg role is **BYPASSRLS=true, superuser=false**. RLS does **not** constrain that backend connection; verified Better Auth sessions and session-derived `user.id` predicates enforce player isolation in every server helper. A compromised backend credential would bypass this boundary, so it must remain server-only. A future restricted role requires deliberate SQL privileges and RLS design.

Final Supabase security advisor: **no WARN/ERROR findings**; **nine INFO `rls_enabled_no_policy` findings** (one per table). These reflect intentional deny-by-default Data API access. Do not add public policies just to remove them. [Official advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). No unrelated tables or project-wide settings were changed.

## Connected verification

The app's dev server was restarted to load local settings, and HTTP requests exercised the real Better Auth handler and pg-backed player helpers:

- Two new isolated test accounts signed up; each received exactly one zero-balance wallet and empty shelf.
- Sign out invalidated player access (401); wrong password was rejected; sign in restored the same persisted identity/wallet.
- A guest shelf request redirected to sign-in. Supplying another user ID in a read query did not change the session owner; ownership/price injection in mutations was rejected.
- Test-only wallets received 20 tickets each through MCP admin SQL, not a browser reward endpoint.
- Parallel same-key redemption requests produced one charge/history entry and the same redemption ID. The player balance became 13, with a paid-price snapshot of 7. Same key with a different prize returned 409.
- The other account could use its own key scope and could see only its own wallet/shelf. Stock exhaustion and insufficient funds returned 409 with unchanged balances/history. A negative-wallet update hit the database CHECK constraint and was rolled back.
- Changing the test prize's current price did not change prior paid-price snapshots; replaying the old request remained idempotent.
- Arbitrary browser reward amounts were rejected. Another player's result returned 404; an owned placeholder-game result returned GAME_NOT_READY as designed.
- Browser UI verified form sign-in, player name and persisted 13-ticket header, own shelf showing the 7-ticket redemption, and immediate guest state after sign-out. A dev reload loop caused by dynamic certificate-file tracing was corrected; the form/navigation then completed normally with Turbopack.

Local checks: **13 tests passed**, TypeScript passed as part of production build, and `npm run build` passed. The CA remains verified (`rejectUnauthorized: true`); Node 22.15+ runtime filesystem access avoids broad Turbopack tracing and `next.config.ts` explicitly includes public CA files for server packaging.

## Test fixtures and remaining limits

Two clearly named `Verification Player A/B` accounts (emails under `example.invalid`), their 13-ticket wallets, two redemption records, one game result and one **inactive** verification prize were retained. Temporary local test passwords/cookies were removed and test sessions signed out. No real catalog was seeded and no active prizes remain. Existing data was not deleted to clean up these tests.

All three games are still placeholders and their server reward policies are disabled. Positive game earning and anti-cheat cannot be verified until teammates implement trusted game-run validation; do not enable rewards from a browser-reported score alone. The positive redemption path was tested using controlled admin-funded wallets, not by claiming a real game win.

These checks did not simulate a database disconnect halfway through a committed purchase, injected failure after ticket deduction, a production multi-instance deployment, or multi-tab account switching. Transaction code uses one checked-out client, row locks, rollback, strict inputs and unique request IDs; broader failure-injection/load tests remain useful before launch. No claims of complete anti-cheat or production security certification are made.

## Integration with latest main (PR merge)

Main now includes Dreamio, Pixel Bath and Clawpop. Their game source is preserved and dedicated game pages require sign-in. The shared wallet is still server-authoritative. A compatibility adapter keeps the new UI compiling but deliberately rejects legacy arbitrary add/spend, daily rewards, score rewards and client-only purchases. Legacy wardrobe equip/appearance currently return defaults/no-op; durable cosmetics and validated game rewards need follow-up integration. The shop route uses the secure Postgres catalog. No legacy localStorage balance is imported. Earlier connected tests predate this merge; the merged tree passes 17 tests and production build but requires browser regression testing of the new Dreamio UI.
