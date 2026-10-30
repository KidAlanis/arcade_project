import Link from "next/link";
import { games } from "@/lib/games";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="eyebrow">
          <span className="status-dot" /> YOUR NEIGHBORHOOD, RELOADED
        </div>
        <p className="hero-kicker">STEP INSIDE THE</p>
        <h1>
          AFTER-HOURS
          <br />
          <span>ARCADE.</span>
        </h1>
        <p className="hero-copy">
          Big pixels. Friendly rivalries. A pocket full of tickets.
          <br />
          Your next favorite hangout is powering up.
        </p>
        <div className="hero-bottom">
          <a className="button" href="#games">
            EXPLORE THE FLOOR <span>↓</span>
          </a>
          <span className="hero-note">NO QUARTERS REQUIRED.</span>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="pixel-star">✦</div>
          <div className="art-label">INSERT GOOD TIMES</div>
          <div className="grid-floor" />
        </div>
        <span className="hero-index">EST. 2026 / OPEN TO EVERYONE</span>
      </section>
      <section id="games" className="games-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PICK YOUR CABINET</p>
            <h2>
              The arcade floor<span className="pink">.</span>
            </h2>
          </div>
          <span className="section-count">03 CABINETS / POWERING UP</span>
        </div>
        <div className="game-grid">
          {games.map((game) => (
            <Link
              href={`/games/${game.slug}`}
              key={game.slug}
              className={`cabinet ${game.color}`}
            >
              <div className="cabinet-marquee">
                <span>NEON QUARTER</span>
                <span>#{game.number}</span>
              </div>
              <div className="cabinet-screen">
                <div className="screen-top">
                  <span>PLAYER 1</span>
                  <span>HI 000000</span>
                </div>
                <span className="game-symbol" aria-hidden="true">
                  {game.symbol}
                </span>
                <span className="screen-message">COMING SOON</span>
                <div className="screen-bottom">
                  — A NEW CHALLENGER APPROACHES —
                </div>
              </div>
              <div className="cabinet-controls" aria-hidden="true">
                <span className="joystick" />
                <span className="control-button" />
                <span className="control-button small" />
              </div>
              <div className="game-info">
                <div>
                  <span className="game-number">CABINET {game.number}</span>
                  <h3>{game.name}</h3>
                </div>
                <span className="game-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="floor-note">
          <span>✳</span> Our crew is building something good. Check back for the
          first high scores.
        </p>
      </section>
      <section className="shop-banner">
        <span className="ticket-art" aria-hidden="true">
          ▤
        </span>
        <div>
          <p className="eyebrow">PLAY. EARN. REPEAT.</p>
          <h2>Small tickets. Big bragging rights.</h2>
          <p>Your skills earn tickets. Your tickets unlock the good stuff.</p>
        </div>
        <Link href="/shop" className="outline-button">
          VISIT THE PRIZE SHOP <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
