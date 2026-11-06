"use client";
import Link from "next/link";
import { useTicketWallet } from "./ticket-wallet";
import { Cloud, PixelAvatar } from "./pixel-art";

export function HomeWorld() {
  const { nickname, look, hair, skin } = useTicketWallet();
  return (
    <main className="landing-page landing-page-simple">
      <div className="landing-background" aria-hidden="true" />
      <div className="landing-scanlines" aria-hidden="true" />
      <Cloud className="landing-cloud cloud-left" />
      <Cloud className="landing-cloud cloud-right" />
      <span className="landing-spark landing-spark-one" aria-hidden="true">✦</span>
      <span className="landing-spark landing-spark-two" aria-hidden="true">✧</span>
      <span className="landing-spark landing-spark-three" aria-hidden="true">✦</span>
      <section className="landing-content" id="login">
        <h1 className="dreamio-title" aria-label="Dreamio">
          <span aria-hidden="true">DREAMIO</span>
        </h1>
        <p className="landing-tagline">Sign in to collect tickets, play games and unlock outfits.</p>
        <div className="landing-login returning-login">
          {nickname && <p className="landing-player">WELCOME BACK, <strong>{nickname}</strong></p>}
          <div className="landing-action-pair">
            <Link href="/lobby" className="landing-start">LET’S PLAY</Link>
            <Link href="/wardrobe" className="landing-start">VISIT MY DRESSING ROOM</Link>
          </div>
        </div>
      </section>
      <div className="landing-character">
        <PixelAvatar look={look} hair={hair} skin={skin} />
      </div>
    </main>
  );
}
