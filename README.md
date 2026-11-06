> **Current status (2026-11-06):** migrations 004–006 are applied and connected player-flow tests passed. Earlier pending/blocker notes below are historical. See [verified results](docs/PLAYER_FLOW_VERIFIED.md). Game win validation remains a known limitation.

# Dreamio

A collaborative pixel-art Next.js arcade with a cinematic castle journey, two-character fitting room, shared game registry, Better Auth accounts, one Postgres ticket wallet per player, and a clothing shop/prize shelf. Main's Pixel Bath, Clawpop and connected player features are preserved.

```sh
npm install
npm run dev
```

Requires Node.js 22.15 or newer. Open http://localhost:3000. Run `npm test`, `npm run typecheck`, and `npm run build` for local checks.

## Castle journey and fitting room

- `/` — borderless Dreamio title screen. PRESS START opens `/welcome`; direct wardrobe and account links remain available.
- `/welcome` — a paused day/night castle video scrubbed through a visible slider or a horizontal sky drag. Name, optional gender and time of day are cosmetic browser preferences; saving them opens `/intro` and does not create an account or change tickets.
- `/intro` — three 2672×1792 HD castle shots at 1.2× speed. Click the scene or press Space to start/advance; another action while playing skips ahead. Natural shot endings hold until the next action. The last shot stays on its final interior frame while overlays fade out over 1.8 seconds.
- The final scene's right-hand curtain-and-clothes room keeps its original side perspective. Hover/focus adds a subtle gold halo and enlargement; click/Enter opens the protected `/wardrobe` route. See [map assets](public/art/map/README.md) and [video source matching](public/video/README.md).
- `/wardrobe` — full-screen blue pixel interface, left category rail, night-street stage and right portrait/style/item panels. SWITCH CHARACTER changes between **Midnight Wings** and **Leather & Lace**, keeping each outfit.
- Midnight Wings has dress colors and optional wings, tights, cat ears and cuffs. Leather & Lace has optional jacket, bag, headband and earrings, three lace dress colors and matching black boots. Both use coherent full-body sprites with no independently stretched legs.

The shared wallet from main remains server-authoritative. Onboarding preferences use `dreamio-setup-profile-v1`; only cosmetic fields are migrated from the legacy browser profile, never balances, ownership or account identity. The two photo-character outfits remain local styling previews under `dreamio-photo-character-v1` and `dreamio-street-character-v1`, separate from main's server-saved shop avatar. Arbitrary purchased items are not automatically fitted to these detailed characters.

Photo Studio is a local in-memory file preview. It does not upload images or automatically generate a character. Original personal photographs are not included in the site. Generated sprites, prompts, registered item exports and screenshots are included; see [Midnight Wings](public/art/character/README.md), [Leather & Lace](public/art/character/STREET-CHARACTER.md) and the [transcribed generation brief](docs/avatar-generation-prompt.zh-CN.md). Run `node --import tsx scripts/export-street-character.ts` to recreate the six transparent item cutouts.

### Manual checks

1. Open `/` → PRESS START. Drag the sky in both directions and use the slider/keyboard to test day, midpoint and night; the video must stay paused and never loop.
2. Enter a name, choose an optional gender, and begin. Click/Space through the three shots; verify natural endings hold and the last frame remains after the text fades.
3. Hover/focus the right-hand fitting-room entrance and open it. Existing authentication requirements still apply; use a configured account to test the protected wardrobe.
4. Change an outfit, use SWITCH CHARACTER twice, then reload. Confirm both characters keep their own choices. Check the jacket/accessory switches and dress colors without skin/boot tinting or broken leg proportions.
5. Preview a JPG/PNG/WebP in Photo Studio, then remove/close it. Confirm this does not imply a server upload or generation.
6. With the configured account, regression-test the existing game lobby, shop, wallet and sign-out. Do not reapply already-applied migrations. Offline checks do not establish database connectivity or validate live purchases.

## Database and authentication setup

Read [AUTH_AND_PLAYER_DATA.md](docs/AUTH_AND_PLAYER_DATA.md) for the environment setup, schema inspection, reviewed migration commands, wallet API, and teammate integration instructions.

Put credentials in ignored `.env.local` using `.env.example` as a reference. Generate BETTER_AUTH_SECRET with `openssl rand -base64 32`. Keep DATABASE_URL server-only. The runtime now supports the Supabase transaction pooler with verified TLS and a default one-connection pool; configure DATABASE_SSL_CA_FILE with the Supabase server root certificate if needed. With no database connection, the home page works and account features show an explicit setup message.

**Database setup is applied and verified (2026-10-30).** The authenticated `supabase-arcade` MCP targets project `jiaaqwdujaclbxulndjc`, verified against the local pg connection. Three migrations created the nine private auth/player tables and tightened trigger permissions. No original data was reset or deleted. `npm run db:migrate` remains plan-only; do not reapply existing migrations. Live migration versions and local checksums are recorded in `db/migrations/applied.json`.

See [migration verification report](docs/MIGRATION_REVIEW.md) for actual schema/RLS, integration tests, retained test fixtures, and remaining game-validation limitations. All placeholder game rewards remain disabled; the shop currently has no active prizes.

## Shared pieces

- `src/lib/games.ts` — shared game registry; keep game slugs stable.
- `src/app/page.tsx` — public arcade floor and game list.
- `src/app/games/[slug]/page.tsx` — protected Coming soon game pages; unknown slugs return 404. Dedicated game pages added by teammates must also check the session on the server.
- `src/lib/auth.ts` and `src/lib/server/db.ts` — server auth and shared `pg.Pool`.
- `src/app/api/auth/[...all]/route.ts` — Better Auth handler.
- `src/components/ticket-wallet.tsx` — the shared `useTicketWallet()` hook. Uses authenticated APIs; no client-authoritative balance.
- `src/lib/server/player-data.ts` — session-checked wallet, reward, and atomic redemption helpers.
- `src/lib/server/game-rewards.ts` — server reward rules, currently disabled until real game validation exists.
- `src/components/header.tsx` — player name, live balance, sign in/out.
- `src/app/shop/page.tsx` and `src/app/shelf/page.tsx` — protected catalog and personal prizes.
- `src/app/globals.css` — existing dark/neon design and account styles.

Client integration uses `earnTickets(serverVerifiedResultId)` and `redeemPrize(prizeId, requestId)`; arbitrary `addTickets(amount)` / `spendTickets(amount)` are no longer available. See the full guide before adding a game's reward endpoint.

## Integration with latest main (PR merge)

Main now includes Dreamio, Pixel Bath and Clawpop. Their game source is preserved and dedicated game pages require sign-in. The shared wallet is still server-authoritative. A compatibility adapter keeps the new UI compiling but deliberately rejects legacy arbitrary add/spend, daily rewards, score rewards and client-only purchases. Legacy wardrobe equip/appearance currently return defaults/no-op; durable cosmetics and validated game rewards need follow-up integration. The shop route uses the secure Postgres catalog. No legacy localStorage balance is imported. Earlier connected tests predate this merge; the merged tree passes 17 tests and production build but requires browser regression testing of the new Dreamio UI.

## Game ticket update (pending migration 004)

New signup 200 / paid round 1 / win +5. See [game-ticket implementation and setup status](docs/GAME_TICKETS.md). Existing balances remain unchanged; Supabase MCP is required to apply the pending migration. Browser-reported wins remain an anti-cheat limitation. This update supersedes the earlier disabled game integration notes after migration 004 is applied.
