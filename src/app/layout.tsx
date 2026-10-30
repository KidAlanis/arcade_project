import type { Metadata } from "next";
import { Header } from "@/components/header";
import { TicketWalletProvider } from "@/components/ticket-wallet";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neon Quarter — Your neighborhood arcade",
  description:
    "A little friendly competition. A lot of neon. Play, earn tickets, and visit the prize shop.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <TicketWalletProvider>
          <Header />
          {children}
          <footer>
            <span>
              NEON QUARTER{" "}
              <span className="dim">© {new Date().getFullYear()}</span>
            </span>
            <span>GOOD GAMES. GREAT COMPANY.</span>
            <span className="footer-light">
              ● <span>ALL PLAYERS WELCOME</span>
            </span>
          </footer>
        </TicketWalletProvider>
      </body>
    </html>
  );
}
