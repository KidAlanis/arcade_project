# Neon Quarter

Shared Next.js App Router foundation. No games or prize purchases are implemented yet.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. `npm run build`, `npm run typecheck`, and `npm test` validate the foundation.

## Shared pieces

- `src/lib/games.ts` — the shared game registry. Change the placeholder names here; the home page and game routes use this list. Keep slugs stable.
- `src/app/page.tsx` — arcade floor and game cards.
- `src/app/games/[slug]/page.tsx` — shared Coming soon page for `/games/game-1`, `/games/game-2`, and `/games/game-3`; unknown slugs return 404. Teammates can add dedicated `src/app/games/game-1/page.tsx` (and so on) when implementing each game.
- `src/components/ticket-wallet.tsx` — shared provider and `useTicketWallet()` hook. Wraps the entire app once, so the balance survives Next.js link navigation. Starts at 0 and resets on a full refresh; no accounts, persistence, or backend yet.
- `src/lib/wallet.ts` — ticket validation and balance arithmetic. Only positive safe whole numbers are accepted. Failed transactions leave the balance unchanged; the balance cannot go negative or overflow.
- `src/components/header.tsx` — name, navigation, and live ticket count.
- `src/app/layout.tsx` — shared wallet provider, header, footer, and page metadata.
- `src/app/shop/page.tsx` — placeholder prize shop.
- `src/app/globals.css` — dark/neon theme, responsive cabinets, and fonts (Google Fonts with local fallbacks).

## Use the wallet in a game

```tsx
"use client";
import { useTicketWallet } from "@/components/ticket-wallet";

// Inside a component:
const { tickets, addTickets, spendTickets } = useTicketWallet();
addTickets(10); // true on success
const purchased = spendTickets(25); // false if insufficient or invalid
```

Call transactions from event handlers or game completion callbacks, never during rendering. These client-side tickets are a simple shared foundation, not secure currency for real purchases.
