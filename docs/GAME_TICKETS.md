> **Current status (2026-11-06):** migrations 004–006 are applied and connected player-flow tests passed. Earlier pending/blocker notes below are historical. See [verified results](PLAYER_FLOW_VERIFIED.md). Game win validation remains a known limitation.

# Game tickets — pending database migration

Rules: only newly registered accounts start with 200 tickets. Each paid round costs 1 ticket at start. A win adds 5 tickets (net +4); a loss/abandonment costs the entry ticket. Existing player balances are unchanged. A Pixel Bath level attempt is one round: reset or changing levels ends it without reward. Clawpop is one catch attempt. Stars and Reaction are one complete challenge each.

## Setup blocker

004_game_tickets.sql is PREPARED, NOT APPLIED. The Supabase MCP is unavailable in this chat. No DDL, migration, alternate pg migration execution, or player balance changes were performed. Verify project identity, existing schema and applied migration history through the restored MCP before applying 004. Never reapply 001–003. The new UI/API requires 004; until then starting a round reports a service/setup error and its transaction rolls back. Do not interpret a build as connected verification.

The migration changes the wallet column default to 200 (the existing signup trigger uses that default) and adds private arcade_game_runs with text user FK, supported-game check, complete outcome/timestamp check, user/time index and one-active-run-per-user uniqueness. RLS is enabled with no public policies and privileges revoked from PUBLIC/anon/authenticated. The server pg role bypasses RLS, so ownership still comes from the verified Better Auth session.

## Shared implementation

- src/lib/server/player-data.ts: gameTicketAction verifies the session, locks the wallet and owned run in one transaction, charges once, closes abandoned runs, and settles once. Winning updates and finishing the run commit atomically. Repeated same run/outcome returns success without more money; conflicting outcomes fail. The browser cannot choose amount, balance, price or user ID.
- POST /api/player/games accepts {action:"start", gameId, runId} or {action:"finish", runId, outcome:"win"|"loss"}. Round IDs are v4 UUID idempotency keys, retained for retries within the mounted UI. Unknown games and extra fields are rejected.
- src/components/game-ticket-gate.tsx gates game mounting behind successful payment, prevents double clicks, offers settlement retry, and refreshes the shared wallet/header. Leaving/reloading loses UI access to the paid round; a new entry costs another ticket. Opening another game abandons the player's previous unfinished round, preventing concurrent active rounds.
- Game-specific win/loss callbacks use useGameSettlement(); legacy addTickets and completeGame cannot issue money. The older verified-result rewards route stays disabled.

## Validation limitations

These existing games calculate outcomes in the browser. The server verifies ownership of a paid round, one-time processing, a minimum 0.5-second age, maximum 24-hour lifetime, allowed games/outcomes and fixed rewards. It DOES NOT prove a win: a modified client can falsely report win for a paid round and farm tickets. Timing is only a sanity check. Real anti-cheat needs server-owned game state/events or replay verification per game before competitive/valuable prizes. Standalone static HTML demos are not connected to the wallet.

19 local tests (including strict game request validation), TypeScript/production build passed. No connected tests of migration 004, signup 200, paid entry, concurrent settlement, persistence or rollback have run because MCP is unavailable. After applying 004, test new signup=200, start=199, win=204, loss=198 after another start, duplicates and conflicting outcomes, insufficient funds, cross-account reads/settlement, multi-tab abandonment, and header updates. Verify RLS/role ACL and rerun security advisor.

## Free tickets (migration 005 also pending)

Homepage TicketGifts provides a 10-ticket refill only when the server wallet balance is exactly zero. No daily refill limit: use up the balance and you can claim again. Concurrent claims serialize on the same wallet, so a zero balance cannot produce two refills. Daily check-in awards a cryptographically random integer from 10 through 50 inclusive, once per UTC calendar day (00:00 UTC reset), enforced by user/day uniqueness and the wallet lock. Lobby DailyCheckIn reuses the same component/API. No streak bonus applies.

POST /api/player/claims accepts only kind (daily/rescue) and UUID requestId; amount and ownership are server-selected. Claim ledger and wallet update commit atomically. Repeated request IDs return the original grant without another credit; daily repeats return the existing day's grant. Request IDs are retained after ambiguous errors. All account state is scoped to the shared provider identity; signed-out users cannot claim.

005_ticket_claims.sql creates a private, RLS-enabled claim ledger and revokes browser/public access. It has not been applied because Supabase MCP is unavailable. Connected tests of daily uniqueness, UTC rollover, random range, zero-only rescue and cross-account isolation remain pending. Do not run this through an alternate migration method.

## In-machine ticket controls

Clawpop now renders immediately without a separate entry screen. INSERT TICKET · 1 calls the same idempotent server start endpoint; movement/catching stay disabled until confirmation. The machine counter displays the actual wallet, not virtual credits or a capped 99 value. Results stay inside the machine, and each further catch requires another ticket. Other games preview their board with a styled ticket overlay, reset on a newly paid round, and unlock controls only after payment. No database or ticket-pricing changes accompany this UI update.
