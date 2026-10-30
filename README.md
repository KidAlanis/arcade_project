# Dreamio

A cozy pixel browser arcade built with Next.js App Router. The site is in English and starts on a borderless, full-screen pixel-art title screen.

## Run locally

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Validate with `npm test`, `npm run typecheck`, and `npm run build`.

## Pages

- `/` — title screen with nickname entry and guest access.
- `/lobby` — searchable game catalog, categories, daily check-in, and links to the closet and shop.
- `/games/game-1` — Cloud Memory, a 6-pair matching demo.
- `/games/game-2` — Star Collector, a 15-second collection demo.
- `/games/game-3` — Heartbeat Club, a reaction-time demo.
- `/wardrobe` — live pixel-avatar dressing room, hair and skin choices, owned clothing, and a local photo-preview area.
- `/shop` — clothing and accessories purchased with earned Dream Points.

## Prototype boundaries

Nickname entry is a **local demo profile**, not authenticated sign-in. There are no passwords, accounts, database, server-side sessions, or cross-device synchronization. Nicknames, points, inventory, outfits, check-in streaks, and game bests are stored under `dreamio-world-v1` in this browser's localStorage. Signing out clears the nickname but retains this device's progress. Guest play is supported; earning rewards and buying items requires a local nickname.

Photo selection only previews the file in memory. It is not uploaded, persisted, or turned into an AI avatar. The page states that generation is not connected yet. Production photo-to-avatar generation needs a server endpoint, image-generation service, and private file storage. Do not place API secrets in client code.

These points are prototype data and can be edited in browser storage. Production accounts and purchases must validate rewards and transactions on the server.

## Reward rules

- Daily check-in: 20 points, once per device-local calendar day.
- Every seventh consecutive check-in: an extra 50 points (70 that day).
- First successful completion of each game each day: 10 points.
- Replays can improve the personal best without granting the same day's reward again.
- Clothing is bought once and can be equipped without further cost.

## Working together

`src/lib/games.ts` is the shared game registry. Keep existing slugs stable. The three games are clearly labeled playable demos and can be replaced with the team's own games. A dedicated route such as `src/app/games/game-1/page.tsx` can replace its dynamic-route demo without changing its catalog URL. Add game-specific code in a separate component or directory.

`src/components/ticket-wallet.tsx` provides the shared context. Existing game integrations can continue using `useTicketWallet().addTickets()` and `.spendTickets()`. Use `.completeGame(slug, score)` to apply the once-daily demo-game reward and personal-best logic. Register new reward slugs in `src/lib/dreamio.ts` when introducing a new game.

`src/lib/dreamio.ts` holds catalog items, default appearance, check-in calculations, purchases, outfit changes, and storage validation. Logic tests are in `src/lib/dreamio.test.ts`. `src/components/pixel-art.tsx` holds code-native pixel icons, clothing art, and the customizable base avatar.

The sky-city background is generated with the built-in imagegen tool. Its exact prompt and asset details are in [public/art/README.md](public/art/README.md).
