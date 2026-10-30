"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <footer>
      <Link href="/" className="footer-brand">
        dreamio ✦
      </Link>
      <span>
        Small pixels. Big happy feelings.
        <small>MADE WITH LOVE & A LITTLE PIXEL MAGIC</small>
      </span>
      <span>
        © 2026 DREAMIO <span className="footer-heart">♥</span>
      </span>
    </footer>
  );
}
