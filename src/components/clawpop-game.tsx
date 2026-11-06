"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  PLUSH_CATALOG,
  INITIAL_PIT_LAYOUT,
  WIN_MESSAGES,
  DROP_FAILURE_MESSAGES,
  MISS_MESSAGES,
  type PlushToy,
} from "@/lib/clawpop-data";
import {
  PlushSprite,
  ClawApparatus,
  PrizeChuteGraphic,
  RetroLedCounter,
  type PlushExpression,
} from "./clawpop-sprites";
import { soundManager } from "@/lib/clawpop-audio";
import { useTicketWallet } from "./ticket-wallet";
import { PixelIcon } from "./pixel-art";

type GamePhase =
  | "NEED_COIN"
  | "READY"
  | "DROPPING"
  | "GRABBING"
  | "LIFTING"
  | "CARRYING"
  | "FALLING_SLIP"
  | "CHUTE_DROP"
  | "WIN_MODAL"
  | "FAIL_MODAL";

interface PitPlush {
  id: string; // unique instance id
  toy: PlushToy;
  x: number; // percentage
  y: number; // percentage
  scale: number;
  rotation: number;
  expression: PlushExpression;
}

export function ClawpopGame() {
  const { addTickets } = useTicketWallet();

  // Credits & Collection state
  const [credits, setCredits] = useState<number>(5);
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [collection, setCollection] = useState<{ [id: string]: number }>({});
  const [showCollectionModal, setShowCollectionModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(false);

  // Claw Position & Sway Physics
  const [clawX, setClawX] = useState<number>(50);
  const [clawY, setClawY] = useState<number>(10);
  const [swayAngle, setSwayAngle] = useState<number>(0);
  const [isClawOpen, setIsClawOpen] = useState<boolean>(true);
  const [grabbedToy, setGrabbedToy] = useState<PitPlush | null>(null);

  // Slipping toy animation state
  const [slippingToy, setSlippingToy] = useState<{
    toy: PlushToy;
    x: number;
    y: number;
    rotation: number;
  } | null>(null);

  // Game flow & dialog
  const [phase, setPhase] = useState<GamePhase>("NEED_COIN");
  const [dialogueText, setDialogueText] = useState<string>("INSERT COIN TO START PLAYING! ♡");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [lastWonToy, setLastWonToy] = useState<PlushToy | null>(null);

  // Dense Plush Pit (20 layered toys)
  const [plushPit, setPlushPit] = useState<PitPlush[]>(() =>
    INITIAL_PIT_LAYOUT.map((item, idx) => {
      const toy =
        PLUSH_CATALOG.find((t) => t.id === item.toyId) ||
        PLUSH_CATALOG[idx % PLUSH_CATALOG.length];
      return {
        id: `${item.toyId}-${idx}`,
        toy,
        x: item.x,
        y: item.y,
        scale: item.scale,
        rotation: item.rotation,
        expression: "idle",
      };
    })
  );

  // Continuous movement tracking
  const activeKeys = useRef<Set<string>>(new Set());
  const animFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const clawPosRef = useRef({ x: 50, y: 10, sway: 0 });

  // Sync ref with state
  useEffect(() => {
    clawPosRef.current.x = clawX;
    clawPosRef.current.y = clawY;
    clawPosRef.current.sway = swayAngle;
  }, [clawX, clawY, swayAngle]);

  // Hydrate collection from local storage
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem("clawpop_plush_count");
      const savedCol = localStorage.getItem("clawpop_collection");
      if (savedCount) setCollectedCount(parseInt(savedCount, 10) || 0);
      if (savedCol) setCollection(JSON.parse(savedCol));
    } catch {
      // ignore
    }
  }, []);

  // Save collection to local storage
  const recordWin = useCallback(
    (toy: PlushToy) => {
      setCollectedCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem("clawpop_plush_count", next.toString());
        } catch {}
        return next;
      });

      setCollection((prev) => {
        const next = { ...prev, [toy.id]: (prev[toy.id] || 0) + 1 };
        try {
          localStorage.setItem("clawpop_collection", JSON.stringify(next));
        } catch {}
        return next;
      });

      // Bonus Dreamio tickets
      addTickets(15);
    },
    [addTickets]
  );

  // Audio mute toggle
  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // 1. Insert Coin
  const insertCoin = () => {
    soundManager.playCoin();
    setCredits((c) => c + 1);
    if (phase === "NEED_COIN") {
      setPhase("READY");
      setDialogueText("READY! MOVE CLAW WITH D-PAD OR ARROW KEYS & PRESS CATCH! ✦");
    }
  };

  // Smooth Movement Game Loop (60 FPS requestAnimationFrame)
  useEffect(() => {
    if (phase !== "READY") {
      activeKeys.current.clear();
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
      return;
    }

    const speed = 0.45; // percentage per 16ms frame (~28% per second)
    const updateLoop = (now: number) => {
      const delta = Math.min(32, now - lastTimeRef.current) / 16.66;
      lastTimeRef.current = now;

      let dx = 0;
      let dy = 0;

      if (activeKeys.current.has("LEFT")) dx -= speed * delta;
      if (activeKeys.current.has("RIGHT")) dx += speed * delta;
      if (activeKeys.current.has("UP")) dy -= speed * delta;
      if (activeKeys.current.has("DOWN")) dy += speed * delta;

      if (dx !== 0 || dy !== 0) {
        clawPosRef.current.x = Math.max(16, Math.min(88, clawPosRef.current.x + dx));
        clawPosRef.current.y = Math.max(8, Math.min(46, clawPosRef.current.y + dy));

        // Dynamic sway angle based on horizontal movement
        const targetSway = dx > 0 ? 5 : dx < 0 ? -5 : 0;
        clawPosRef.current.sway += (targetSway - clawPosRef.current.sway) * 0.15;

        setClawX(clawPosRef.current.x);
        setClawY(clawPosRef.current.y);
        setSwayAngle(clawPosRef.current.sway);
      } else {
        // Damped return to 0 sway
        if (Math.abs(clawPosRef.current.sway) > 0.05) {
          clawPosRef.current.sway *= 0.85;
          setSwayAngle(clawPosRef.current.sway);
        } else if (clawPosRef.current.sway !== 0) {
          clawPosRef.current.sway = 0;
          setSwayAngle(0);
        }
      }

      animFrameId.current = requestAnimationFrame(updateLoop);
    };

    lastTimeRef.current = performance.now();
    animFrameId.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [phase]);

  // Key Down & Up Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (phase === "READY") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          e.preventDefault();
          if (!activeKeys.current.has("LEFT")) {
            soundManager.playMove();
            activeKeys.current.add("LEFT");
          }
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          e.preventDefault();
          if (!activeKeys.current.has("RIGHT")) {
            soundManager.playMove();
            activeKeys.current.add("RIGHT");
          }
        } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
          e.preventDefault();
          if (!activeKeys.current.has("UP")) {
            soundManager.playMove();
            activeKeys.current.add("UP");
          }
        } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
          e.preventDefault();
          if (!activeKeys.current.has("DOWN")) {
            soundManager.playMove();
            activeKeys.current.add("DOWN");
          }
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          dropClaw();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") activeKeys.current.delete("LEFT");
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") activeKeys.current.delete("RIGHT");
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") activeKeys.current.delete("UP");
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") activeKeys.current.delete("DOWN");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [phase]);

  // Pointer press helpers for on-screen D-Pad buttons
  const startDir = (dir: string) => {
    if (phase !== "READY") return;
    soundManager.playMove();
    activeKeys.current.add(dir);
  };

  const stopDir = (dir: string) => {
    activeKeys.current.delete(dir);
  };

  // 3. Drop Claw & Grab Detection
  const dropClaw = () => {
    if (phase !== "READY" || credits <= 0) return;

    activeKeys.current.clear();
    setCredits((c) => Math.max(0, c - 1));
    setPhase("DROPPING");
    setDialogueText("DROPPING THE CLAW... HOLD YOUR BREATH! ( ﾟдﾟ)");
    soundManager.playMotor(1.0);
    setIsClawOpen(true);
    setSwayAngle(0);

    // Target drop depth
    const targetY = 72;
    setClawY(targetY);

    // Wait for descent animation to complete
    setTimeout(() => {
      setPhase("GRABBING");
      soundManager.playGrab();
      setIsClawOpen(false);

      // Collision Detection: find plush within grab tolerance
      const grabRadius = 12; // tolerance percentage
      let caughtIndex = -1;
      let minDistance = Infinity;

      plushPit.forEach((plush, idx) => {
        const dist = Math.hypot(clawX - plush.x, targetY - plush.y);
        if (dist < grabRadius && dist < minDistance) {
          minDistance = dist;
          caughtIndex = idx;
        }
      });

      if (caughtIndex !== -1) {
        // Successful Grab!
        const caught = plushPit[caughtIndex];
        setGrabbedToy({
          ...caught,
          expression: "grabbed",
        });

        // Temporarily remove from pit while in claw
        setPlushPit((prev) => prev.filter((_, i) => i !== caughtIndex));
        setDialogueText(`GRABBED ${caught.toy.name.toUpperCase()}! LIFTING UP... ♡`);

        // Lift up after grabbing
        setTimeout(() => {
          liftClaw(true, caught);
        }, 700);
      } else {
        // Missed!
        setGrabbedToy(null);
        setDialogueText("EMPTY CLAW! MISSED BY A FRACTION! (っ- ‸ - ς)");

        // Lift empty claw
        setTimeout(() => {
          liftClaw(false, null);
        }, 700);
      }
    }, 1100);
  };

  // 4. Lift Claw Up
  const liftClaw = (hasPlush: boolean, caught: PitPlush | null) => {
    setPhase("LIFTING");
    soundManager.playMotor(0.9);
    setClawY(10); // return to top rail

    setTimeout(() => {
      if (hasPlush && caught) {
        carryToChute(caught);
      } else {
        // Missed completely
        const randomMiss = MISS_MESSAGES[Math.floor(Math.random() * MISS_MESSAGES.length)];
        setModalTitle("MISSED! ✦");
        setModalMessage(randomMiss);
        setPhase("FAIL_MODAL");
        setIsClawOpen(true);
      }
    }, 1000);
  };

  // 5. Carry Toward Prize Chute & 50% Random Drop Check
  const carryToChute = (caught: PitPlush) => {
    setPhase("CARRYING");
    setDialogueText("GLIDING TO PRIZE CHUTE... HOLD ON TIGHT! (´• ω •`)");
    soundManager.playMotor(1.6);

    const chuteX = 7;
    const midX = Math.round((clawX + chuteX) / 2);

    // Move to midpoint with gentle sway
    setClawX(midX);
    setSwayAngle(-4);

    setTimeout(() => {
      setSwayAngle(0);

      // 50% Random Chance of Dropping!
      const willDrop = Math.random() < 0.5;

      if (willDrop) {
        // SLIP! Plush falls out of claw!
        soundManager.playSlip();
        setIsClawOpen(true);
        setGrabbedToy(null);
        setPhase("FALLING_SLIP");

        // Animate falling plush tumbling back into the pit
        setSlippingToy({
          toy: caught.toy,
          x: midX,
          y: 20,
          rotation: 30,
        });

        setTimeout(() => {
          setSlippingToy({
            toy: caught.toy,
            x: midX,
            y: 74,
            rotation: 190,
          });
        }, 40);

        setTimeout(() => {
          // Restore plush back in the pit
          setPlushPit((prev) => [
            ...prev,
            {
              ...caught,
              x: midX,
              y: 74,
              expression: "dropped",
              rotation: 15,
            },
          ]);
          setSlippingToy(null);

          // Show Failure Dialogue
          const failMsg =
            DROP_FAILURE_MESSAGES[Math.floor(Math.random() * DROP_FAILURE_MESSAGES.length)];
          setModalTitle("OH NO! SLIPPED! ✧");
          setModalMessage(failMsg);
          setPhase("FAIL_MODAL");
        }, 650);
      } else {
        // SUCCESS! Continues to Chute safely
        setClawX(chuteX);
        setTimeout(() => {
          deliverPrize(caught);
        }, 900);
      }
    }, 900);
  };

  // 6. Deliver Prize Down the Chute
  const deliverPrize = (caught: PitPlush) => {
    setPhase("CHUTE_DROP");
    soundManager.playWin();
    setIsClawOpen(true);
    setGrabbedToy(null);

    // Animate falling into chute
    setSlippingToy({
      toy: caught.toy,
      x: 7,
      y: 20,
      rotation: 0,
    });

    setTimeout(() => {
      setSlippingToy({
        toy: caught.toy,
        x: 7,
        y: 86,
        rotation: 360,
      });
    }, 40);

    setTimeout(() => {
      setSlippingToy(null);
      recordWin(caught.toy);
      setLastWonToy(caught.toy);

      // Refill a fresh toy into the pit so it remains full!
      const randomNewToy = PLUSH_CATALOG[Math.floor(Math.random() * PLUSH_CATALOG.length)];
      setPlushPit((prev) => [
        ...prev,
        {
          id: `refill-${Date.now()}`,
          toy: randomNewToy,
          x: 25 + Math.random() * 55,
          y: 65 + Math.random() * 15,
          scale: 0.95 + Math.random() * 0.1,
          rotation: (Math.random() - 0.5) * 16,
          expression: "idle",
        },
      ]);

      const winTitle = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
      setModalTitle(winTitle);
      setModalMessage(
        `You captured ${caught.toy.name} (${caught.toy.japaneseName})! "${caught.toy.favoritePhrase}" (+15 Pts)`
      );
      setPhase("WIN_MODAL");
    }, 750);
  };

  // Reset for next round
  const resetAfterRound = () => {
    setIsClawOpen(true);
    setClawX(50);
    setClawY(10);
    setSwayAngle(0);
    setGrabbedToy(null);
    setSlippingToy(null);

    // Reset plush expressions in pit
    setPlushPit((prev) =>
      prev.map((p) => ({
        ...p,
        expression: "idle",
      }))
    );

    if (credits > 0) {
      setPhase("READY");
      setDialogueText("READY FOR NEXT CATCH! MOVE CLAW & PRESS CATCH! ✦");
    } else {
      setPhase("NEED_COIN");
      setDialogueText("INSERT COIN TO PLAY AGAIN! ♡");
    }
  };

  return (
    <div className="clawpop-wrapper">
      {/* Early 2000s Japanese Arcade Cabinet Frame - Dreamio Pastel System */}
      <div className={`clawpop-cabinet ${scanlines ? "has-scanlines" : ""}`}>
        {/* Striped Dreamio Canopy / Awning */}
        <header className="cabinet-canopy">
          <div className="canopy-stripes" />
          <div className="canopy-zigzag">
            <span className="canopy-star">✦</span>
            <div className="canopy-title-group">
              <span className="canopy-title">CLAWPOP</span>
              <span className="canopy-subtitle">DREAMIO CRANE PARADISE</span>
            </div>
            <span className="canopy-jp">クローポップ</span>
            <span className="canopy-star">✦</span>
          </div>
          <div className="canopy-marquee-lights">
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
        </header>

        {/* Top HUD: Sound, CRT toggle & Top-Right Collected Counter */}
        <div className="cabinet-top-hud">
          <div className="hud-actions-left">
            <button
              className="hud-pill-button"
              onClick={toggleSound}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              title="8-Bit Sound FX"
            >
              <PixelIcon name="sound" size={14} />
              <span>{isMuted ? "MUTE" : "BGM: ON"}</span>
            </button>
            <button
              className="hud-pill-button"
              onClick={() => setScanlines((s) => !s)}
              title="Toggle Retro Scanlines"
            >
              <span>{scanlines ? "CRT: ON" : "CRT: OFF"}</span>
            </button>
          </div>

          {/* Top-Right Collected Plushies Counter */}
          <div className="hud-collection-right">
            <button
              className="plush-trophy-counter"
              onClick={() => setShowCollectionModal(true)}
              title="View your Plushie Basket!"
            >
              <span className="trophy-icon">🧸</span>
              <span className="trophy-label">PLUSHIES:</span>
              <strong className="trophy-count">{collectedCount}</strong>
              <span className="trophy-badge">BASKET ↗</span>
            </button>
          </div>
        </div>

        {/* Spacious Glass Play Chamber */}
        <div className="cabinet-glass-chamber">
          {/* Glass Specular Reflection Highlight */}
          <div className="glass-reflection" />
          <div className="starry-bubble-bg" />

          {/* Floating Dreamio Cloud Accents */}
          <div className="chamber-cloud cloud-1">☁️</div>
          <div className="chamber-cloud cloud-2">☁️</div>

          {/* Top Rail Track */}
          <div className="claw-gantry-track" />

          {/* Left Prize Chute */}
          <div className="chute-wrapper" style={{ left: "1.5%", bottom: "0%" }}>
            <PrizeChuteGraphic isDropping={phase === "CHUTE_DROP"} />
          </div>

          {/* Active Claw Machine Assembly */}
          <div
            className="claw-moving-node"
            style={{
              left: `${clawX}%`,
              top: `${clawY}%`,
              transform: `translate(-50%, 0) rotate(${swayAngle}deg)`,
              transition:
                phase === "DROPPING"
                  ? "top 1.1s cubic-bezier(0.22, 1, 0.36, 1)"
                  : phase === "LIFTING"
                  ? "top 0.95s cubic-bezier(0.25, 1, 0.5, 1)"
                  : phase === "CARRYING"
                  ? "left 0.85s ease-in-out, transform 0.4s ease-out"
                  : "transform 0.15s ease-out",
            }}
          >
            <ClawApparatus
              isOpen={isClawOpen}
              hasPlush={!!grabbedToy}
              dropProgress={clawY / 72}
            />

            {/* Grabbed Plush suspended in the claw */}
            {grabbedToy && (
              <div className="claw-grabbed-payload">
                <PlushSprite
                  toy={grabbedToy.toy}
                  expression="grabbed"
                  size={64}
                />
              </div>
            )}
          </div>

          {/* Slipping / Falling Plush Tumbling Animation */}
          {slippingToy && (
            <div
              className="claw-slipping-payload"
              style={{
                left: `${slippingToy.x}%`,
                top: `${slippingToy.y}%`,
                transform: `rotate(${slippingToy.rotation}deg)`,
                transition: "top 0.58s cubic-bezier(0.55, 0.055, 0.675, 0.19), transform 0.58s ease-in",
              }}
            >
              <PlushSprite
                toy={slippingToy.toy}
                expression="dropped"
                size={64}
              />
            </div>
          )}

          {/* Lush Stacked Plush Toys Bed / Pit (20 plushies) */}
          <div className="plush-pit-container">
            {plushPit.map((plush) => (
              <div
                key={plush.id}
                className="plush-in-pit"
                style={{
                  left: `${plush.x}%`,
                  top: `${plush.y}%`,
                  transform: `translate(-50%, -50%) scale(${plush.scale}) rotate(${plush.rotation}deg)`,
                }}
              >
                <PlushSprite
                  toy={plush.toy}
                  expression={plush.expression}
                  size={68}
                />
              </div>
            ))}
          </div>

          {/* Dialogue / Status Bar in the glass */}
          <div className="glass-ticker-bar">
            <span>{dialogueText}</span>
          </div>
        </div>

        {/* Bottom Control Deck (Dreamio Lavender-Ivory Metal Plate) */}
        <footer className="cabinet-control-deck">
          <div className="deck-screws top-left" />
          <div className="deck-screws top-right" />
          <div className="deck-screws bottom-left" />
          <div className="deck-screws bottom-right" />

          <div className="deck-layout">
            {/* 1. Credit Display & Insert Coin */}
            <div className="deck-credit-col">
              <div className="credit-display-unit">
                <span className="unit-label">CREDIT</span>
                <RetroLedCounter value={credits} />
              </div>
              <button
                className="insert-coin-button"
                onClick={insertCoin}
                title="Insert coin to play"
              >
                <span className="coin-slot-graphic">
                  <i />
                </span>
                <span>INSERT COIN</span>
              </button>
            </div>

            {/* 2. Retro D-Pad Directional Movement Controls */}
            <div className="deck-dpad-col">
              <span className="dpad-title">HOLD TO MOVE CLAW</span>
              <div className="dpad-cross" role="group" aria-label="Claw directional controls">
                <button
                  className="dpad-btn up"
                  onPointerDown={() => startDir("UP")}
                  onPointerUp={() => stopDir("UP")}
                  onPointerLeave={() => stopDir("UP")}
                  disabled={phase !== "READY"}
                  aria-label="Move Claw Up"
                >
                  ▲
                </button>
                <div className="dpad-row">
                  <button
                    className="dpad-btn left"
                    onPointerDown={() => startDir("LEFT")}
                    onPointerUp={() => stopDir("LEFT")}
                    onPointerLeave={() => stopDir("LEFT")}
                    disabled={phase !== "READY"}
                    aria-label="Move Claw Left"
                  >
                    ◄
                  </button>
                  <div className="dpad-center" />
                  <button
                    className="dpad-btn right"
                    onPointerDown={() => startDir("RIGHT")}
                    onPointerUp={() => stopDir("RIGHT")}
                    onPointerLeave={() => stopDir("RIGHT")}
                    disabled={phase !== "READY"}
                    aria-label="Move Claw Right"
                  >
                    ►
                  </button>
                </div>
                <button
                  className="dpad-btn down"
                  onPointerDown={() => startDir("DOWN")}
                  onPointerUp={() => stopDir("DOWN")}
                  onPointerLeave={() => stopDir("DOWN")}
                  disabled={phase !== "READY"}
                  aria-label="Move Claw Down"
                >
                  ▼
                </button>
              </div>
            </div>

            {/* 3. Big Round DROP CLAW / CATCH Action Button */}
            <div className="deck-catch-col">
              <button
                className={`big-drop-button ${phase === "READY" ? "glow-pulse" : ""}`}
                onClick={dropClaw}
                disabled={phase !== "READY"}
                aria-label="Drop Claw and Catch Plush"
              >
                <span className="drop-button-inner">
                  <span className="drop-button-icon">✦</span>
                  <span className="drop-button-text">CATCH!</span>
                  <span className="drop-button-sub">[SPACE]</span>
                </span>
              </button>
            </div>
          </div>
        </footer>

        {/* Congratulatory / Win Popup Modal */}
        {phase === "WIN_MODAL" && lastWonToy && (
          <div className="clawpop-modal-backdrop" role="dialog" aria-modal="true">
            <div className="clawpop-modal-bubble win-bubble">
              <div className="bubble-sparkles">✦ ✧ ★ ✧ ✦</div>
              <h2 className="bubble-title">{modalTitle}</h2>
              <div className="bubble-plush-stage">
                <PlushSprite toy={lastWonToy} expression="idle" size={105} />
              </div>
              <h3 className="bubble-toy-name">
                {lastWonToy.name} · {lastWonToy.japaneseName}
              </h3>
              <p className="bubble-tagline">{lastWonToy.title}</p>
              <p className="bubble-personality">{lastWonToy.personality}</p>
              <p className="bubble-phrase">"{lastWonToy.favoritePhrase}"</p>
              <div className="bubble-reward-badge">+15 DREAM POINTS! ✦</div>
              <button
                className="bubble-action-button"
                onClick={resetAfterRound}
                autoFocus
              >
                KEEP IN BASKET! ♡
              </button>
            </div>
          </div>
        )}

        {/* Cute Failure / Slip Popup Modal */}
        {phase === "FAIL_MODAL" && (
          <div className="clawpop-modal-backdrop" role="dialog" aria-modal="true">
            <div className="clawpop-modal-bubble fail-bubble">
              <div className="bubble-sweat">💦 (っ- ‸ - ς) 💦</div>
              <h2 className="bubble-title">{modalTitle}</h2>
              <p className="bubble-message">{modalMessage}</p>
              <p className="bubble-hint">
                {credits > 0
                  ? `You have ${credits} credit${credits > 1 ? "s" : ""} left!`
                  : "Insert a coin to go for another round!"}
              </p>
              <button
                className="bubble-action-button"
                onClick={resetAfterRound}
                autoFocus
              >
                TRY AGAIN! ✦
              </button>
            </div>
          </div>
        )}

        {/* My Plushie Collection Basket Modal (All 12 plushies) */}
        {showCollectionModal && (
          <div className="clawpop-modal-backdrop" role="dialog" aria-modal="true">
            <div className="clawpop-modal-bubble collection-bubble">
              <div className="collection-header">
                <h3>🧸 MY PLUSHIE BASKET ({collectedCount})</h3>
                <button
                  className="collection-close-btn"
                  onClick={() => setShowCollectionModal(false)}
                >
                  ✕
                </button>
              </div>
              <p className="collection-sub">
                12 sweet original Kirby-inspired companions to collect in the Clawpop crane paradise!
              </p>
              <div className="collection-grid">
                {PLUSH_CATALOG.map((toy) => {
                  const qty = collection[toy.id] || 0;
                  return (
                    <div
                      key={toy.id}
                      className={`collection-card ${qty > 0 ? "unlocked" : "locked"}`}
                    >
                      <div className="card-sprite">
                        <PlushSprite toy={toy} size={50} />
                        {qty === 0 && <span className="locked-badge">?</span>}
                      </div>
                      <div className="card-info">
                        <strong>
                          {toy.name} <small>{toy.japaneseName}</small>
                        </strong>
                        <span className="card-rarity">{toy.rarity.toUpperCase()}</span>
                        <p className="card-phrase">
                          {qty > 0 ? `"${toy.favoritePhrase}"` : "Not caught yet"}
                        </p>
                        <span className="card-count">
                          {qty > 0 ? `Caught: ×${qty}` : "0 in basket"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                className="bubble-action-button"
                onClick={() => setShowCollectionModal(false)}
              >
                BACK TO GAME ↗
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Retro Game Info Bar below cabinet */}
      <div className="clawpop-footer-tips">
        <div className="tips-badge">HOW TO PLAY · DREAMIO ARCADE</div>
        <p>
          1. <strong>Insert Coin</strong> to power up the machine.
          <br />
          2. Use <strong>D-Pad buttons</strong> (or Arrow Keys / WASD) to smoothly guide the claw. Hold down for continuous glide!
          <br />
          3. Press <strong>CATCH!</strong> (or Spacebar) to drop the claw.
          <br />
          4. <strong>50% Drop Chance:</strong> While traveling to the prize chute on the left, watch out for the slippery claw!
        </p>
      </div>
    </div>
  );
}
