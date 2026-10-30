import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TicketWalletProvider } from "@/components/ticket-wallet";
import "./globals.css";
export const metadata: Metadata = {
  title: "Dreamio · Your cozy pixel playground",
  description:
    "Play little games, collect Dream Points, and style your own pixel avatar. Play a little. Dream a lot.",
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
          <Footer />
        </TicketWalletProvider>
      </body>
    </html>
  );
}
