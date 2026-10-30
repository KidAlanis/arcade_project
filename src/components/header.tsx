"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useTicketWallet } from "./ticket-wallet";

export function Header() {
  const { tickets, user, status, clearAccount, refresh, error } =
    useTicketWallet();
  const path = usePathname();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  async function signOut() {
    setSigningOut(true);
    setSignOutError(null);
    clearAccount();
    try {
      const result = await authClient.signOut();
      if (result.error)
        throw new Error("Unable to sign out. Please try again.");
      window.location.assign("/");
    } catch {
      setSignOutError("Unable to sign out. Please try again.");
      setSigningOut(false);
      await refresh();
    }
  }
  return (
    <>
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
          <Link
            href="/shop"
            aria-current={path === "/shop" ? "page" : undefined}
          >
            Prize shop ↗
          </Link>
          {user ? (
            <Link
              href="/shelf"
              aria-current={path === "/shelf" ? "page" : undefined}
            >
              My shelf
            </Link>
          ) : null}
        </nav>
        <div className="header-player">
          <div
            className="wallet"
            aria-label={
              tickets === null
                ? "Ticket wallet unavailable until signed in"
                : `${tickets} tickets`
            }
          >
            <span aria-hidden="true">▤</span>
            <span>
              <strong aria-live="polite" aria-atomic="true">
                {tickets === null ? "—" : tickets.toLocaleString()}
              </strong>{" "}
              <span className="wallet-label">TICKETS</span>
            </span>
          </div>
          <div className="account-controls">
            {signingOut ? (
              <span role="status">Signing out…</span>
            ) : status === "loading" ? (
              <span role="status">Loading player…</span>
            ) : user ? (
              <>
                <span className="player-name" title={user.name}>
                  {user.name}
                </span>
                <button className="text-button" onClick={signOut}>
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/sign-in">Sign in / Join</Link>
            )}
          </div>
        </div>
      </header>
      {signOutError ? (
        <p className="header-notice" role="alert">
          {signOutError}
        </p>
      ) : error ? (
        <p className="header-notice" role="status">
          {error}
        </p>
      ) : null}
    </>
  );
}
