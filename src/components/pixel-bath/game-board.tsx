"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  BathLevel,
  CELL_AIR,
  CELL_CLOUD_WHITE,
  CELL_CLOUD_PINK,
  CELL_CLOUD_LAVENDER,
  CELL_CLOUD_PEACH,
  CELL_ROCK,
  CELL_WOOD,
  isCloud,
  WaterParticle,
} from "./types";
import { PixelGirl } from "./pixel-girl";
import { bathAudio } from "./audio";

interface GameBoardProps {
  level: BathLevel;
  onLevelComplete: (ducksCollected: number) => void;
  onRestart: () => void;
}

interface CloudCrumb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
  isStar?: boolean;
}

export function GameBoard({
  level,
  onLevelComplete,
  onRestart,
}: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fullscreen viewport dimensions
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });

  // Grid dimensions
  const CELL_SIZE = 12;
  const W = Math.max(60, Math.floor(viewport.width / CELL_SIZE));
  const H = Math.max(50, Math.floor(viewport.height / CELL_SIZE));

  // Simulation State Refs
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

  // Visual cloud mist & star crumbs
  const crumbsRef = useRef<CloudCrumb[]>([]);

  // Tub coordinates adapted to current screen grid
  const tubX = Math.floor(W * (level.tub.x / level.gridWidth));
  const tubY = Math.floor(H * (level.tub.y / level.gridHeight));
  const tubWidth = 20;
  const tubHeight = 10;
  const targetWater = level.tub.targetWater;

  // Window resize handler for true fullscreen edge-to-edge
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize level
  const initLevel = useCallback(() => {
    if (W <= 0 || H <= 0) return;

    gridRef.current = level.generateTerrain(W, H);

    // Adapt ducks to grid
    ducksRef.current = level.ducks.map((d) => ({
      ...d,
      x: Math.floor(W * (d.x / level.gridWidth)),
      y: Math.floor(H * (d.y / level.gridHeight)),
      isCollected: false,
      fillLevel: 0,
    }));

    waterCollectedRef.current = 0;
    isCompletedRef.current = false;
    crumbsRef.current = [];
    setIsVictory(false);
    setWaterPercent(0);
    setDucksState(ducksRef.current);

    // Spawn water particles in the top sky cloud reservoir
    const particles: WaterParticle[] = [];
    level.spawners.forEach((spawner) => {
      const sx = Math.floor(W * (spawner.x / level.gridWidth));
      const sy = Math.floor(H * (spawner.y / level.gridHeight));
      const count = Math.min(260, Math.floor(spawner.count * (W / 64)));

      for (let i = 0; i < count; i++) {
        particles.push({
          x: sx + (Math.random() - 0.5) * 14,
          y: sy + (Math.random() - 0.5) * 8,
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

  // Digging logic: carving through white and dreamy pastel cloud blocks
  const digAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    const gx = Math.floor(px / CELL_SIZE);
    const gy = Math.floor(py / CELL_SIZE);

    const radius = 3.6;
    let dugAny = false;

    for (let dy = -Math.ceil(radius); dy <= Math.ceil(radius); dy++) {
      for (let dx = -Math.ceil(radius); dx <= Math.ceil(radius); dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            const idx = ny * W + nx;
            const cell = gridRef.current[idx];
            if (isCloud(cell)) {
              gridRef.current[idx] = CELL_AIR;
              dugAny = true;

              // Spawn soft fluffy cloud puffs & star sparkles matching cloud color
              if (Math.random() < 0.45) {
                const isStar = Math.random() < 0.28;
                let crumbColor = "#ffffff";
                if (cell === CELL_CLOUD_PINK) {
                  crumbColor = Math.random() > 0.5 ? "#fbcfe8" : "#f472b6";
                } else if (cell === CELL_CLOUD_LAVENDER) {
                  crumbColor = Math.random() > 0.5 ? "#ede9fe" : "#c4b5fd";
                } else if (cell === CELL_CLOUD_PEACH) {
                  crumbColor = Math.random() > 0.5 ? "#fed7aa" : "#fba875";
                } else {
                  crumbColor = Math.random() > 0.5 ? "#ffffff" : "#f5f3ff";
                }

                crumbsRef.current.push({
                  x: nx * CELL_SIZE + CELL_SIZE / 2,
                  y: ny * CELL_SIZE + CELL_SIZE / 2,
                  vx: (Math.random() - 0.5) * 2.2,
                  vy: -Math.random() * 1.8 - 0.3,
                  radius: isStar ? 2.5 : 4 + Math.random() * 5,
                  life: 1,
                  maxLife: 1,
                  color: isStar ? "#fef08a" : crumbColor,
                  isStar,
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

      // 1. UPDATE PARTICLES (Celestial Waterfall Physics)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Gravity
        p.vy += 13.5 * dt;
        p.vx *= 0.985;
        p.vy = Math.min(p.vy, 15);

        // Sub-steps for tunnel collision
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

          // Check Tub Intake Zone (Where the little girl is bathing on the clouds!)
          if (
            cellX >= tubX &&
            cellX < tubX + tubWidth &&
            cellY >= tubY &&
            cellY < tubY + tubHeight
          ) {
            particles.splice(i, 1);
            waterCollectedRef.current++;
            bathAudio.splash();

            const pct = Math.min(
              100,
              Math.round((waterCollectedRef.current / targetWater) * 100)
            );
            setWaterPercent(pct);

            if (waterCollectedRef.current >= targetWater && !isCompletedRef.current) {
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
              if (distSq < 12) {
                duck.fillLevel += 0.25;
                if (duck.fillLevel >= 1) {
                  duck.isCollected = true;
                  bathAudio.duck();
                  setDucksState([...ducks]);
                }
              }
            }
          }

          // Solid collision with Cloud or Stone
          if (cell !== CELL_AIR) {
            p.vy *= -0.25;
            const dir = Math.random() > 0.5 ? 1 : -1;
            p.vx += dir * (0.9 + Math.random() * 0.9);

            const leftCell = cellX > 0 ? grid[cellY * W + (cellX - 1)] : CELL_ROCK;
            const rightCell = cellX < W - 1 ? grid[cellY * W + (cellX + 1)] : CELL_ROCK;

            if (leftCell === CELL_AIR && rightCell !== CELL_AIR) {
              p.x = cellX - 0.15;
              p.vx = -1.3;
            } else if (rightCell === CELL_AIR && leftCell !== CELL_AIR) {
              p.x = cellX + 1.15;
              p.vx = 1.3;
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

      // Update cloud mist crumbs
      for (let i = crumbsRef.current.length - 1; i >= 0; i--) {
        const c = crumbsRef.current[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.04;
        c.life -= dt * 1.6;
        if (c.life <= 0) crumbsRef.current.splice(i, 1);
      }

      // ================= 2. RENDER THE GAME WORLD =================
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      // A. PROCEDURAL SKY GRADIENT (Inspired by reference art: pastel sunset/twilight sky)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
      skyGrad.addColorStop(0, "#738be4");      // Dreamy sky blue
      skyGrad.addColorStop(0.25, "#9ca6f5");   // Soft periwinkle
      skyGrad.addColorStop(0.52, "#cfaae9");   // Pastel lilac
      skyGrad.addColorStop(0.78, "#f6c2d7");   // Romantic pastel pink
      skyGrad.addColorStop(1, "#fde3cb");      // Sunset peach glow
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, cw, ch);

      // B. CELESTIAL CRESCENT MOON WITH WARM PIXEL GLOW
      const moonX = cw * 0.85;
      const moonY = ch * 0.11;
      const moonR = Math.max(26, Math.min(42, cw * 0.026));

      // Golden Moon Aura
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 2.8);
      moonGlow.addColorStop(0, "rgba(254, 240, 138, 0.45)");
      moonGlow.addColorStop(0.5, "rgba(253, 224, 71, 0.18)");
      moonGlow.addColorStop(1, "rgba(254, 240, 138, 0)");
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Golden Pixel Crescent Moon Body
      ctx.save();
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, -Math.PI * 0.4, Math.PI * 0.9);
      ctx.arc(moonX - moonR * 0.45, moonY - moonR * 0.35, moonR * 0.88, Math.PI * 0.9, -Math.PI * 0.4, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // C. TWINKLING PIXEL STARS ACROSS UPPER SKY
      const timeSec = currentTime * 0.002;
      const starSeeds = [
        [0.08, 0.06, 2.2], [0.18, 0.12, 1.6], [0.32, 0.07, 2.8], [0.46, 0.14, 1.8],
        [0.62, 0.08, 2.4], [0.74, 0.16, 2.0], [0.93, 0.08, 2.2], [0.12, 0.22, 1.8],
        [0.26, 0.28, 2.4], [0.42, 0.24, 1.6], [0.58, 0.26, 2.6], [0.82, 0.28, 1.8]
      ];
      starSeeds.forEach(([nx, ny, r], idx) => {
        const sx = nx * cw;
        const sy = ny * ch;
        const pulse = 0.5 + 0.5 * Math.sin(timeSec * 3.5 + idx * 1.8);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.4 + 0.6 * pulse;

        ctx.beginPath();
        ctx.arc(sx, sy, r * (0.8 + 0.3 * pulse), 0, Math.PI * 2);
        ctx.fill();

        // 4-point cross star glint
        if (r >= 2.2) {
          ctx.fillRect(sx - r * 2, sy - 0.5, r * 4, 1);
          ctx.fillRect(sx - 0.5, sy - r * 2, 1, r * 4);
        }
      });
      ctx.globalAlpha = 1.0;

      // D. PROCEDURAL DISTANT FLOATING SKY CASTLES & ARCH BRIDGES (Reference Art Style)
      // Soft silhouette towers in background behind clouds
      ctx.save();
      ctx.fillStyle = "rgba(180, 150, 225, 0.28)";

      // Distant castle spires on the horizon
      const castleBaseY = ch * 0.38;
      const castlePoints = [
        { x: cw * 0.15, w: 28, h: 65, spireH: 30 },
        { x: cw * 0.22, w: 34, h: 80, spireH: 45 },
        { x: cw * 0.52, w: 42, h: 95, spireH: 55 },
        { x: cw * 0.58, w: 30, h: 70, spireH: 35 },
        { x: cw * 0.72, w: 36, h: 85, spireH: 50 },
      ];
      castlePoints.forEach((c) => {
        // Tower body
        ctx.fillRect(c.x, castleBaseY - c.h, c.w, c.h);
        // Spire roof
        ctx.beginPath();
        ctx.moveTo(c.x - 2, castleBaseY - c.h);
        ctx.lineTo(c.x + c.w / 2, castleBaseY - c.h - c.spireH);
        ctx.lineTo(c.x + c.w + 2, castleBaseY - c.h);
        ctx.closePath();
        ctx.fill();

        // Glowing golden window
        ctx.fillStyle = "rgba(254, 240, 138, 0.45)";
        ctx.fillRect(c.x + c.w / 2 - 3, castleBaseY - c.h + 16, 6, 9);
        ctx.fillStyle = "rgba(180, 150, 225, 0.28)";
      });

      // Distant Arch Viaduct Bridge
      ctx.fillRect(cw * 0.35, castleBaseY - 14, cw * 0.35, 10);
      for (let bx = cw * 0.38; bx < cw * 0.68; bx += 32) {
        ctx.fillRect(bx, castleBaseY - 14, 8, 30);
      }
      ctx.restore();

      // ================= E. RENDER MASSIVE MULTI-COLORED DREAMY CLOUDS =================
      // Clouds fill the lower and middle screen, ready to be dug out by the player!
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const type = grid[y * W + x];
          if (type === CELL_AIR) continue;

          const px = x * CELL_SIZE;
          const py = y * CELL_SIZE;

          if (isCloud(type)) {
            const topIsAir = y > 0 && grid[(y - 1) * W + x] === CELL_AIR;
            const bottomIsAir = y < H - 1 && grid[(y + 1) * W + x] === CELL_AIR;
            const leftIsAir = x > 0 && grid[y * W + (x - 1)] === CELL_AIR;
            const rightIsAir = x < W - 1 && grid[y * W + (x + 1)] === CELL_AIR;

            // Palette selection based on cloud type
            let bodyColor = "#fbf8ff";
            let topHighlight = "#ffffff";
            let shadowColor = "#d6c4eb";

            if (type === CELL_CLOUD_PINK) {
              // Dreamy Pastel Pink Cloud
              bodyColor = (x + y) % 3 === 0 ? "#fce7f3" : "#fbcfe8";
              topHighlight = "#fff1f6";
              shadowColor = "#f472b6";
            } else if (type === CELL_CLOUD_LAVENDER) {
              // Dreamy Lilac / Lavender Cloud
              bodyColor = (x + y) % 3 === 0 ? "#ede9fe" : "#ddd6fe";
              topHighlight = "#fcfaff";
              shadowColor = "#c4b5fd";
            } else if (type === CELL_CLOUD_PEACH) {
              // Dreamy Sunset Peach Cloud
              bodyColor = (x + y) % 3 === 0 ? "#ffedd5" : "#fed7aa";
              topHighlight = "#fffbf5";
              shadowColor = "#fba875";
            } else {
              // Pure White Fluffy Cloud
              bodyColor = (x + y) % 4 === 0 ? "#ffffff" : "#f8f5fc";
              topHighlight = "#ffffff";
              shadowColor = "#cbb8e4";
            }

            // Draw Base Cloud Cell
            ctx.fillStyle = bodyColor;
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

            // Cloud Bottom & Underside Shadow
            if (bottomIsAir || (y > 4 && (x + y) % 5 === 0)) {
              ctx.fillStyle = shadowColor;
              ctx.fillRect(px, py + CELL_SIZE - 2.5, CELL_SIZE, 2.5);
            }

            // Cloud Top Crest (Puffy Bright Highlight)
            if (topIsAir) {
              ctx.fillStyle = topHighlight;
              ctx.fillRect(px, py, CELL_SIZE, 3);

              // Rounded fluffy puff cap
              ctx.beginPath();
              ctx.arc(px + CELL_SIZE / 2, py + 1, CELL_SIZE / 2 + 1.2, Math.PI, 0);
              ctx.fill();
            }

            // Cloud Left/Right Puffy Edges
            if (leftIsAir) {
              ctx.fillStyle = topHighlight;
              ctx.beginPath();
              ctx.arc(px + 1, py + CELL_SIZE / 2, CELL_SIZE / 2, Math.PI * 0.5, Math.PI * 1.5);
              ctx.fill();
            }
            if (rightIsAir) {
              ctx.fillStyle = bodyColor;
              ctx.beginPath();
              ctx.arc(px + CELL_SIZE - 1, py + CELL_SIZE / 2, CELL_SIZE / 2, -Math.PI * 0.5, Math.PI * 0.5);
              ctx.fill();
            }

            // Occasional glittering star embedded inside the clouds
            if ((x * 13 + y * 23) % 73 === 0) {
              ctx.fillStyle = "#fef08a";
              ctx.fillRect(px + 4, py + 4, 2, 2);
            }
          } else if (type === CELL_ROCK) {
            // ================= SKY PALACE CARVED MOONSTONE STONE =================
            ctx.fillStyle = "#3e3260";
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

            // Carved stone brick pattern
            ctx.fillStyle = "#5c4a8a";
            ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            // Golden rune / glowing palace trim
            if ((x + y) % 4 === 0) {
              ctx.fillStyle = "#f59e0b";
              ctx.fillRect(px + 3, py + 3, 2, 2);
            }
          } else if (type === CELL_WOOD) {
            // ================= PALACE BALUSTRADE / TERRACE WOOD =================
            ctx.fillStyle = "#b45309";
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
            ctx.fillStyle = "#fde68a";
            ctx.fillRect(px, py, CELL_SIZE, 2);
            ctx.fillStyle = "#78350f";
            ctx.fillRect(px, py + CELL_SIZE - 2, CELL_SIZE, 2);
          }
        }
      }

      // ================= F. CELESTIAL STAR DUCKS =================
      ducks.forEach((duck) => {
        const dx = duck.x * CELL_SIZE;
        const dy = duck.y * CELL_SIZE;

        ctx.save();
        ctx.translate(dx, dy);

        // Water absorption glow aura
        if (duck.fillLevel > 0 && !duck.isCollected) {
          ctx.beginPath();
          ctx.arc(0, 0, 20 * duck.fillLevel, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(56, 189, 248, 0.45)";
          ctx.fill();
        }

        // Golden halo above duck
        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(3, -11, 7, 2.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Duck Body
        ctx.fillStyle = duck.isCollected ? "#fde047" : "#eab308";
        ctx.beginPath();
        ctx.ellipse(0, 2, 11, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Duck Head
        ctx.beginPath();
        ctx.arc(5, -4, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Angel Feather Wing
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(-3, 1, 4.5, 3, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.ellipse(11, -3, 4, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = "#1e1b4b";
        ctx.beginPath();
        ctx.arc(5, -5, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(5.5, -5.5, 1, 1);

        // Sparkle Star on collection
        if (duck.isCollected) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px sans-serif";
          ctx.fillText("✨", -7, -13);
        }

        ctx.restore();
      });

      // ================= G. CELESTIAL STARLIGHT WATER STREAM =================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const px = p.x * CELL_SIZE;
        const py = p.y * CELL_SIZE;

        // Glowing outer halo
        ctx.fillStyle = "rgba(56, 189, 248, 0.38)";
        ctx.beginPath();
        ctx.arc(px, py, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Luminous cyan body
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(px, py, 3.8, 0, Math.PI * 2);
        ctx.fill();

        // Pure white starlight core
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px - 1.2, py - 1.2, 2.4, 2.4);
      }

      // ================= H. CLOUD MIST PUFFS & STAR DUST PARTICLES =================
      crumbsRef.current.forEach((c) => {
        const alpha = Math.max(0, c.life / c.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;

        if (c.isStar) {
          // 4-point star sparkle
          ctx.fillStyle = c.color;
          ctx.fillRect(c.x - c.radius * 1.6, c.y - 0.6, c.radius * 3.2, 1.2);
          ctx.fillRect(c.x - 0.6, c.y - c.radius * 1.6, 1.2, c.radius * 3.2);
        } else {
          // Soft fluffy expanding cloud puff
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // ================= I. TUB INTAKE ZONE GUIDE =================
      // Soft starry dotted guide line indicating where water should flow
      ctx.strokeStyle = "rgba(103, 232, 249, 0.65)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.strokeRect(
        tubX * CELL_SIZE,
        tubY * CELL_SIZE,
        tubWidth * CELL_SIZE,
        tubHeight * CELL_SIZE
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
  }, [W, H, CELL_SIZE, tubX, tubY, tubWidth, tubHeight, targetWater, onLevelComplete]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none touch-none bg-[#0e0b20]">
      {/* 1. Fullscreen Diggable HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={viewport.width}
        height={viewport.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-crosshair block"
      />

      {/* 2. The 1:1 Exact Pixel Girl Sitting on Top of the Clouds in her Bath */}
      <div
        className="absolute pointer-events-none transition-all duration-150"
        style={{
          left: `${tubX * CELL_SIZE - 20}px`,
          top: `${tubY * CELL_SIZE - 95}px`,
          width: `${tubWidth * CELL_SIZE + 40}px`,
          height: "140px",
        }}
      >
        <PixelGirl isBathing={isVictory} waterLevel={waterPercent} size={tubWidth * CELL_SIZE + 40} />
      </div>

      {/* 3. Floating Glassmorphism HUD at Top (Non-intrusive, full width) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-30">
        {/* Left: Level Title & Back to Lobby */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href="/"
            className="px-3 py-1.5 rounded-full bg-[#1e133d]/80 hover:bg-[#2d1b54] text-xs font-black text-indigo-200 hover:text-white border border-indigo-400/40 backdrop-blur-md shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1"
          >
            ← 街机大厅
          </a>
          <div className="px-3 py-1 rounded-full bg-[#1e133d]/85 text-xs font-black text-amber-300 border border-amber-400/50 backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <span>🌙</span>
            <span>{level.name}</span>
          </div>
        </div>

        {/* Center: 3 Celestial Star Ducks */}
        <div className="flex items-center gap-2.5 bg-[#171032]/85 px-4 py-1.5 rounded-full border border-indigo-400/40 shadow-lg backdrop-blur-md pointer-events-auto">
          {ducksState.map((duck, i) => (
            <span
              key={duck.id || i}
              className={`text-2xl transition-transform ${
                duck.isCollected
                  ? "scale-110 drop-shadow-[0_0_10px_#fde047]"
                  : "opacity-25 grayscale"
              }`}
              title={duck.isCollected ? "已收集星羽小鸭！" : "引导水流浸润小鸭收集"}
            >
              🐥
            </span>
          ))}
        </div>

        {/* Right: Water Tank Meter & Reset Button */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2.5 bg-[#171032]/85 px-4 py-1.5 rounded-full border border-cyan-400/40 shadow-lg backdrop-blur-md">
            <span className="text-xs font-bold text-cyan-300">浴池蓄水:</span>
            <div className="w-24 h-4 bg-[#0c081e] rounded-full border border-cyan-400/60 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 rounded-full transition-all duration-150 shadow-[0_0_8px_#38bdf8]"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
            <span className="text-xs font-black text-cyan-200">{waterPercent}%</span>
          </div>

          <button
            onClick={() => {
              bathAudio.pop();
              initLevel();
              onRestart();
            }}
            className="w-9 h-9 rounded-full bg-[#1e133d]/85 hover:bg-[#2d1b54] border-2 border-amber-400 text-amber-300 font-black text-sm flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.5)] active:scale-90 transition-transform"
            title="重玩本关 / Reset Level"
          >
            ↺
          </button>
        </div>
      </div>

      {/* 4. Bottom Hint Floating Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-[#181136]/80 backdrop-blur-md border border-indigo-400/30 text-[11px] font-bold text-indigo-200/90 pointer-events-none z-30 shadow-lg flex items-center gap-3">
        <span>☁️ 鼠标在天空中按住划动，可将白云与梦幻彩云挖开</span>
        <span>•</span>
        <span>✨ 引导天泉瀑布穿过云间，流向云端上小女孩的浴池！</span>
      </div>
    </div>
  );
}
