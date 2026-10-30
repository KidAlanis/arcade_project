"use client";

import React from "react";

interface PixelGirlProps {
  isBathing?: boolean;
  waterLevel?: number; // 0 to 100
  size?: number;
}

export function PixelGirl({ isBathing = false, waterLevel = 0, size = 120 }: PixelGirlProps) {
  return (
    <div
      className="relative flex flex-col items-center justify-end select-none"
      style={{ width: size, height: size * 1.15 }}
    >
      {/* State 1: ANGRY before bathing (红色的 💢) */}
      {!isBathing && (
        <div className="absolute -top-7 right-3 pointer-events-none z-20 animate-bounce">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            {/* Pixel Angry Vein Mark 💢 */}
            <path
              d="M3 7 H8 V3 H10 V8 H3 Z"
              fill="#e11d48"
              stroke="#881337"
              strokeWidth="1.2"
            />
            <path
              d="M16 3 H14 V8 H21 V7 H16 Z"
              fill="#e11d48"
              stroke="#881337"
              strokeWidth="1.2"
            />
            <path
              d="M3 16 H8 V21 H10 V16 H3 Z"
              fill="#e11d48"
              stroke="#881337"
              strokeWidth="1.2"
            />
            <path
              d="M16 21 H14 V16 H21 V17 H16 Z"
              fill="#e11d48"
              stroke="#881337"
              strokeWidth="1.2"
            />
            <circle cx="12" cy="12" r="2.5" fill="#e11d48" />
          </svg>
        </div>
      )}

      {/* State 2: HAPPY after bathing (微笑 + 像素泡泡) */}
      {isBathing && (
        <div className="absolute -top-8 flex items-center gap-2 pointer-events-none z-20 animate-pulse">
          {/* Pixel Bubbles */}
          <span className="text-cyan-300 text-base drop-shadow-md">🫧</span>
          <span className="text-pink-400 text-sm font-bold">♥</span>
          <span className="text-cyan-200 text-lg drop-shadow-md">🫧</span>
        </div>
      )}

      {/* Main Pixel Character matching uploaded photo */}
      <svg
        viewBox="0 0 100 115"
        className="w-full h-full drop-shadow-lg overflow-visible"
        style={{ imageRendering: "pixelated" }}
      >
        <defs>
          <filter id="pixelDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ================= EXACT PIXEL CHARACTER (from uploaded photo) ================= */}
        <g transform="translate(18, 2)">
          {/* 1. HAIR BASE (Black/Dark charcoal rounded silhouette) */}
          {/* Main Hair Volume */}
          <path
            d="M 12 18 C 12 4 48 4 48 18 C 58 18 64 26 64 38 C 64 50 56 56 52 58 L 52 48 L 48 48 L 48 42 L 12 42 L 12 48 L 8 48 C 8 52 4 48 4 38 C 4 26 8 18 12 18 Z"
            fill="#262121"
            stroke="#120e0e"
            strokeWidth="2.4"
          />

          {/* Left Hair Bun / Ponytail Curl (Distinctive left bun from photo) */}
          <g transform="translate(-4, 38)">
            <ellipse cx="9" cy="12" rx="9" ry="9" fill="#262121" stroke="#120e0e" strokeWidth="2.2" />
            {/* White/pink hair tie at the bun junction */}
            <rect x="12" y="8" width="4" height="4" rx="1" fill="#fce4ec" stroke="#120e0e" strokeWidth="1" />
            {/* Detached cute stray pixel strand sticking out left */}
            <rect x="-3" y="4" width="3" height="3" fill="#120e0e" />
          </g>

          {/* Right Hair Side Tail Strand (bottom right curl from photo) */}
          <path d="M 52 56 L 50 64 L 48 64" stroke="#120e0e" strokeWidth="2.2" strokeLinecap="square" fill="none" />

          {/* 2. HAIR HIGHLIGHTS (Exact shapes from photo) */}
          {/* Left Angular Highlight Shape */}
          <path
            d="M 14 16 L 22 16 L 22 22 L 18 22 L 18 20 L 14 20 Z"
            fill="#ffffff"
          />

          {/* Right Dual Block Highlights (One tall block + one square block) */}
          <rect x="42" y="16" width="7" height="8" rx="0.5" fill="#ffffff" />
          <rect x="51" y="18" width="5" height="5" rx="0.5" fill="#ffffff" />

          {/* 3. RED DIAGONAL HAIR CLIP on right side (Exact 3-4 red pixels from photo) */}
          <g transform="translate(50, 28)">
            <rect x="0" y="6" width="3" height="3" fill="#e11d48" />
            <rect x="2.5" y="3.5" width="3" height="3" fill="#e11d48" />
            <rect x="5" y="1" width="3" height="3" fill="#e11d48" />
            <rect x="7.5" y="-1.5" width="3" height="3" fill="#e11d48" />
          </g>

          {/* 4. FACE & EARS */}
          {/* Tiny ear tabs on left and right */}
          <rect x="9" y="38" width="4" height="6" rx="1" fill="#fff5f0" stroke="#262121" strokeWidth="1.2" />
          <rect x="50" y="38" width="4" height="6" rx="1" fill="#fff5f0" stroke="#262121" strokeWidth="1.2" />

          {/* Fair Skin Face Rectangle */}
          <rect x="13" y="30" width="38" height="28" rx="4" fill="#fff6f2" stroke="#262121" strokeWidth="2.2" />

          {/* Straight-across dark bangs bottom edge */}
          <path
            d="M 13 32 L 20 32 L 22 36 L 36 36 L 38 32 L 50 32 L 50 30 L 13 30 Z"
            fill="#262121"
          />

          {/* Soft Pink Blush on Cheeks (Rectangular pixel blush from photo) */}
          <rect x="15" y="44" width="7" height="4" rx="1" fill="#fbb6ce" opacity="0.85" />
          <rect x="41" y="44" width="7" height="4" rx="1" fill="#fbb6ce" opacity="0.85" />

          {/* EYES & MOUTH based on state */}
          {!isBathing ? (
            /* ANGRY STATE: Furrowed grumpy pixel eyes & pouty mouth */
            <g>
              {/* Left Eye: Angry slanted square */}
              <rect x="18" y="37" width="5" height="6" fill="#3a2e2e" />
              <line x1="16" y1="35" x2="24" y2="38" stroke="#262121" strokeWidth="2" strokeLinecap="square" />

              {/* Right Eye: Angry slanted square */}
              <rect x="40" y="37" width="5" height="6" fill="#3a2e2e" />
              <line x1="47" y1="35" x2="39" y2="38" stroke="#262121" strokeWidth="2" strokeLinecap="square" />

              {/* Pouting grumpy mouth */}
              <rect x="30" y="47" width="3" height="3" fill="#b97a7a" />
            </g>
          ) : (
            /* HAPPY STATE: Smiling curved crescent eyes (^ ^) & happy smile */
            <g>
              {/* Left Smiling Eye */}
              <path d="M 17 40 Q 21 35 24 40" stroke="#262121" strokeWidth="2.5" strokeLinecap="square" fill="none" />
              {/* Right Smiling Eye */}
              <path d="M 39 40 Q 43 35 46 40" stroke="#262121" strokeWidth="2.5" strokeLinecap="square" fill="none" />
              {/* Happy Open Smiling Mouth */}
              <rect x="29" y="46" width="6" height="4" rx="2" fill="#e11d48" />
              <rect x="30.5" y="46.5" width="3" height="1.5" fill="#ffffff" />
            </g>
          )}

          {/* 5. BODY & OUTFIT (White shirt, Necklace, Crossbody strap, Polka-dot pants) */}
          <g transform="translate(13, 56)">
            {/* White Shirt Torso */}
            <rect x="6" y="0" width="26" height="15" fill="#ffffff" stroke="#262121" strokeWidth="1.8" />
            {/* Arms */}
            <rect x="0" y="2" width="6" height="9" rx="2" fill="#fff6f2" stroke="#262121" strokeWidth="1.4" />
            <rect x="32" y="2" width="6" height="9" rx="2" fill="#fff6f2" stroke="#262121" strokeWidth="1.4" />

            {/* Silver Square Pendant Necklace (from photo) */}
            <path d="M 17 0 L 19 5 L 21 0" stroke="#718096" strokeWidth="1.2" fill="none" />
            <rect x="17" y="5" width="5" height="6" rx="0.5" fill="#718096" stroke="#262121" strokeWidth="1" />
            <rect x="18.5" y="6.5" width="2" height="3" fill="#ffffff" />

            {/* Brown Crossbody Strap & Purse (from photo) */}
            <line x1="12" y1="0" x2="11" y2="15" stroke="#5d4037" strokeWidth="2.2" strokeLinecap="square" />
            <rect x="8" y="11" width="7" height="6" rx="1" fill="#5d4037" stroke="#3e2723" strokeWidth="1.2" />

            {/* Navy Blue Pants with White Polka-Dots (from photo) */}
            <rect x="10" y="15" width="18" height="16" fill="#1e3a8a" stroke="#262121" strokeWidth="1.8" />
            {/* Pant seam */}
            <line x1="19" y1="21" x2="19" y2="31" stroke="#262121" strokeWidth="1.5" />
            {/* White Polka-dots */}
            <rect x="12" y="18" width="2.5" height="2.5" fill="#ffffff" />
            <rect x="16" y="22" width="2.5" height="2.5" fill="#ffffff" />
            <rect x="12" y="26" width="2.5" height="2.5" fill="#ffffff" />
            <rect x="23" y="18" width="2.5" height="2.5" fill="#ffffff" />
            <rect x="20" y="25" width="2.5" height="2.5" fill="#ffffff" />
            <rect x="24" y="26" width="2.5" height="2.5" fill="#ffffff" />

            {/* Shoes/Feet */}
            <rect x="13" y="31" width="5" height="3" fill="#ffffff" stroke="#262121" strokeWidth="1" />
            <rect x="21" y="31" width="5" height="3" fill="#ffffff" stroke="#262121" strokeWidth="1" />
          </g>
        </g>

        {/* ================= STARDEW WOODEN CEDAR ONEN / TUB ================= */}
        <g transform="translate(6, 72)">
          {/* Tub Back wall */}
          <rect x="6" y="2" width="76" height="36" rx="8" fill="#8d5b32" stroke="#331908" strokeWidth="3" />

          {/* Water inside tub */}
          <rect
            x="8"
            y={24 - (waterLevel / 100) * 16}
            width="72"
            height={14 + (waterLevel / 100) * 16}
            rx="4"
            fill="#38bdf8"
            opacity="0.9"
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
            opacity="0.8"
          />

          {/* Tub Front Wooden Planks */}
          <rect x="4" y="10" width="80" height="30" rx="6" fill="#a46d3e" stroke="#331908" strokeWidth="3" />
          {/* Vertical wood grain grooves */}
          <line x1="24" y1="10" x2="24" y2="40" stroke="#78471c" strokeWidth="2" />
          <line x1="44" y1="10" x2="44" y2="40" stroke="#78471c" strokeWidth="2" />
          <line x1="64" y1="10" x2="64" y2="40" stroke="#78471c" strokeWidth="2" />

          {/* Golden Brass Tub Ring Bands */}
          <rect x="3" y="16" width="82" height="4" fill="#f1c40f" stroke="#331908" strokeWidth="1.8" />
          <rect x="3" y="30" width="82" height="4" fill="#f1c40f" stroke="#331908" strokeWidth="1.8" />

          {/* Cute Yellow Rubber Duck floating in tub */}
          <g transform={`translate(60, ${12 - (waterLevel / 100) * 6})`}>
            <ellipse cx="6" cy="6" rx="6" ry="4" fill="#f39c12" stroke="#331908" strokeWidth="1.2" />
            <circle cx="8" cy="3" r="3.5" fill="#f1c40f" stroke="#331908" strokeWidth="1.2" />
            <polygon points="11,3 14,4 11,5" fill="#e67e22" />
            <circle cx="9" cy="2.5" r="0.6" fill="#000" />
          </g>

          {/* Soap Bubbles rising when bathing */}
          {isBathing && (
            <g fill="#ffffff" stroke="#38bdf8" strokeWidth="1.2">
              <circle cx="16" cy="8" r="3.5" />
              <circle cx="21" cy="5" r="2.5" />
              <circle cx="28" cy="9" r="3" />
              <circle cx="48" cy="7" r="2.5" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
