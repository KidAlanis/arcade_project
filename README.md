# Dreamio

A cozy pixel browser arcade built with Next.js App Router. The site is in English and starts on a borderless, full-screen pixel-art title screen.

## Run locally

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Validate with `npm test`, `npm run typecheck`, and `npm run build`.

## Pages

- `/` — title screen; Press Start opens the dreamer setup page.
- `/welcome` — user-supplied day-to-night castle video, controlled by dragging horizontally across the sky or using the keyboard-accessible range slider. Video stays paused and never loops. Username, optional gender and selected time are saved with the local profile before continuing to the castle introduction. Guest access remains available.
- `/intro` — three HD castle shots, manually advanced by a scene click or Space. The first frame starts paused. Start a shot with one action; while it plays, another action fast-forwards to the next shot (or the final map). Natural endings hold until the next action. Nothing automatically advances between shots. Playback is 1.2×. The third shot finishes on the castle interior; all introduction overlays fade out over 1.8 seconds, leaving the world map.

All three intro clips use the supplied 2672×1792 HD versions (7183, 8472, 2597). Source matching and duplicate handling are recorded in [the video source guide](public/video/README.md).

After the introduction fades, the right-hand curtain-and-dresses room is selectable. The room overlay clips the actual decoded last video frame, retaining its original side perspective; hover or keyboard focus adds a soft gold halo, a subtle 1.015× enlargement and the small pixel-font Fitting Room label. No generated front-view room is used. Click or press Enter to open `/wardrobe`. The left library is not linked. The matching standalone source-pixel cutout is `public/art/map/fitting-room-original.svg`; narrow screens use this at the lower right. See [the map asset guide](public/art/map/README.md).
- `/lobby` — searchable game catalog, categories, daily check-in, and links to the closet and shop.
- `/games/game-1` — Cloud Memory, a 6-pair matching demo.
- `/games/game-2` — Star Collector, a 15-second collection demo.
- `/games/game-3` — Heartbeat Club, a reaction-time demo.
- `/wardrobe` — full-screen blue handheld-game dressing room with a compact left category rail, central night street and right portrait/style/outfit panels. SWITCH CHARACTER changes between Midnight Wings and Leather & Lace while retaining each outfit. Midnight Wings has dress colors and independent wings, fishnets, cat ears and cuffs; Leather & Lace has a removable jacket, bag, headband and earrings, three lace dress colors and matching knee-high boots. Both use coherent full-body sprites. Photo Studio previews new files locally.
- `/shop` — clothing and accessories purchased with earned Dream Points.

## Prototype boundaries

Nickname entry is a **local demo profile**, not authenticated sign-in. There are no passwords, accounts, database, server-side sessions, or cross-device synchronization. Nicknames, optional gender, selected daylight, points, inventory, outfits, check-in streaks, and game bests are stored under `dreamio-world-v1` in this browser's localStorage. Gender is a profile preference and does not automatically change the photo character. Signing out clears the nickname but retains this device's progress. Guest play is supported; earning rewards and buying items requires a local nickname.

The supplied castle time-lapse is served locally from `public/video/dreamio-day-night.mp4` (no external player). The visible slider runs from the first frame (day) to the final frame (night); the invisible sky gesture applies relative horizontal movement and supports reverse seeking. Test both endpoints, midpoints, rapid back-and-forth dragging and touch/keyboard controls; save a profile, confirm `/intro` opens, the first frame remains paused, click or press Space to advance each shot, and confirm natural endings hold without advancing. Test clicking/Space during playback to skip directly to the next shot, and clicking/Space after a natural ending to continue from the held frame. The final action leaves the castle interior still. Test pause/resume during playback, then confirm all overlays fade out at the end and the final interior frame remains still. Reopen `/welcome` and confirm the chosen profile values persist and earned points are unchanged.

Photo Studio opens from the portrait button or the bottom toolbar in the dressing room. Photo selection only previews the file in memory. It is not uploaded, persisted, or turned into an AI avatar. The page states that generation is not connected yet. Production photo-to-avatar generation needs a server endpoint, image-generation service, and private file storage. Do not place API secrets in client code.

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

`src/lib/dreamio.ts` holds catalog items, default appearance, check-in calculations, purchases, outfit changes, and storage validation. Logic tests are in `src/lib/dreamio.test.ts`. `src/components/pixel-art.tsx` holds code-native icons, shop clothing art, and the original arcade avatar used outside the dressing room. The dressing room uses the detailed raster character and compositor in `src/components/layered-character.tsx` with the registry in `src/lib/character.ts`.

The sky-city background is generated with the built-in imagegen tool. Its exact prompt and asset details are in [public/art/README.md](public/art/README.md).

The dressing-room redesign adds dress and bag outfit slots while keeping existing saved closets compatible. Equipping a top or bottoms switches back from a dress to separates. The dressing room now uses the generated photo character in place of the block avatar. Its included layers and dress color persist separately from shop inventory under `dreamio-photo-character-v1`; arbitrary shop outfits are not automatically fitted to this character. See [the layer guide](public/art/character/README.md). The user-supplied photo-to-avatar prompt was transcribed into [docs/avatar-generation-prompt.zh-CN.md](docs/avatar-generation-prompt.zh-CN.md); the supplied personal test photo is not part of the site assets.

Leather & Lace and the selected character persist under `dreamio-street-character-v1`, preserving the previous character's storage. See [its asset and testing guide](public/art/character/STREET-CHARACTER.md). Run `node --import tsx scripts/export-street-character.ts` to export six registered transparent item cutouts. In `/wardrobe`, test SWITCH CHARACTER in both directions, change each character's outfit, reload, and confirm the selection and both outfits remain saved. Original photos are not included in the website.
