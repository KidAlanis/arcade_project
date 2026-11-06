"use client";

import React from "react";

/**
 * EXACT pixel art paths reconstructed pixel-for-pixel from the user's uploaded image.
 * Sprite dimensions: 31 columns x 40 rows.
 * Palette matched directly to the original colors with crisp pixel rendering.
 */
export const PIXEL_GIRL_PATHS: Record<string, { color: string; d: string; label: string }> = {
  K: {
    color: "#110e10",
    label: "Black outline & hair strands",
    d: "M13 0h8v1h-8zM10 1h3v1h-3zM21 1h2v1h-2zM8 2h2v1h-2zM23 2h2v1h-2zM7 3h1v1h-1zM25 3h1v1h-1zM6 4h1v1h-1zM26 4h1v1h-1zM5 5h1v1h-1zM27 5h1v1h-1zM4 6h1v1h-1zM28 6h1v1h-1zM3 7h1v1h-1zM29 7h1v1h-1zM3 8h1v1h-1zM29 8h1v1h-1zM3 9h1v1h-1zM14 9h1v1h-1zM29 9h1v1h-1zM2 10h1v1h-1zM13 10h1v1h-1zM30 10h1v1h-1zM2 11h1v1h-1zM12 11h1v1h-1zM16 11h1v1h-1zM30 11h1v1h-1zM2 12h1v1h-1zM12 12h1v1h-1zM16 12h1v1h-1zM30 12h1v1h-1zM2 13h1v1h-1zM11 13h1v1h-1zM15 13h1v1h-1zM19 13h1v1h-1zM30 13h1v1h-1zM2 14h1v1h-1zM11 14h1v1h-1zM14 14h1v1h-1zM20 14h1v1h-1zM30 14h1v1h-1zM2 15h1v1h-1zM10 15h1v1h-1zM12 15h2v1h-2zM15 15h7v1h-7zM30 15h1v1h-1zM3 16h1v1h-1zM9 16h1v1h-1zM22 16h2v1h-2zM30 16h1v1h-1zM0 17h1v1h-1zM3 17h1v1h-1zM9 17h1v1h-1zM24 17h1v1h-1zM29 17h1v1h-1zM1 18h1v1h-1zM3 18h1v1h-1zM5 18h2v1h-2zM8 18h1v1h-1zM24 18h1v1h-1zM29 18h1v1h-1zM2 19h1v1h-1zM4 19h1v1h-1zM8 19h1v1h-1zM25 19h1v1h-1zM27 19h2v1h-2zM2 20h1v1h-1zM4 20h1v1h-1zM8 20h1v1h-1zM25 20h1v1h-1zM29 20h1v1h-1zM1 21h1v1h-1zM5 21h2v1h-2zM8 21h1v1h-1zM25 21h1v1h-1zM29 21h1v1h-1zM1 22h1v1h-1zM8 22h1v1h-1zM25 22h1v1h-1zM27 22h2v1h-2zM1 23h1v1h-1zM9 23h1v1h-1zM25 23h2v1h-2zM2 24h1v1h-1zM9 24h1v1h-1zM25 24h1v1h-1zM3 25h1v1h-1zM7 25h2v1h-2zM24 25h1v1h-1zM23 26h1v1h-1z",
  },
  H: {
    color: "#362a29",
    label: "Dark hair fill",
    d: "M13 1h8v1h-8zM10 2h13v1h-13zM8 3h17v1h-17zM7 4h19v1h-19zM6 5h21v1h-21zM5 6h23v1h-23zM4 7h3v1h-3zM8 7h12v1h-12zM22 7h7v1h-7zM4 8h3v1h-3zM10 8h10v1h-10zM23 8h1v1h-1zM26 8h3v1h-3zM4 9h4v1h-4zM11 9h3v1h-3zM15 9h5v1h-5zM23 9h1v1h-1zM26 9h3v1h-3zM3 10h10v1h-10zM14 10h16v1h-16zM3 11h9v1h-9zM13 11h3v1h-3zM17 11h13v1h-13zM3 12h9v1h-9zM13 12h3v1h-3zM17 12h13v1h-13zM3 13h8v1h-8zM12 13h3v1h-3zM16 13h3v1h-3zM20 13h6v1h-6zM27 13h3v1h-3zM3 14h8v1h-8zM12 14h2v1h-2zM15 14h5v1h-5zM21 14h4v1h-4zM26 14h4v1h-4zM3 15h7v1h-7zM22 15h2v1h-2zM25 15h5v1h-5zM4 16h5v1h-5zM24 16h6v1h-6zM4 17h5v1h-5zM25 17h4v1h-4zM4 18h1v1h-1zM7 18h1v1h-1zM25 18h4v1h-4zM3 19h1v1h-1zM7 19h1v1h-1zM26 19h1v1h-1zM3 20h1v1h-1zM7 20h1v1h-1zM26 20h1v1h-1zM2 21h3v1h-3zM7 21h1v1h-1zM26 21h1v1h-1zM2 22h6v1h-6zM26 22h1v1h-1zM2 23h7v1h-7zM3 24h6v1h-6zM4 25h3v1h-3z",
  },
  W: {
    color: "#ffffff",
    label: "White highlights / shirt / polka dots / shoes",
    d: "M7 7h1v1h-1zM20 7h2v1h-2zM7 8h3v1h-3zM20 8h3v1h-3zM24 8h2v1h-2zM8 9h3v1h-3zM20 9h3v1h-3zM24 9h2v1h-2zM10 24h1v1h-1zM24 24h1v1h-1zM9 25h4v1h-4zM21 25h3v1h-3zM10 26h3v1h-3zM19 26h4v1h-4zM10 27h2v1h-2zM16 27h1v1h-1zM18 27h6v1h-6zM10 28h3v1h-3zM14 28h2v1h-2zM19 28h5v1h-5zM12 29h1v1h-1zM14 29h2v1h-2zM17 29h1v1h-1zM19 29h3v1h-3zM14 30h2v1h-2zM19 30h2v1h-2zM15 31h6v1h-6zM16 33h1v1h-1zM20 33h1v1h-1zM14 34h1v1h-1zM18 34h1v1h-1zM15 36h1v1h-1zM14 37h1v1h-1zM19 37h1v1h-1zM14 39h3v1h-3zM18 39h3v1h-3z",
  },
  R: {
    color: "#cb1639",
    label: "Red hair clip",
    d: "M26 13h1v1h-1zM25 14h1v1h-1zM24 15h1v1h-1z",
  },
  F: {
    color: "#fff5ee",
    label: "Fair skin",
    d: "M11 15h1v1h-1zM14 15h1v1h-1zM10 16h12v1h-12zM10 17h14v1h-14zM9 18h3v1h-3zM14 18h7v1h-7zM23 18h1v1h-1zM5 19h2v1h-2zM9 19h3v1h-3zM14 19h7v1h-7zM23 19h2v1h-2zM5 20h2v1h-2zM9 20h3v1h-3zM14 20h7v1h-7zM23 20h2v1h-2zM27 20h2v1h-2zM9 21h2v1h-2zM14 21h7v1h-7zM24 21h1v1h-1zM27 21h2v1h-2zM9 22h2v1h-2zM14 22h3v1h-3zM18 22h3v1h-3zM24 22h1v1h-1zM11 23h13v1h-13zM13 24h8v1h-8zM14 26h2v1h-2zM17 26h1v1h-1zM12 27h1v1h-1zM14 27h2v1h-2zM11 30h2v1h-2zM21 30h2v1h-2zM10 31h3v1h-3zM21 31h3v1h-3zM10 32h2v1h-2zM22 32h3v1h-3z",
  },
  S: {
    color: "#b3a398",
    label: "Chin shadow",
    d: "M10 23h1v1h-1zM24 23h1v1h-1zM11 24h2v1h-2zM21 24h3v1h-3zM13 25h8v1h-8z",
  },
  P: {
    color: "#fca7b5",
    label: "Soft blush",
    d: "M11 21h3v1h-3zM21 21h3v1h-3zM11 22h3v1h-3zM21 22h3v1h-3z",
  },
  M: {
    color: "#ce9ba5",
    label: "Mouth",
    d: "M17 22h1v1h-1z",
  },
  E: {
    color: "#604743",
    label: "Warm brown eyes",
    d: "M12 18h2v1h-2zM21 18h2v1h-2zM12 19h2v1h-2zM21 19h2v1h-2zM12 20h2v1h-2zM21 20h2v1h-2z",
  },
  N: {
    color: "#848287",
    label: "Silver necklace & pendant",
    d: "M16 26h1v1h-1zM18 26h1v1h-1zM17 27h1v1h-1zM16 28h3v1h-3zM16 29h1v1h-1zM18 29h1v1h-1zM16 30h3v1h-3z",
  },
  A: {
    color: "#b7b7b8",
    label: "Arm & hand outline",
    d: "M11 29h1v1h-1zM22 29h1v1h-1zM10 30h1v1h-1zM23 30h1v1h-1zM9 31h1v1h-1zM24 31h1v1h-1zM9 32h1v1h-1zM21 32h1v1h-1zM25 32h1v1h-1zM10 33h2v1h-2zM22 33h2v1h-2z",
  },
  B: {
    color: "#4d3d26",
    label: "Brown crossbody strap & purse",
    d: "M13 26h1v1h-1zM13 27h1v1h-1zM13 28h1v1h-1zM13 29h1v1h-1zM13 30h1v1h-1zM13 31h2v1h-2zM12 32h3v1h-3zM12 33h2v1h-2z",
  },
  U: {
    color: "#17447e",
    label: "Navy blue pants",
    d: "M15 32h6v1h-6zM14 33h2v1h-2zM17 33h3v1h-3zM15 34h2v1h-2zM19 34h3v1h-3zM14 35h3v1h-3zM18 35h4v1h-4zM14 36h1v1h-1zM16 36h1v1h-1zM18 36h4v1h-4zM15 37h2v1h-2zM18 37h1v1h-1zM20 37h2v1h-2z",
  },
  D: {
    color: "#053a76",
    label: "Pants dark seam & hem",
    d: "M21 33h1v1h-1zM13 34h1v1h-1zM17 34h1v1h-1zM22 34h1v1h-1zM13 35h1v1h-1zM17 35h1v1h-1zM22 35h1v1h-1zM13 36h1v1h-1zM17 36h1v1h-1zM22 36h1v1h-1zM13 37h1v1h-1zM17 37h1v1h-1zM22 37h1v1h-1zM13 38h9v1h-9z",
  },
};

/**
 * Standalone Exact Pixel Girl component.
 * Renders the 100% faithful pixel girl from the uploaded image.
 */
export function ExactPixelGirl({
  size = 120,
  showBackground = false,
  className = "",
}: {
  size?: number;
  showBackground?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: (size * 40) / 31 }}
    >
      <svg
        viewBox="0 0 31 40"
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
        shapeRendering="crispEdges"
      >
        {showBackground && (
          <defs>
            <radialGradient id="pixelBgGlow" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#f3f4fa" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#dbe0f5" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#c5ccf0" stopOpacity="1" />
            </radialGradient>
          </defs>
        )}
        {showBackground && (
          <rect width="31" height="40" fill="url(#pixelBgGlow)" />
        )}
        {Object.entries(PIXEL_GIRL_PATHS).map(([key, item]) => (
          <path key={key} d={item.d} fill={item.color} />
        ))}
      </svg>
    </div>
  );
}

interface PixelGirlProps {
  isBathing?: boolean;
  waterLevel?: number; // 0 to 100
  size?: number;
  standalone?: boolean;
}

/**
 * PixelGirl component for Cabinet 01 "Pixel Bath".
 * Renders the exact 1-to-1 pixel character from the uploaded photo,
 * placed inside the Dreamio celestial cloud bath pavilion.
 */
export function PixelGirl({
  isBathing = false,
  waterLevel = 0,
  size = 120,
  standalone = false,
}: PixelGirlProps) {
  if (standalone) {
    return <ExactPixelGirl size={size} />;
  }

  return (
    <div
      className="relative flex flex-col items-center justify-end select-none"
      style={{ width: size, height: size * 1.15 }}
    >
      {/* Victory Bathing Celebration (Bubbles + Heart floating gently) */}
      {isBathing && (
        <div className="absolute -top-9 flex items-center gap-2 pointer-events-none z-20 animate-bounce">
          <span className="text-cyan-200 text-lg drop-shadow-[0_0_8px_#38bdf8]">🫧</span>
          <span className="text-pink-300 text-sm font-black drop-shadow-[0_0_6px_#f472b6]">♥</span>
          <span className="text-amber-200 text-base drop-shadow-[0_0_8px_#fde047]">✨</span>
          <span className="text-cyan-200 text-xl drop-shadow-[0_0_8px_#38bdf8]">🫧</span>
        </div>
      )}

      {/* Main SVG Scene: Exact Pixel Character (1:1 from uploaded photo) in Celestial Cloud Bath */}
      <svg
        viewBox="0 0 100 115"
        className="w-full h-full drop-shadow-xl overflow-visible"
        style={{ imageRendering: "pixelated" }}
        shapeRendering="crispEdges"
      >
        <defs>
          <filter id="pixelDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#180e29" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* ================= EXACT 1:1 PIXEL CHARACTER ================= */}
        {/*
          Width: 31px * 2 = 62px. Height: 40px * 2 = 80px.
          Position: x = 19 (centered in 100px wide viewBox), y = 2.
          Feet land right at y = 82 (the floor of the cloud bath).
        */}
        <g transform="translate(19, 2) scale(2)">
          {Object.entries(PIXEL_GIRL_PATHS).map(([key, item]) => (
            <path key={key} d={item.d} fill={item.color} />
          ))}
        </g>

        {/* ================= DREAMIO CELESTIAL CLOUD HOT SPRING BATH ================= */}
        <g transform="translate(6, 72)">
          {/* 1. Underlying Soft Floating Cloud Base Cushion */}
          <g fill="#ffffff" opacity="0.95">
            <circle cx="10" cy="38" r="9" />
            <circle cx="26" cy="40" r="10" />
            <circle cx="44" cy="41" r="10.5" />
            <circle cx="62" cy="40" r="10" />
            <circle cx="78" cy="38" r="9" />
            {/* Soft pink/lavender cloud shading underbelly */}
            <ellipse cx="44" cy="44" rx="42" ry="4" fill="#c4b5fd" opacity="0.5" />
          </g>

          {/* 2. Tub Back wall (Warm Cedar & Moonstone Inlay) */}
          <rect x="6" y="2" width="76" height="36" rx="8" fill="#6d4830" stroke="#2a1608" strokeWidth="2.5" />

          {/* 3. Water inside tub (Shimmering Starlight Cyan) */}
          <rect
            x="8"
            y={24 - (waterLevel / 100) * 16}
            width="72"
            height={14 + (waterLevel / 100) * 16}
            rx="4"
            fill="#38bdf8"
            opacity="0.92"
          />
          {/* Water reflection ripples */}
          <line
            x1="14"
            y1={26 - (waterLevel / 100) * 16}
            x2="32"
            y2={26 - (waterLevel / 100) * 16}
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1="48"
            y1={27 - (waterLevel / 100) * 16}
            x2="58"
            y2={27 - (waterLevel / 100) * 16}
            stroke="#e0f2fe"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* 4. Tub Front Wooden Planks (Warm palace terrace woodwork) */}
          <rect x="4" y="10" width="80" height="28" rx="6" fill="#8c5832" stroke="#2a1608" strokeWidth="2.5" />
          {/* Vertical wood grain grooves */}
          <line x1="24" y1="10" x2="24" y2="38" stroke="#5c3518" strokeWidth="1.8" />
          <line x1="44" y1="10" x2="44" y2="38" stroke="#5c3518" strokeWidth="1.8" />
          <line x1="64" y1="10" x2="64" y2="38" stroke="#5c3518" strokeWidth="1.8" />

          {/* Golden Palace Brass Ring Bands */}
          <rect x="3" y="15" width="82" height="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" />
          <rect x="3" y="28" width="82" height="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" />

          {/* 5. Terrace Hydrangea Flowers on Tub corners (matching uploaded sky city) */}
          {/* Left Flower Cluster (Pink & Periwinkle) */}
          <g transform="translate(1, 14)">
            <circle cx="2" cy="0" r="3" fill="#f472b6" />
            <circle cx="6" cy="-2" r="3" fill="#c084fc" />
            <circle cx="0" cy="4" r="2.5" fill="#f472b6" />
            <circle cx="5" cy="3" r="2.5" fill="#60a5fa" />
            <circle cx="3" cy="1" r="1.2" fill="#fef08a" />
          </g>

          {/* Right Flower Cluster & Mini Fairy Lantern */}
          <g transform="translate(76, 12)">
            <circle cx="3" cy="0" r="3" fill="#f472b6" />
            <circle cx="6" cy="4" r="2.8" fill="#60a5fa" />
            <circle cx="1" cy="4" r="2.5" fill="#c084fc" />
            <circle cx="3" cy="2" r="1.2" fill="#fef08a" />
            {/* Glowing fairy lantern on right post */}
            <rect x="5" y="-10" width="6" height="8" rx="2" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
            <polygon points="8,-13 4,-10 12,-10" fill="#b45309" />
          </g>

          {/* 6. Cute Yellow Rubber Duck floating in tub */}
          <g transform={`translate(58, ${12 - (waterLevel / 100) * 6})`}>
            <ellipse cx="6" cy="6" rx="6" ry="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1.2" />
            <circle cx="8" cy="3" r="3.5" fill="#fde047" stroke="#78350f" strokeWidth="1.2" />
            <polygon points="11,3 14,4 11,5" fill="#ea580c" />
            <circle cx="9" cy="2.5" r="0.7" fill="#000" />
            {/* Tiny star sparkle on duck */}
            <circle cx="3" cy="4" r="0.8" fill="#ffffff" />
          </g>

          {/* 7. Soap Bubbles rising when bathing */}
          {isBathing && (
            <g fill="#ffffff" stroke="#67e8f9" strokeWidth="1.2">
              <circle cx="16" cy="8" r="3.5" />
              <circle cx="21" cy="5" r="2.5" />
              <circle cx="28" cy="9" r="3" />
              <circle cx="48" cy="7" r="2.5" />
              <circle cx="38" cy="4" r="2" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
