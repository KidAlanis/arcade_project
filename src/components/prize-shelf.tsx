"use client";
import Link from "next/link";
import { useTicketWallet } from "./ticket-wallet";
export function PrizeShelf() {
  const { user, shelf, status, error } = useTicketWallet();
  return (
    <main className="player-page">
      <p className="eyebrow">YOUR COLLECTION</p>
      <h1>
        {user ? `${user.name}’s prize shelf` : "Prize shelf"}
        <span className="pink">.</span>
      </h1>
      {status === "loading" ? (
        <p role="status">Loading your prizes…</p>
      ) : status !== "ready" ? (
        <p role="status">{error || "Sign in to see your prize shelf."}</p>
      ) : shelf.length ? (
        <div className="prize-grid">
          {shelf.map((prize) => (
            <article className="prize-card" key={prize.id}>
              <h2>{prize.name}</h2>
              <p>{prize.price.toLocaleString()} tickets</p>
              <p>Redeemed {new Date(prize.redeemedAt).toLocaleDateString()}</p>
            </article>
          ))}
        </div>
      ) : (
        <section className="empty-shelf">
          <h2>Your first prize is waiting.</h2>
          <p>Play games, earn tickets, and redeem something you love.</p>
        </section>
      )}
      <Link className="button" href="/shop">
        VISIT THE PRIZE SHOP ↗
      </Link>
    </main>
  );
}
