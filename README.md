# Neon Quarter

A collaborative Next.js arcade with a shared game registry, Better Auth email/password accounts, one Postgres ticket wallet per player, and a prize shop/shelf. Games remain Coming soon; no prizes are seeded.

```sh
npm install
npm run dev
```

Requires Node.js 22.15 or newer. Open http://localhost:3000. Run `npm test`, `npm run typecheck`, and `npm run build` for local checks.

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
