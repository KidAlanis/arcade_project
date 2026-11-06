# Connected player-flow verification — 2026-11-06

MCP was restored after fresh OAuth. Both MCP and the local pg connection returned the same running database fingerprint for project jiaaqwdujaclbxulndjc. Before application, migrations were 001–003, no new feature tables existed, clothing IDs had no collisions, and there were no duplicate redemption ownership groups.

Applied via verified Supabase MCP only:
- 20261106130548 arcade_004_game_tickets
- 20261106130551 arcade_005_ticket_claims
- 20261106130554 arcade_006_clothing_and_avatars

Exact local SQL hashes are in db/migrations/applied.json. Do not reapply these migrations or edit their applied bytes. Previous pending/setup-blocker notes are historical and superseded by this report.

## Connected results

Two new Flow Test accounts were created using example.invalid email addresses. Both received 200 tickets; existing players were untouched. Parallel identical game-start requests charged one ticket (199). Parallel win settlement granted five once (204). Foreign-account settlement returned 404, conflicting result 409. This tests settlement protocol, not proof of a real win.

Parallel daily requests returned the same server-random award in the inclusive 10–50 range and only one wallet credit. A nonzero-wallet rescue returned 409; injected reward amount returned 400. After only the new test account A was administratively set to zero, repeated same-key concurrent rescue requests credited exactly 10; a further new-key claim was rejected. No other player's money was changed.

Two concurrent different-key purchases of top-pink charged only one catalog price (20) and created one ownership record. Equipping without ownership returned 403. Test A equipped top-pink, hair 2, skin 1; GET /api/player and a subsequent sign-out/sign-in recovered the same saved appearance. Test B remained at 200 with no purchased hoodie and default appearance.

Browser sign-in and /wardrobe showed test A's 10 tickets, four owned items, selected Strawberry Hoodie, selected hair 2/skin 1. A wallet React refresh cancellation issue found during this test was fixed by stabilizing the auth refetch dependency and allowing the replacement request after Strict Mode effect cleanup. Failed refreshes retain a one-minute backoff. Browser sign-out returned to the guest homepage and clears account state.

All test sessions were signed out; private local password/cookie fixtures were removed. Two test accounts and their ledger/history/avatar records remain; no pre-existing data was deleted/reset. Nine clothing items are now active in the actual catalog.

## Access and limitations

The new game-run, claim and avatar tables have RLS enabled and no anon/authenticated table privileges. The backend role bypasses RLS: Better Auth session-derived ownership predicates remain essential. Security advisor has no WARN/ERROR findings; 12 INFO rls_enabled_no_policy notices are expected for this deliberately backend-only design. https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

Local unit tests: 20 passed. Typecheck passed. Production build passed; the latest wallet UI fix is also checked before completion. Live tests did not simulate UTC rollover, transaction failure mid-commit or every game's full UI playthrough. Win reporting is client-controlled: paid-run ownership/timing/idempotency do not prevent a modified browser from falsely reporting a win. Server simulation/replay validation is still needed before treating tickets/prizes as cheat-resistant.
