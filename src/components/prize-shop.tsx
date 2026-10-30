"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Prize } from "@/lib/player-contract";
import { useTicketWallet } from "./ticket-wallet";

export function PrizeShop({ prizes }: { prizes: Prize[] }) {
  const router = useRouter();
  const { tickets, status, pending, redeemPrize } = useTicketWallet();
  const requests = useRef<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState(false);
  async function redeem(id: string) {
    requests.current[id] ??= crypto.randomUUID();
    setMessage(null);
    try {
      await redeemPrize(id, requests.current[id]);
      delete requests.current[id];
      setFailure(false);
      setMessage("Prize added to your shelf!");
    } catch (error) {
      // Keep the key after ambiguous network failures: Retry cannot spend twice.
      setFailure(true);
      setMessage(
        error instanceof Error ? error.message : "Unable to redeem this prize.",
      );
    } finally {
      router.refresh();
    }
  }
  return (
    <main className="player-page">
      <p className="eyebrow">THE PRIZE COUNTER</p>
      <h1>
        Prize shop<span className="pink">.</span>
      </h1>
      <p>
        Spend your hard-earned tickets. Every prize goes to your personal shelf.
      </p>
      {message ? (
        <p className="auth-message" role={failure ? "alert" : "status"}>
          {message}
        </p>
      ) : null}
      {prizes.length ? (
        <div className="prize-grid">
          {prizes.map((prize) => (
            <article className="prize-card" key={prize.id}>
              <h2>{prize.name}</h2>
              <p>{prize.description}</p>
              <p>
                {prize.price.toLocaleString()} tickets ·{" "}
                {prize.stock === null
                  ? "Unlimited stock"
                  : `${prize.stock} in stock`}
              </p>
              <button
                className="button"
                onClick={() => redeem(prize.id)}
                disabled={
                  pending ||
                  status !== "ready" ||
                  prize.stock === 0 ||
                  tickets === null ||
                  tickets < prize.price
                }
              >
                {pending
                  ? "PLEASE WAIT…"
                  : prize.stock === 0
                    ? "OUT OF STOCK"
                    : "REDEEM PRIZE"}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <section className="empty-shelf">
          <h2>Coming soon</h2>
          <p>
            The shelves are getting stocked. Check back for the first prizes.
          </p>
        </section>
      )}
      <Link className="outline-button" href="/shelf">
        VIEW MY PRIZE SHELF ↗
      </Link>
    </main>
  );
}
