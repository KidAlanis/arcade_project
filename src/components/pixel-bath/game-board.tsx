"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  BathLevel,
  CELL_AIR,
  CELL_DIRT,
  CELL_ROCK,
  CELL_WOOD,
  WaterParticle,
} from "./types";
import { PixelGirl } from "./pixel-girl";
import { bathAudio } from "./audio";

interface GameBoardProps {
  level: BathLevel;
  onLevelComplete: (ducksCollected: number) => void;
  onRestart: () => void;
}

export function GameBoard({ level, onLevelComplete, onRestart }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation State Refs (for smooth 60fps loop)
  const gridRef = useRef<Uint8Array>(new Uint8Array(0));
  const particlesRef = useRef<WaterParticle[]>([]);
  const ducksRef = useRef(level.ducks.map((d) => ({ ...d })));
  const waterCollectedRef = useRef(0);
  const isCompletedRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);

  // React state for HUD
  const [waterPercent, setWaterPercent] = useState(0);
  const [ducksState, setDucksState] = useState(ducksRef.current);
  const [isVictory, setIsVictory] = useState(false);

  // Visual dirt crumbs
  const crumbsRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>>([]);

  const W = level.gridWidth;
  const H = level.gridHeight;
  const CELL_SIZE = 8;
  const CANVAS_WIDTH = W * CELL_SIZE; // 512px
  const CANVAS_HEIGHT = H * CELL_SIZE; // 640px

  // Initialize level
  const initLevel = useCallback(() => {
    gridRef.current = level.generateTerrain(W, H);
    ducksRef.current = level.ducks.map((d) => ({ ...d, isCollected: false, fillLevel: 0 }));
    waterCollectedRef.current = 0;
    isCompletedRef.current = false;
    crumbsRef.current = [];
    setIsVictory(false);
    setWaterPercent(0);
    setDucksState(ducksRef.current);

    // Spawn water particles at spawners
    const particles: WaterParticle[] = [];
    level.spawners.forEach((spawner) => {
      for (let i = 0; i < spawner.count; i++) {
        particles.push({
          x: spawner.x + (Math.random() - 0.5) * 8,
          y: spawner.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.4,
          vy: Math.random() * 0.2,
          life: 1,
        });
      }
    });
    particlesRef.current = particles;
  }, [level, W, H]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Digging logic
  const digAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;

    const gx = Math.floor(px / CELL_SIZE);
    const gy = Math.floor(py / CELL_SIZE);

    const radius = 3;
    let dugAny = false;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            const idx = ny * W + nx;
            if (gridRef.current[idx] === CELL_DIRT) {
              gridRef.current[idx] = CELL_AIR;
              dugAny = true;

              // Spawn tiny crumb
              if (Math.random() < 0.25) {
                crumbsRef.current.push({
                  x: nx * CELL_SIZE + CELL_SIZE / 2,
                  y: ny * CELL_SIZE + CELL_SIZE / 2,
                  vx: (Math.random() - 0.5) * 2,
                  vy: -Math.random() * 2,
                  life: 1,
                  color: Math.random() > 0.5 ? "#83532c" : "#5a3418",
                });
              }
            }
          }
        }
      }
    }

    if (dugAny) {
      bathAudio.dig();
    }
  };

  // Pointer event listeners
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    digAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPointerDownRef.current) {
      digAt(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  // Main 60fps Game Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.033);
      lastTime = currentTime;

      const grid = gridRef.current;
      const particles = particlesRef.current;
      const ducks = ducksRef.current;
      const tub = level.tub;

      // 1. UPDATE PARTICLES (Physics)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply gravity
        p.vy += 12 * dt;
        p.vx *= 0.98;
        p.vy = Math.min(p.vy, 14);

        // Move in sub-steps for solid tunnel collision
        const steps = 2;
        const subDt = dt / steps;

        for (let s = 0; s < steps; s++) {
          const nextX = p.x + p.vx * subDt;
          const nextY = p.y + p.vy * subDt;

          const cellX = Math.floor(nextX);
          const cellY = Math.floor(nextY);

          // Boundary checks
          if (cellX < 0 || cellX >= W || cellY >= H) {
            particles.splice(i, 1);
            break;
          }

          const cell = grid[cellY * W + cellX];

          // Check if entering Tub Intake!
          if (
            cellX >= tub.x &&
            cellX < tub.x + tub.width &&
            cellY >= tub.y &&
            cellY < tub.y + tub.height
          ) {
            particles.splice(i, 1);
            waterCollectedRef.current++;
            bathAudio.splash();

            const pct = Math.min(
              100,
              Math.round((waterCollectedRef.current / tub.targetWater) * 100)
            );
            setWaterPercent(pct);

            if (waterCollectedRef.current >= tub.targetWater && !isCompletedRef.current) {
              isCompletedRef.current = true;
              setIsVictory(true);
              bathAudio.victory();
              const ducksCount = ducks.filter((d) => d.isCollected).length;
              onLevelComplete(ducksCount);
            }
            break;
          }

          // Check Rubber Duck collision
          for (let d = 0; d < ducks.length; d++) {
            const duck = ducks[d];
            if (!duck.isCollected) {
              const distSq = (p.x - duck.x) ** 2 + (p.y - duck.y) ** 2;
              if (distSq < 10) {
                duck.fillLevel += 0.25;
                if (duck.fillLevel >= 1) {
                  duck.isCollected = true;
                  bathAudio.duck();
                  setDucksState([...ducks]);
                }
              }
            }
          }

          // Solid collision with Terrain
          if (cell !== CELL_AIR) {
            p.vy *= -0.2;
            const dir = Math.random() > 0.5 ? 1 : -1;
            p.vx += dir * (0.8 + Math.random() * 0.8);

            const leftCell = cellX > 0 ? grid[cellY * W + (cellX - 1)] : CELL_ROCK;
            const rightCell = cellX < W - 1 ? grid[cellY * W + (cellX + 1)] : CELL_ROCK;

            if (leftCell === CELL_AIR && rightCell !== CELL_AIR) {
              p.x = cellX - 0.1;
              p.vx = -1.2;
            } else if (rightCell === CELL_AIR && leftCell !== CELL_AIR) {
              p.x = cellX + 1.1;
              p.vx = 1.2;
            } else {
              p.y = Math.floor(p.y);
            }
            break;
          } else {
            p.x = nextX;
            p.y = nextY;
          }
        }
      }

      // Update crumbs
      for (let i = crumbsRef.current.length - 1; i >= 0; i--) {
        const c = crumbsRef.current[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.15;
        c.life -= dt * 2;
        if (c.life <= 0) crumbsRef.current.splice(i, 1);
      }

      // 2. RENDER BOARD
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Deep Underground Backing
      ctx.fillStyle = level.theme === "mine" ? "#191526" : "#24130b";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Cells (Pixel Terrain)
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const type = grid[y * W + x];
          if (type === CELL_AIR) continue;

          const px = x * CELL_SIZE;
          const py = y * CELL_SIZE;

          if (type === CELL_DIRT) {
            ctx.fillStyle = ((x + y) % 5 === 0) ? "#6b3f20" : ((x * y) % 7 === 0) ? "#7e4d28" : "#744624";
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

            if (y > 0 && grid[(y - 1) * W + x] === CELL_AIR) {
              ctx.fillStyle = level.theme === "farm" ? "#4caf50" : "#9c6838";
              ctx.fillRect(px, py, CELL_SIZE, 2);
            }
          } else if (type === CELL_ROCK) {
            ctx.fillStyle = level.theme === "mine" ? "#312a45" : "#455a64";
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
            ctx.fillStyle = "#263238";
            ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          } else if (type === CELL_WOOD) {
            ctx.fillStyle = "#8d5b32";
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
            ctx.fillStyle = "#5c3818";
            ctx.fillRect(px, py + CELL_SIZE - 2, CELL_SIZE, 2);
          }
        }
      }

      // Draw Rubber Ducks
      ducks.forEach((duck) => {
        const dx = duck.x * CELL_SIZE;
        const dy = duck.y * CELL_SIZE;

        ctx.save();
        ctx.translate(dx, dy);

        if (duck.fillLevel > 0 && !duck.isCollected) {
          ctx.beginPath();
          ctx.arc(0, 0, 16 * duck.fillLevel, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
          ctx.fill();
        }

        ctx.fillStyle = duck.isCollected ? "#f1c40f" : "#d4ac0d";
        ctx.beginPath();
        ctx.ellipse(0, 2, 9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, -3, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#e67e22";
        ctx.beginPath();
        ctx.ellipse(8, -2, 3, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#111111";
        ctx.beginPath();
        ctx.arc(4, -4, 1, 0, Math.PI * 2);
        ctx.fill();

        if (duck.isCollected) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px monospace";
          ctx.fillText("★", -4, -8);
        }

        ctx.restore();
      });

      // Draw Water Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const px = p.x * CELL_SIZE;
        const py = p.y * CELL_SIZE;

        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px - 1, py - 1, 1.5, 1.5);
      }

      // Draw Dirt Crumbs
      crumbsRef.current.forEach((c) => {
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, 2.5, 2.5);
      });

      // Draw Tub Intake Zone Area Guide
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(
        tub.x * CELL_SIZE,
        tub.y * CELL_SIZE,
        tub.width * CELL_SIZE,
        tub.height * CELL_SIZE
      );
      ctx.setLineDash([]);

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [level, W, H, CANVAS_WIDTH, CANVAS_HEIGHT, onLevelComplete]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto select-none py-1">
      {/* Top HUD: Level Title, Ducks, Water Progress */}
      <div className="w-full flex items-center justify-between px-6 py-2.5 bg-[#2d180f] border-4 border-[#5c3818] rounded-2xl mb-3 shadow-xl text-white">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-amber-400 bg-[#3d2315] px-2.5 py-1 rounded-lg border border-[#5c3818]">
            LEVEL {level.number}
          </span>
          <div>
            <h2 className="text-base font-black tracking-wide leading-tight">{level.name}</h2>
            <p className="text-[11px] text-amber-200/70 hidden sm:block">{level.subtitle}</p>
          </div>
        </div>

        {/* 3 Collectible Ducks */}
        <div className="flex items-center gap-2.5 bg-[#1b0d07] px-4 py-1.5 rounded-xl border border-[#5c3818]">
          {ducksState.map((duck, i) => (
            <span
              key={duck.id || i}
              className={`text-2xl transition-transform ${
                duck.isCollected
                  ? "scale-110 drop-shadow-[0_0_8px_#f1c40f]"
                  : "opacity-30 grayscale"
              }`}
              title={duck.isCollected ? "已收集小黄鸭！" : "引导水流浸泡小鸭收集"}
            >
              🐥
            </span>
          ))}
        </div>

        {/* Water Tank Meter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-cyan-300 font-bold">浴桶水量</div>
            <div className="text-sm font-black text-cyan-200">{waterPercent}%</div>
          </div>
          <div className="w-24 h-5 bg-[#111827] rounded-full border-2 border-cyan-400/60 overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-400 rounded-full transition-all duration-150 shadow-md"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Playfield Frame (Full Height Responsive) */}
      <div className="w-full flex justify-center items-center">
        <div
          className="relative border-4 border-[#5c3818] rounded-3xl overflow-hidden shadow-2xl bg-[#191526]"
          style={{
            height: "min(72vh, 680px)",
            aspectRatio: "64 / 80",
          }}
        >
          {/* Diggable HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full cursor-crosshair block touch-none"
          />

          {/* The Exact Pixel Girl in her Wooden Tub */}
          <div
            className="absolute pointer-events-none transition-all"
            style={{
              left: `${(level.tub.x / W) * 100}%`,
              top: `${((level.tub.y - 13) / H) * 100}%`,
              width: `${(level.tub.width / W) * 100}%`,
            }}
          >
            <PixelGirl isBathing={isVictory} waterLevel={waterPercent} size={120} />
          </div>

          {/* Floating Controls Overlay: Restart Button */}
          <button
            onClick={() => {
              bathAudio.pop();
              initLevel();
              onRestart();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#3b1d11]/85 hover:bg-[#3b1d11] border-2 border-amber-400 text-amber-300 font-black text-base flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            title="重玩本关 / Reset Level"
          >
            ↺
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="mt-3 text-xs font-bold text-amber-200/80 tracking-wide text-center flex items-center justify-center gap-3">
        <span>💡 划动深色泥土开凿水渠</span>
        <span>•</span>
        <span>💢 小女孩没洗到澡很生气，注满水她就会开心地笑并冒泡泡！</span>
      </div>
    </div>
  );
}
