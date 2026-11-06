"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { games } from "@/lib/games";
import { localDay } from "@/lib/dreamio";
import { PixelIcon } from "./pixel-art";
import { WindowBar } from "./world-ui";
import { useTicketWallet } from "./ticket-wallet";
import { ClawpopGame } from "./clawpop-game";

type Game = (typeof games)[number];
type OnFinish = (score: number, detail: string) => void;
const instructions: Record<string, string> = {
  memory:
    "Flip cards and match the pictures. Find all 6 pairs to finish. Fewer guesses mean a higher score.",
  stars:
    "Catch as many stars as you can in 15 seconds. Collect at least one to finish. You can also use Tab and Space.",
  reaction:
    "Wait for the pink area to turn green, then click as fast as you can. Too early? Try again. Space works too.",
  clawpop:
    "Insert a coin, use the directional buttons to position the claw, and press Catch to grab a cute plushie!",
};
export function ArcadeGame({ game }: { game: Game }) {
  if (game.engine === "clawpop") {
    return (
      <main className="clawpop-page-container">
        <div className="page-breadcrumb">
          <Link href="/lobby">HOME / GAME LOBBY</Link>
          <span>{game.english}</span>
        </div>
        <div className="game-page-heading">
          <div>
            <p className="eyebrow">DREAMIO ORIGINAL / DEMO {game.number}</p>
            <h1>
              {game.name}
              <span>✦</span>
            </h1>
            <p>{game.description}</p>
          </div>
          <Link className="button outline-button" href="/lobby">
            ← Back to the lobby
          </Link>
        </div>
        <ClawpopGame />
      </main>
    );
  }
  const { completeGame, best, rewards, nickname } = useTicketWallet();
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<{
    score: number;
    detail: string;
    reward: number;
    claimed: boolean;
  } | null>(null);
  const finished = useRef(false);
  const onFinish: OnFinish = (score, detail) => {
    if (finished.current) return;
    finished.current = true;
    const claimed = rewards[game.slug] === localDay();
    const reward = completeGame(game.slug, score);
    setResult({ score, detail, reward, claimed });
    setPlaying(false);
  };
  function start() {
    finished.current = false;
    setResult(null);
    setRound((n) => n + 1);
    setPlaying(true);
  }
  return (
    <main>
      <div className="page-breadcrumb">
        <Link href="/lobby">HOME / GAME LOBBY</Link>
        <span>{game.english}</span>
      </div>
      <div className="game-page-heading">
        <div>
          <p className="eyebrow">DREAMIO ORIGINAL / DEMO {game.number}</p>
          <h1>
            {game.name}
            <span>✦</span>
          </h1>
          <p>{game.description}</p>
        </div>
        <Link className="button outline-button" href="/lobby">
          ← Back to the lobby
        </Link>
      </div>
      <div className="game-play-layout">
        <section className="pixel-window game-panel">
          <WindowBar title={game.english} icon="game" />
          <div className="game-stage">
            {playing ? (
              game.engine === "memory" ? (
                <Memory key={round} onFinish={onFinish} />
              ) : game.engine === "stars" ? (
                <Stars key={round} onFinish={onFinish} />
              ) : (
                <Reaction key={round} onFinish={onFinish} />
              )
            ) : (
              <div className="game-result">
                <PixelIcon name={result ? "star" : game.symbol} size={52} />
                <p className="eyebrow">
                  {result
                    ? "ANOTHER LITTLE HAPPY MOMENT"
                    : "READY FOR A LITTLE ADVENTURE?"}
                </p>
                <h2>
                  {result
                    ? result.score > 0
                      ? "A little win. A happy you."
                      : "Just a little warm-up"
                    : game.name}
                </h2>
                <p>{result?.detail || instructions[game.engine]}</p>
                {result && result.score > 0 && (
                  <span className="game-result-reward">
                    SCORE {result.score}{" "}
                    {result.reward > 0 ? ` / +${result.reward} PTS` : ""}
                  </span>
                )}
                {result && (
                  <p role="status">
                    {result.reward > 0
                      ? "10 Dream Points are in your pocket. Pick a little treat ♥"
                      : !nickname
                        ? "Sign in to the local demo to earn points for finishing games."
                        : result.claimed
                          ? "Today’s reward is claimed. Keep chasing your best score."
                          : result.score === 0
                            ? "Try again. Finish the challenge to earn your reward."
                            : "Round complete."}
                  </p>
                )}
                <button className="button purple-button" onClick={start}>
                  {result ? "Play again" : "Start game"}
                  <PixelIcon name="arrow" size={16} />
                </button>
              </div>
            )}
          </div>
        </section>
        <aside className="game-instructions">
          <p className="eyebrow">HOW TO PLAY</p>
          <h2>A few little tips</h2>
          <p>{instructions[game.engine]}</p>
          <div className="instruction-bonus">
            <PixelIcon name="coin" size={23} />
            <span>First daily finish: +10 pts</span>
          </div>
          <div className="best-score">
            <span>Personal best</span>
            <b>{best[game.slug] || "—"}</b>
          </div>
          <Link className="text-link" href="/shop">
            Find a little reward ↗
          </Link>
        </aside>
      </div>
    </main>
  );
}
function Memory({ onFinish }: { onFinish: OnFinish }) {
  const [cards] = useState(() => {
    const values = ["heart", "star", "moon", "flower", "bag", "game"];
    const deck = [...values, ...values];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  });
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  useEffect(() => {
    if (opened.length !== 2) return;
    const timeout = setTimeout(() => setOpened([]), 800);
    return () => clearTimeout(timeout);
  }, [opened]);
  function flip(index: number) {
    if (
      opened.length === 2 ||
      matched.includes(index) ||
      opened.includes(index)
    )
      return;
    const next = [...opened, index];
    setOpened(next);
    if (next.length === 2) {
      const count = moves + 1;
      setMoves(count);
      if (cards[next[0]] === cards[next[1]]) {
        const pairs = [...matched, ...next];
        setMatched(pairs);
        setOpened([]);
        if (pairs.length === cards.length)
          onFinish(
            Math.max(1, 150 - count * 3),
            `All 6 pairs found in ${count} guesses. Nicely done!`,
          );
      }
    }
  }
  return (
    <>
      <div className="game-status-bar">
        <span>MOVES {moves}</span>
        <span>PAIRS {matched.length / 2} / 6</span>
      </div>
      <div className="memory-board">
        {cards.map((icon, i) => {
          const show = opened.includes(i) || matched.includes(i);
          return (
            <button
              key={i}
              className={`memory-tile ${show ? "revealed" : ""} ${matched.includes(i) ? "matched" : ""}`}
              aria-label={`Card ${i + 1}${show ? `, ${icon}` : ", face down"}`}
              disabled={
                matched.includes(i) || opened.includes(i) || opened.length === 2
              }
              onClick={() => flip(i)}
            >
              {show ? <PixelIcon name={icon} size={31} /> : "?"}
            </button>
          );
        })}
      </div>
    </>
  );
}
function Stars({ onFinish }: { onFinish: OnFinish }) {
  const [time, setTime] = useState(15);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const count = useRef(0);
  const callback = useRef(onFinish);
  callback.current = onFinish;
  const deadline = useRef(0);
  useEffect(() => {
    deadline.current = performance.now() + 15000;
    const timer = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((deadline.current - performance.now()) / 1000),
      );
      setTime(left);
      if (!left) {
        clearInterval(timer);
        callback.current(
          count.current * 10,
          `You caught ${count.current} stars in 15 seconds.`,
        );
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);
  function collect() {
    if (performance.now() >= deadline.current) return;
    count.current += 1;
    setScore(count.current);
    setPosition({ x: 12 + Math.random() * 76, y: 15 + Math.random() * 70 });
  }
  return (
    <>
      <div className="game-status-bar">
        <span>STARS {score}</span>
        <span>TIME {time}s</span>
      </div>
      <div className="star-field">
        <button
          className="collect-star"
          aria-label="Collect star"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          onClick={collect}
        >
          <PixelIcon name="star" size={32} />
        </button>
      </div>
    </>
  );
}
function Reaction({ onFinish }: { onFinish: OnFinish }) {
  const [phase, setPhase] = useState<"waiting" | "go" | "early">("waiting");
  const [attempt, setAttempt] = useState(0);
  const actual = useRef("waiting");
  const start = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    actual.current = "waiting";
    setPhase("waiting");
    timeout.current = setTimeout(
      () => {
        actual.current = "go";
        start.current = performance.now();
        setPhase("go");
      },
      1500 + Math.random() * 2400,
    );
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [attempt]);
  function press() {
    if (actual.current === "early") {
      setAttempt((n) => n + 1);
      return;
    }
    if (actual.current === "waiting") {
      if (timeout.current) clearTimeout(timeout.current);
      actual.current = "early";
      setPhase("early");
      return;
    }
    const ms = Math.max(1, Math.round(performance.now() - start.current));
    actual.current = "finished";
    onFinish(
      Math.max(1, 1000 - ms),
      `Your reaction time was ${ms} ms. A heartbeat away!`,
    );
  }
  return (
    <>
      <div className="game-status-bar">
        <span>HEARTBEAT TEST</span>
        <span>STAY FOCUSED ♡</span>
      </div>
      <button className={`reaction-pad ${phase}`} onClick={press}>
        <PixelIcon name={phase === "go" ? "heart" : "game"} size={53} />
        <span>
          {phase === "waiting"
            ? "Wait for the green light…"
            : phase === "go"
              ? "Now! Go, go, go!"
              : "A little too soon. Tap to retry."}
        </span>
        <small>
          {phase === "go"
            ? "CLICK NOW!"
            : phase === "early"
              ? "LET’S TRY AGAIN"
              : "WAIT FOR GREEN"}
        </small>
      </button>
    </>
  );
}
