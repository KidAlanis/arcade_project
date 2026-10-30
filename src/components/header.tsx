"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTicketWallet } from "./ticket-wallet";

export function Header() {
  const { tickets } = useTicketWallet();
  const path = usePathname();
  return (
    <header className="header">
      <Link href="/" className="brand" aria-label="Neon Quarter home">
        <span className="brand-mark" aria-hidden="true">
          NQ
        </span>
        <span>
          NEON<span className="brand-second">QUARTER</span>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/" aria-current={path === "/" ? "page" : undefined}>
          Arcade floor
        </Link>
        <Link href="/shop" aria-current={path === "/shop" ? "page" : undefined}>
          Prize shop <span aria-hidden="true">↗</span>
        </Link>
      </nav>
      <div className="wallet">
        <span aria-hidden="true">▤</span>
        <span>
          <strong aria-live="polite" aria-atomic="true">
            {tickets.toLocaleString()}
          </strong>{" "}
          <span className="wallet-label">TICKETS</span>
        </span>
      </div>
    </header>
  );
}
