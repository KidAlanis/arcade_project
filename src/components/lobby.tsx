"use client";
import Link from "next/link";
import { useTicketWallet } from "./ticket-wallet";
import { PixelAvatar, PixelIcon } from "./pixel-art";
import { DailyCheckIn, SectionHeading } from "./world-ui";
import { GameCards } from "./game-cards";
export function Lobby() {
  const { nickname, look, hair, skin, tickets } = useTicketWallet();
  return (
    <main>
      <div className="page-breadcrumb">
        <span>HOME / GAME LOBBY</span>
        <span>
          <i /> LET THE GOOD TIMES PLAY
        </span>
      </div>
      <div className="lobby-welcome">
        <div>
          <p className="eyebrow">WELCOME TO DREAMIO</p>
          <h1>
            {nickname
              ? `Hey ${nickname}, what shall we play?`
              : "Your happy place is loading."}
            <span>✦</span>
          </h1>
          <p>Pick a little game. Make an ordinary day a little more magical.</p>
        </div>
        <span className="cozy-badge">♥ GOOD MOOD ONLY</span>
      </div>
      <div className="lobby-top">
        <section className="lobby-scene">
          <div className="scene-art" />
          <div className="lobby-scene-copy">
            <span className="scene-label">✦ A LITTLE ESCAPE FROM EVERYDAY</span>
            <h2>
              Pause reality.
              <br />
              Play happy.
            </h2>
            <p>Your next little adventure starts right here.</p>
            <a href="#games" className="button purple-button">
              Find your next game <PixelIcon name="arrow" size={15} />
            </a>
          </div>
          <div className="lobby-avatar">
            <span className="speech-bubble">LET’S PLAY! ♡</span>
            <PixelAvatar look={look} hair={hair} skin={skin} />
          </div>
          <span className="scene-bottom">DREAMIO ARCADE / OPEN ALL DAY</span>
        </section>
        <DailyCheckIn />
      </div>
      <section className="games-section" id="games">
        <SectionHeading
          kicker="PICK YOUR NEXT LITTLE ADVENTURE"
          title="Little games. Big smiles."
        >
          <span className="small-note">
            3 playable demos · More little adventures on the way
          </span>
        </SectionHeading>
        <GameCards />
      </section>
      <section className="lobby-bottom">
        <Link href="/wardrobe" className="wardrobe-promo">
          <div className="promo-avatar">
            <PixelAvatar look={look} hair={hair} skin={skin} />
          </div>
          <div>
            <p className="eyebrow">YOUR PIXEL SELF</p>
            <h3>A new look. A fresh little mood.</h3>
            <p>The main character? Every version of you.</p>
          </div>
          <span className="promo-arrow">↗</span>
        </Link>
        <Link href="/shop" className="shop-promo">
          <span className="promo-bag">
            <PixelIcon name="bag" size={52} />
          </span>
          <div>
            <p className="eyebrow">LITTLE PIXEL FINDS</p>
            <h3>Little things to fall in love with.</h3>
            <p>
              Your little treasure: <b>{tickets}</b> pts
            </p>
          </div>
          <span className="promo-arrow">↗</span>
        </Link>
      </section>
    </main>
  );
}
