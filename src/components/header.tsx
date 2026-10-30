"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTicketWallet } from "./ticket-wallet";
import { PixelAvatar, PixelIcon } from "./pixel-art";

export function Header() {
  const { tickets, nickname, look, hair, skin, logout, storageAvailable } =
    useTicketWallet();
  const path = usePathname();
  if (path === "/") return null;
  return (
    <>
      <div className="announcement">
        <span>✦ WELCOME TO YOUR LITTLE PIXEL WORLD ✦</span>
        <span>SMALL PIXELS. BIG HAPPY FEELINGS.</span>
      </div>
      <header className="header">
        <Link href="/" className="brand" aria-label="Dreamio home">
          <span className="brand-mark">
            <PixelIcon name="star" size={28} />
          </span>
          <span>
            dreamio<span className="brand-dot">✦</span>
            <small>PLAY A LITTLE. DREAM A LOT.</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          {[
            { href: "/lobby", title: "Game lobby", icon: "game" },
            { href: "/clawpop", title: "Clawpop ✦", icon: "star" },
            { href: "/wardrobe", title: "Dressing room", icon: "shirt" },
            { href: "/shop", title: "Pixel shop", icon: "bag" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={path === link.href ? "page" : undefined}
            >
              <PixelIcon name={link.icon} size={17} />
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/shop"
            className="wallet"
            aria-label={`My Dream Points ${tickets}`}
          >
            <PixelIcon name="coin" size={21} />
            <strong aria-live="polite">{tickets.toLocaleString()}</strong>
            <span>pts</span>
          </Link>
          {nickname ? (
            <details className="profile-menu">
              <summary>
                <span className="mini-avatar">
                  <PixelAvatar look={look} hair={hair} skin={skin} />
                </span>
                <span>{nickname}</span>
                <span className="chevron">⌄</span>
              </summary>
              <div>
                <Link href="/wardrobe">My pixel avatar</Link>
                <button onClick={logout}>Sign out of local demo</button>
              </div>
            </details>
          ) : (
            <Link className="login-link" href="/#login">
              Sign in <span>↗</span>
            </Link>
          )}
        </div>
      </header>
      {!storageAvailable && (
        <p className="storage-warning" role="status">
          Browser storage is unavailable. Progress may be lost when you close
          this page.
        </p>
      )}
    </>
  );
}
