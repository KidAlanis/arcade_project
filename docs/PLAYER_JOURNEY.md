> **Current status (2026-11-06):** migrations 004–006 are applied and connected player-flow tests passed. Earlier pending/blocker notes below are historical. See [verified results](PLAYER_FLOW_VERIFIED.md). Game win validation remains a known limitation.

# Player journey — implementation pending database setup

Login → claim tickets → pay 1 ticket per round → win adds 5 tickets → redeem clothing in /shop → equip owned items in /wardrobe. The guest homepage leads to Better Auth sign-in/sign-up; the lobby stays browsable. Header provides daily check-in, zero-balance refill, wardrobe and account links.

The original shared Postgres wallet remains authoritative. Clothing prices/stock come from arcade_prizes; arcade_redemptions doubles as the clothing ownership history. Owned clothing cannot be charged again, even with a new request key. A partial unique index protects clothing uniqueness. Free starter clothes need no purchase. Avatar look/hair/skin are stored in private arcade_avatars, one row per Better Auth text user id. Every server mutation derives ownership from the verified session; equipping unowned clothing is rejected. All avatar changes refresh the existing shared provider and clear on identity changes. No signed-in money/ownership/appearance is sourced from localStorage.

## Database status and errors

A read-only verified-TLS inspection on 2026-11-06 succeeded. arcade_game_runs and arcade_ticket_claims are absent. Thus migrations 004 and 005 remain pending; their feature requests cannot work until applied. This does not establish the cause of every failed query shown in the Supabase dashboard. The Supabase MCP is still not exposed in this chat after restart, so neither live Postgres logs nor the advisor are accessible via that tool. No database migrations were applied through an alternate method.

Missing feature tables are now checked using to_regclass before querying them, returning an explicit setup error instead of issuing invalid table queries. Wallet refreshes are deduplicated, with a 60-second backoff after failure. This reduces retries; it does not claim that every historical dashboard error is resolved.

## Pending migrations

- 004_game_tickets.sql: new-wallet default 200, paid game-run state.
- 005_ticket_claims.sql: idempotent free-ticket/daily claim ledger.
- 006_clothing_and_avatars.sql: avatar persistence and clothing catalog in the existing prize table, plus one-clothing-per-player uniqueness.

Before applying through restored project-verified Supabase MCP, inspect existing schema and live migration history again, check for any existing prize IDs matching the catalog and duplicate clothing redemptions, and adapt rather than overwriting. 006 uses ON CONFLICT DO NOTHING for catalog seeds and does not replace existing prize data. RLS and browser/public privilege revocations cover new tables; backend BYPASSRLS still requires all session/ownership checks. No account, wallet, redemption or avatar was deleted/reset during this implementation.

After application, verify signup=200, paid start=199, win=204, failed/replayed games, daily uniqueness, refill only at zero, concurrent purchase/retry charges once, cross-account ownership isolation, equip/appearance persist after reload/sign-out, and security advisor. Game outcomes are still client-reported: paid-run and replay checks do not prove a win; server game simulation/replay validation remains necessary against cheating. The standalone static game demo has no wallet privileges.

Local unit tests/build do not verify this connected journey. Until 004–006 are applied and connected tests pass, these features are not ready to merge or announce as working.
