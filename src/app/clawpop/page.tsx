import Link from "next/link";
import { ClawpopGame } from "@/components/clawpop-game";

export const metadata = {
  title: "Clawpop · Retro Japanese Claw Machine · Dreamio",
  description:
    "An interactive Japanese pixel claw machine filled with cute round plushies! Move the claw, test the 50% drop chance, and build your plushie collection.",
};

export default function ClawpopPage() {
  return (
    <main className="clawpop-page-container">
      <div className="page-breadcrumb">
        <Link href="/lobby">HOME / GAME LOBBY</Link>
        <span>CLAWPOP ARCADE</span>
      </div>

      <div className="game-page-heading">
        <div>
          <p className="eyebrow">DREAMIO ORIGINAL / PROTOTYPE 04</p>
          <h1>
            Clawpop Arcade
            <span>✦</span>
          </h1>
          <p>
            Drop the claw. Catch original Kirby-inspired plushies in a sweet early 2000s Japanese crane game!
          </p>
        </div>
        <Link className="button outline-button" href="/lobby">
          ← Back to the lobby
        </Link>
      </div>

      <ClawpopGame />
    </main>
  );
}
