"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTicketWallet } from "./ticket-wallet";
import { Cloud, PixelAvatar, PixelIcon } from "./pixel-art";

export function HomeWorld() {
  const router = useRouter();
  const { login, nickname, ready, look, hair, skin, storageAvailable } =
    useTicketWallet();
  const [name, setName] = useState("");
  function enter(event: FormEvent) {
    event.preventDefault();
    if (login(name)) router.push("/lobby");
  }
  return (
    <main className="landing-page">
      <div className="landing-background" aria-hidden="true" />
      <div className="landing-scanlines" aria-hidden="true" />
      <div className="landing-top">
        <Link href="/" className="landing-wordmark">
          D<span>✦</span>
        </Link>
        <span>YOUR COZY LITTLE CORNER OF THE INTERNET</span>
        <Link href="/lobby">EXPLORE AS GUEST ↗</Link>
      </div>
      <Cloud className="landing-cloud cloud-left" />
      <Cloud className="landing-cloud cloud-right" />
      <span className="landing-spark landing-spark-one" aria-hidden="true">
        ✦
      </span>
      <span className="landing-spark landing-spark-two" aria-hidden="true">
        ✧
      </span>
      <span className="landing-spark landing-spark-three" aria-hidden="true">
        ✦
      </span>
      <section className="landing-content" id="login">
        <p className="landing-overline">A LITTLE PLAY. A LITTLE MAGIC.</p>
        <h1 className="dreamio-title" aria-label="Dreamio">
          <span aria-hidden="true">DREAMIO</span>
        </h1>
        <p className="landing-tagline">Small pixels. Endless possibilities.</p>
        <p className="landing-description">
          Play your favorites. Find your style. Dream a little.
        </p>
        {nickname ? (
          <div className="landing-login returning-login">
            <p className="landing-player">
              WELCOME BACK, <strong>{nickname}</strong> ♡
            </p>
            <Link href="/lobby" className="landing-start">
              LET’S PLAY <PixelIcon name="arrow" size={20} />
            </Link>
            <Link className="landing-guest" href="/wardrobe">
              Visit my dressing room ↗
            </Link>
          </div>
        ) : (
          <form className="landing-login" onSubmit={enter}>
            <label htmlFor="nickname">WHAT SHOULD WE CALL YOU?</label>
            <input
              id="nickname"
              autoComplete="nickname"
              placeholder="Your dreamer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={16}
              required
            />
            <button
              className="landing-start"
              disabled={!ready || !name.trim()}
              type="submit"
            >
              PRESS START <PixelIcon name="arrow" size={20} />
            </button>
            <Link href="/lobby" className="landing-guest">
              Just looking around? Enter as a guest →
            </Link>
          </form>
        )}
        <p className="landing-local-note">
          LOCAL DEMO · NO PASSWORD NEEDED
          <br />
          {storageAvailable
            ? "Your name and progress stay in this browser."
            : "Browser storage is unavailable. Progress may not be saved."}
        </p>
      </section>
      <div className="landing-character">
        <span className="landing-character-note">
          YOUR NEXT ADVENTURE
          <br />
          IS A CLICK AWAY! ♡
        </span>
        <PixelAvatar look={look} hair={hair} skin={skin} />
      </div>
      <div className="landing-bottom">
        <span>✦ PLAY · COLLECT · DRESS UP · REPEAT ✦</span>
        <span>MADE OF LITTLE HAPPY THINGS</span>
        <span>© 2026 DREAMIO</span>
      </div>
    </main>
  );
}
