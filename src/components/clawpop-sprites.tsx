"use client";
import React from "react";
import type { PlushToy } from "@/lib/clawpop-data";

export type PlushExpression = "idle" | "grabbed" | "dropped";

export function PlushSprite({
  toy,
  expression = "idle",
  size = 72,
  className = "",
}: {
  toy: PlushToy;
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  switch (toy.id) {
    case "popu":
      return <PopuSprite expression={expression} size={size} className={className} />;
    case "purin":
      return <PurinSprite expression={expression} size={size} className={className} />;
    case "berry":
      return <BerrySprite expression={expression} size={size} className={className} />;
    case "mame":
      return <MameSprite expression={expression} size={size} className={className} />;
    case "ame":
      return <AmeSprite expression={expression} size={size} className={className} />;
    case "hoshi":
      return <HoshiSprite expression={expression} size={size} className={className} />;
    case "poko":
      return <PokoSprite expression={expression} size={size} className={className} />;
    case "kero":
      return <KeroSprite expression={expression} size={size} className={className} />;
    case "momo":
      return <MomoSprite expression={expression} size={size} className={className} />;
    case "choco":
      return <ChocoSprite expression={expression} size={size} className={className} />;
    case "sora":
      return <SoraSprite expression={expression} size={size} className={className} />;
    case "milky":
    default:
      return <MilkySprite expression={expression} size={size} className={className} />;
  }
}

// 1. Popu - Round Pink Marshmallow Puff (Kirby-inspired)
export function PopuSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`plush-svg ${expression} ${className}`}
      shapeRendering="crispEdges"
    >
      {/* Shadow */}
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />

      {/* Feet */}
      <rect x="11" y="38" width="8" height="6" rx="2" fill="#d92e6b" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="38" width="8" height="6" rx="2" fill="#d92e6b" stroke="#331024" strokeWidth="2" />

      {/* Body */}
      <rect x="8" y="10" width="32" height="30" rx="12" fill="#ff9ec4" stroke="#331024" strokeWidth="2" />
      {/* Body Top Highlight */}
      <rect x="14" y="12" width="12" height="3" fill="#ffc8dd" />

      {/* Arms */}
      {expression === "grabbed" ? (
        <>
          <rect x="5" y="14" width="5" height="7" rx="2" fill="#ff9ec4" stroke="#331024" strokeWidth="2" />
          <rect x="38" y="14" width="5" height="7" rx="2" fill="#ff9ec4" stroke="#331024" strokeWidth="2" />
        </>
      ) : (
        <>
          <rect x="5" y="24" width="5" height="6" rx="2" fill="#ff9ec4" stroke="#331024" strokeWidth="2" />
          <rect x="38" y="24" width="5" height="6" rx="2" fill="#ff9ec4" stroke="#331024" strokeWidth="2" />
        </>
      )}

      {/* Star Hair Clip */}
      <rect x="28" y="8" width="6" height="6" fill="#ffe066" stroke="#331024" strokeWidth="1.5" />
      <rect x="30" y="6" width="2" height="10" fill="#ffe066" />
      <rect x="26" y="10" width="10" height="2" fill="#ffe066" />

      {/* Cheeks */}
      <rect x="12" y="26" width="6" height="3" rx="1" fill="#ff5997" />
      <rect x="30" y="26" width="6" height="3" rx="1" fill="#ff5997" />

      {/* Eyes & Mouth depending on expression */}
      {expression === "grabbed" ? (
        <>
          {/* Surprised big shiny eyes */}
          <rect x="16" y="18" width="4" height="6" rx="1" fill="#331024" />
          <rect x="17" y="19" width="2" height="2" fill="#ffffff" />
          <rect x="28" y="18" width="4" height="6" rx="1" fill="#331024" />
          <rect x="29" y="19" width="2" height="2" fill="#ffffff" />
          {/* Open surprise mouth */}
          <rect x="22" y="26" width="4" height="5" rx="1.5" fill="#991440" />
          <rect x="23" y="28" width="2" height="2" fill="#ff9ec4" />
        </>
      ) : expression === "dropped" ? (
        <>
          {/* Dizzy/wobbly eyes > < */}
          <path d="M16 20 L19 22 L16 24" stroke="#331024" strokeWidth="2" fill="none" />
          <path d="M32 20 L29 22 L32 24" stroke="#331024" strokeWidth="2" fill="none" />
          {/* Wavy mouth */}
          <path d="M21 27 Q24 25 27 27" stroke="#331024" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          {/* Happy anime eyes */}
          <rect x="17" y="19" width="3" height="6" rx="1" fill="#1d1e4e" />
          <rect x="17" y="19" width="2" height="3" fill="#ffffff" />
          <rect x="17" y="23" width="3" height="2" fill="#5890ff" />

          <rect x="28" y="19" width="3" height="6" rx="1" fill="#1d1e4e" />
          <rect x="28" y="19" width="2" height="3" fill="#ffffff" />
          <rect x="28" y="23" width="3" height="2" fill="#5890ff" />

          {/* Sweet smile */}
          <rect x="22" y="26" width="4" height="3" rx="1" fill="#991440" />
          <rect x="23" y="27" width="2" height="2" fill="#ff80b3" />
        </>
      )}
    </svg>
  );
}

// 2. Purin Bear - Custard Pudding Bear with Caramel Sauce
export function PurinSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`plush-svg ${expression} ${className}`}
      shapeRendering="crispEdges"
    >
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />

      {/* Bear Ears */}
      <rect x="10" y="8" width="7" height="7" rx="3" fill="#ffe071" stroke="#331024" strokeWidth="2" />
      <rect x="12" y="10" width="3" height="3" fill="#ffb449" />
      <rect x="31" y="8" width="7" height="7" rx="3" fill="#ffe071" stroke="#331024" strokeWidth="2" />
      <rect x="33" y="10" width="3" height="3" fill="#ffb449" />

      {/* Feet */}
      <rect x="12" y="38" width="7" height="5" rx="2" fill="#f0c242" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="38" width="7" height="5" rx="2" fill="#f0c242" stroke="#331024" strokeWidth="2" />

      {/* Body */}
      <rect x="9" y="13" width="30" height="27" rx="10" fill="#ffe071" stroke="#331024" strokeWidth="2" />

      {/* Caramel Sauce Topping */}
      <path
        d="M10 17 Q17 22 24 18 Q31 22 38 17 L38 13 Q30 9 24 9 Q18 9 10 13 Z"
        fill="#8d491c"
        stroke="#331024"
        strokeWidth="1.5"
      />
      <rect x="14" y="11" width="6" height="2" fill="#b96d36" />

      {/* Arms */}
      <rect x="6" y="24" width="5" height="5" rx="2" fill="#ffe071" stroke="#331024" strokeWidth="2" />
      <rect x="37" y="24" width="5" height="5" rx="2" fill="#ffe071" stroke="#331024" strokeWidth="2" />

      {/* Cheeks */}
      <rect x="13" y="27" width="5" height="3" fill="#ffaa5a" />
      <rect x="30" y="27" width="5" height="3" fill="#ffaa5a" />

      {/* Bear Muzzle */}
      <rect x="20" y="25" width="8" height="6" rx="2" fill="#fff5d0" />
      <rect x="23" y="26" width="2" height="2" fill="#331024" />

      {expression === "grabbed" ? (
        <>
          <rect x="16" y="21" width="3" height="4" fill="#331024" />
          <rect x="29" y="21" width="3" height="4" fill="#331024" />
          <rect x="23" y="29" width="2" height="2" fill="#8d491c" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M16 23 L20 23" stroke="#331024" strokeWidth="2" />
          <path d="M28 23 L32 23" stroke="#331024" strokeWidth="2" />
          <path d="M22 30 Q24 28 26 30" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          {/* Sleepy contented eyes */}
          <path d="M16 23 Q18 20 20 23" stroke="#331024" strokeWidth="2" fill="none" />
          <path d="M28 23 Q30 20 32 23" stroke="#331024" strokeWidth="2" fill="none" />
          <rect x="23" y="29" width="2" height="1" fill="#331024" />
        </>
      )}
    </svg>
  );
}

// 3. Berry Squish - Lavender Kitten Drop with Strawberry Ears
export function BerrySprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`plush-svg ${expression} ${className}`}
      shapeRendering="crispEdges"
    >
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />

      {/* Strawberry Cat Ears */}
      <polygon points="10,16 16,5 21,15" fill="#ff5c8a" stroke="#331024" strokeWidth="2" />
      <rect x="13" y="9" width="2" height="2" fill="#ffe066" />
      <polygon points="27,15 32,5 38,16" fill="#ff5c8a" stroke="#331024" strokeWidth="2" />
      <rect x="33" y="9" width="2" height="2" fill="#ffe066" />

      {/* Feet */}
      <rect x="13" y="38" width="6" height="5" rx="2" fill="#b999fa" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="38" width="6" height="5" rx="2" fill="#b999fa" stroke="#331024" strokeWidth="2" />

      {/* Body */}
      <rect x="9" y="13" width="30" height="27" rx="11" fill="#cdb4ff" stroke="#331024" strokeWidth="2" />
      <rect x="14" y="15" width="10" height="3" fill="#e5d4ff" />

      {/* Kitten tail */}
      <path d="M37 32 Q43 28 41 22" stroke="#331024" strokeWidth="3" fill="none" />
      <path d="M37 32 Q43 28 41 22" stroke="#cdb4ff" strokeWidth="1.5" fill="none" />

      {/* Cheeks */}
      <rect x="13" y="27" width="5" height="3" fill="#ff85b3" />
      <rect x="30" y="27" width="5" height="3" fill="#ff85b3" />

      {/* Whiskers */}
      <rect x="7" y="25" width="4" height="1.5" fill="#331024" />
      <rect x="7" y="28" width="4" height="1.5" fill="#331024" />
      <rect x="37" y="25" width="4" height="1.5" fill="#331024" />
      <rect x="37" y="28" width="4" height="1.5" fill="#331024" />

      {expression === "grabbed" ? (
        <>
          <rect x="16" y="20" width="4" height="4" fill="#331024" />
          <rect x="17" y="21" width="2" height="2" fill="#ffffff" />
          <rect x="28" y="20" width="4" height="4" fill="#331024" />
          <rect x="29" y="21" width="2" height="2" fill="#ffffff" />
          <rect x="23" y="26" width="2" height="3" fill="#ff5c8a" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M15 21 L19 23 L15 25" stroke="#331024" strokeWidth="1.5" fill="none" />
          <path d="M33 21 L29 23 L33 25" stroke="#331024" strokeWidth="1.5" fill="none" />
          <path d="M22 28 Q24 26 26 28" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          {/* Happy winking cat face */}
          <path d="M15 22 Q18 19 21 22" stroke="#331024" strokeWidth="2" fill="none" />
          <rect x="28" y="19" width="3" height="5" rx="1" fill="#331024" />
          <rect x="28" y="19" width="2" height="2" fill="#ffffff" />
          {/* Cat mouth :3 */}
          <path d="M21 27 Q22.5 29 24 27 Q25.5 29 27 27" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

// 4. Mame Bun - Melon Turtle Sweet Bun
export function MameSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`plush-svg ${expression} ${className}`}
      shapeRendering="crispEdges"
    >
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />

      {/* Turtle Flippers */}
      <rect x="7" y="27" width="5" height="8" rx="2" fill="#8de4aa" stroke="#331024" strokeWidth="2" />
      <rect x="36" y="27" width="5" height="8" rx="2" fill="#8de4aa" stroke="#331024" strokeWidth="2" />
      <rect x="13" y="39" width="6" height="5" rx="2" fill="#8de4aa" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="39" width="6" height="5" rx="2" fill="#8de4aa" stroke="#331024" strokeWidth="2" />

      {/* Body / Shell */}
      <rect x="9" y="11" width="30" height="29" rx="12" fill="#b4f8c8" stroke="#331024" strokeWidth="2" />

      {/* Melon Pan Grid Lines */}
      <line x1="16" y1="12" x2="32" y2="28" stroke="#68ce90" strokeWidth="1.5" />
      <line x1="22" y1="12" x2="36" y2="26" stroke="#68ce90" strokeWidth="1.5" />
      <line x1="32" y1="12" x2="16" y2="28" stroke="#68ce90" strokeWidth="1.5" />
      <line x1="26" y1="12" x2="12" y2="26" stroke="#68ce90" strokeWidth="1.5" />

      {/* Cheeks */}
      <rect x="13" y="28" width="5" height="3" fill="#ff9999" />
      <rect x="30" y="28" width="5" height="3" fill="#ff9999" />

      {expression === "grabbed" ? (
        <>
          <rect x="17" y="22" width="3" height="4" fill="#331024" />
          <rect x="28" y="22" width="3" height="4" fill="#331024" />
          <rect x="22" y="28" width="4" height="4" rx="2" fill="#e05353" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M16 23 L20 23" stroke="#331024" strokeWidth="2" />
          <path d="M28 23 L32 23" stroke="#331024" strokeWidth="2" />
          <path d="M22 29 Q24 27 26 29" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          {/* Beady sparkling eyes */}
          <rect x="17" y="22" width="3" height="5" rx="1.5" fill="#331024" />
          <rect x="17" y="22" width="1.5" height="2" fill="#ffffff" />
          <rect x="28" y="22" width="3" height="5" rx="1.5" fill="#331024" />
          <rect x="28" y="22" width="1.5" height="2" fill="#ffffff" />
          {/* Cheerful wide smile */}
          <path d="M21 28 Q24 31 27 28" stroke="#331024" strokeWidth="2" fill="none" />
        </>
      )}
    </svg>
  );
}

// 5. Ame-chan - Dewdrop Dreamer with Ribbon
export function AmeSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`plush-svg ${expression} ${className}`}
      shapeRendering="crispEdges"
    >
      <ellipse cx="24" cy="45" rx="13" ry="3" fill="#1b1226" opacity="0.25" />

      {/* Feet */}
      <rect x="14" y="38" width="6" height="5" rx="2" fill="#69d3cf" stroke="#331024" strokeWidth="2" />
      <rect x="28" y="38" width="6" height="5" rx="2" fill="#69d3cf" stroke="#331024" strokeWidth="2" />

      {/* Droplet Body */}
      <path
        d="M24 7 Q36 21 37 30 Q37 40 24 40 Q11 40 11 30 Q12 21 24 7 Z"
        fill="#a0e7e5"
        stroke="#331024"
        strokeWidth="2"
      />
      <rect x="18" y="16" width="4" height="6" rx="2" fill="#d0f8f7" />

      {/* Ribbon Bow on top-right */}
      <polygon points="31,14 36,11 36,17" fill="#ff6b8b" stroke="#331024" strokeWidth="1.5" />
      <polygon points="39,14 34,11 34,17" fill="#ff6b8b" stroke="#331024" strokeWidth="1.5" />
      <circle cx="35" cy="14" r="2" fill="#ffe066" />

      {/* Cheeks */}
      <rect x="14" y="29" width="4" height="2.5" fill="#ff8ba7" />
      <rect x="30" y="29" width="4" height="2.5" fill="#ff8ba7" />

      {expression === "grabbed" ? (
        <>
          <circle cx="18" cy="24" r="2.5" fill="#331024" />
          <circle cx="30" cy="24" r="2.5" fill="#331024" />
          <circle cx="24" cy="30" r="1.5" fill="#ff6b8b" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M16 25 L20 23" stroke="#331024" strokeWidth="1.5" />
          <path d="M28 23 L32 25" stroke="#331024" strokeWidth="1.5" />
          <path d="M22 30 Q24 28 26 30" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          {/* Sparkling gentle eyes */}
          <rect x="17" y="23" width="3" height="5" rx="1.5" fill="#1b2a47" />
          <rect x="17" y="23" width="1.5" height="2" fill="#ffffff" />
          <rect x="28" y="23" width="3" height="5" rx="1.5" fill="#1b2a47" />
          <rect x="28" y="23" width="1.5" height="2" fill="#ffffff" />
          <path d="M22 29 Q24 31 26 29" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

// 6. Hoshi Poko - Starlight Star-Puff (Rare)
export function HoshiSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`plush-svg ${expression} ${className}`}
      shapeRendering="crispEdges"
    >
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />

      {/* Star Points */}
      <polygon
        points="24,6 30,17 42,19 33,28 36,40 24,34 12,40 15,28 6,19 18,17"
        fill="#ffd384"
        stroke="#331024"
        strokeWidth="2"
      />

      {/* Internal highlight */}
      <polygon points="24,11 27,18 35,20 29,26 24,22" fill="#fff0b8" />

      {/* Little Starry Sparkles on forehead */}
      <rect x="23" y="14" width="2" height="4" fill="#ffffff" />
      <rect x="22" y="15" width="4" height="2" fill="#ffffff" />

      {/* Cheeks */}
      <rect x="16" y="28" width="4" height="2" fill="#ff7f50" />
      <rect x="28" y="28" width="4" height="2" fill="#ff7f50" />

      {expression === "grabbed" ? (
        <>
          <rect x="18" y="22" width="3" height="4" fill="#331024" />
          <rect x="27" y="22" width="3" height="4" fill="#331024" />
          <rect x="23" y="28" width="2" height="3" fill="#d94b26" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M17 24 L21 24" stroke="#331024" strokeWidth="2" />
          <path d="M27 24 L31 24" stroke="#331024" strokeWidth="2" />
          <path d="M22 30 Q24 28 26 30" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          {/* Serene smiling crescent eyes */}
          <path d="M17 24 Q19 21 22 24" stroke="#331024" strokeWidth="2" fill="none" />
          <path d="M26 24 Q29 21 31 24" stroke="#331024" strokeWidth="2" fill="none" />
          <path d="M22 28 Q24 30 26 28" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

// 7. Mechanical Claw Apparatus
export function ClawApparatus({
  isOpen = true,
  hasPlush = false,
  dropProgress = 0, // 0 = at top, 1 = fully dropped
}: {
  isOpen: boolean;
  hasPlush: boolean;
  dropProgress?: number;
}) {
  return (
    <div className="claw-assembly">
      {/* Top Slider Trolley */}
      <svg width="44" height="20" viewBox="0 0 44 20" shapeRendering="crispEdges">
        <rect x="2" y="2" width="40" height="12" fill="#ffb4cf" stroke="#35192d" strokeWidth="2" />
        <rect x="6" y="5" width="32" height="3" fill="#ffe0ed" />
        <circle cx="8" cy="8" r="1.5" fill="#35192d" />
        <circle cx="36" cy="8" r="1.5" fill="#35192d" />
        {/* Wheels on track */}
        <rect x="0" y="0" width="8" height="4" fill="#7d6a86" />
        <rect x="36" y="0" width="8" height="4" fill="#7d6a86" />
        <rect x="18" y="14" width="8" height="5" fill="#ff7da7" stroke="#35192d" strokeWidth="2" />
      </svg>

      {/* Chain Links descending */}
      <div className="claw-chain">
        <div className="chain-link" />
        <div className="chain-link" />
        <div className="chain-link" />
        <div className="chain-link" />
      </div>

      {/* Claw Hub Box & Prongs */}
      <div className={`claw-housing ${isOpen ? "open" : "closed"}`}>
        <svg width="68" height="68" viewBox="0 0 68 68" shapeRendering="crispEdges">
          {/* Metal housing center hub */}
          <rect x="26" y="6" width="16" height="16" rx="2" fill="#ffe066" stroke="#35192d" strokeWidth="2" />
          <rect x="29" y="9" width="10" height="4" fill="#fff9d6" />
          {/* LED light */}
          <circle cx="34" cy="17" r="2.5" fill={hasPlush ? "#52d273" : isOpen ? "#ff5e7e" : "#ffe066"} />

          {/* Left Articulated Arm */}
          <g
            className="claw-arm-left"
            style={{
              transformOrigin: "26px 18px",
              transform: isOpen ? "rotate(-18deg)" : "rotate(14deg)",
              transition: "transform 0.25s ease-out",
            }}
          >
            <rect x="12" y="17" width="16" height="8" rx="2" fill="#ff9ec4" stroke="#35192d" strokeWidth="2" />
            <path
              d="M12 24 L10 38 Q10 46 16 46 L18 43 Q14 43 14 38 L16 24 Z"
              fill="#ff7da7"
              stroke="#35192d"
              strokeWidth="2"
            />
            {/* Rubber grip pad */}
            <rect x="14" y="38" width="4" height="6" fill="#ffe066" />
          </g>

          {/* Right Articulated Arm */}
          <g
            className="claw-arm-right"
            style={{
              transformOrigin: "42px 18px",
              transform: isOpen ? "rotate(18deg)" : "rotate(-14deg)",
              transition: "transform 0.25s ease-out",
            }}
          >
            <rect x="40" y="17" width="16" height="8" rx="2" fill="#ff9ec4" stroke="#35192d" strokeWidth="2" />
            <path
              d="M56 24 L58 38 Q58 46 52 46 L50 43 Q54 43 54 38 L52 24 Z"
              fill="#ff7da7"
              stroke="#35192d"
              strokeWidth="2"
            />
            {/* Rubber grip pad */}
            <rect x="50" y="38" width="4" height="6" fill="#ffe066" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// 8. Prize Chute Graphics (Left side with steel bars and opening)
export function PrizeChuteGraphic({ isDropping = false }: { isDropping?: boolean }) {
  return (
    <div className={`prize-chute-container ${isDropping ? "active-glow" : ""}`}>
      <svg width="76" height="96" viewBox="0 0 76 96" shapeRendering="crispEdges">
        {/* Chute Hole Backing (dark void) */}
        <rect x="4" y="6" width="68" height="84" rx="4" fill="#1b1226" stroke="#52395f" strokeWidth="2" />
        <rect x="8" y="10" width="60" height="76" fill="#0c0714" />

        {/* Safety Gate Bars (as seen in the reference image) */}
        <rect x="12" y="10" width="4" height="76" fill="#d1d5db" stroke="#374151" strokeWidth="1" />
        <rect x="22" y="10" width="4" height="76" fill="#d1d5db" stroke="#374151" strokeWidth="1" />
        <rect x="32" y="10" width="4" height="76" fill="#d1d5db" stroke="#374151" strokeWidth="1" />
        <rect x="42" y="10" width="4" height="76" fill="#d1d5db" stroke="#374151" strokeWidth="1" />
        <rect x="52" y="10" width="4" height="76" fill="#d1d5db" stroke="#374151" strokeWidth="1" />
        <rect x="62" y="10" width="4" height="76" fill="#d1d5db" stroke="#374151" strokeWidth="1" />

        {/* Bar Highlights */}
        <line x1="13" y1="12" x2="13" y2="82" stroke="#ffffff" strokeWidth="1" />
        <line x1="23" y1="12" x2="23" y2="82" stroke="#ffffff" strokeWidth="1" />
        <line x1="33" y1="12" x2="33" y2="82" stroke="#ffffff" strokeWidth="1" />
        <line x1="43" y1="12" x2="43" y2="82" stroke="#ffffff" strokeWidth="1" />

        {/* Chute Label */}
        <rect x="6" y="80" width="64" height="12" fill="#ff7da7" stroke="#35192d" strokeWidth="1.5" />
        <text
          x="38"
          y="89"
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill="#ffffff"
          fontFamily="monospace"
        >
          PRIZE HOLE
        </text>
      </svg>
    </div>
  );
}

// 9. Retro 7-Segment LED Credit Display
export function RetroLedCounter({ value }: { value: number }) {
  const displayVal = Math.max(0, Math.min(99, value));
  return (
    <div className="retro-led-box">
      <span className="retro-led-glow">{displayVal.toString().padStart(2, "0")}</span>
    </div>
  );
}

// 10. Poko Bunny - Strawberry Mochi Bunny
export function PokoSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`plush-svg ${expression} ${className}`} shapeRendering="crispEdges">
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />
      {/* Bunny Ears */}
      <rect x="13" y="4" width="6" height="12" rx="3" fill="#fff5f8" stroke="#331024" strokeWidth="2" />
      <rect x="14" y="5" width="4" height="6" fill="#ff7da7" />
      <rect x="29" y="4" width="6" height="12" rx="3" fill="#fff5f8" stroke="#331024" strokeWidth="2" />
      <rect x="30" y="5" width="4" height="6" fill="#ff7da7" />
      {/* Feet */}
      <rect x="12" y="38" width="7" height="5" rx="2" fill="#ffe2ec" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="38" width="7" height="5" rx="2" fill="#ffe2ec" stroke="#331024" strokeWidth="2" />
      {/* Body */}
      <rect x="8" y="14" width="32" height="26" rx="12" fill="#fff5f8" stroke="#331024" strokeWidth="2" />
      {/* Cheeks */}
      <rect x="12" y="27" width="5" height="3" fill="#ff80b0" />
      <rect x="31" y="27" width="5" height="3" fill="#ff80b0" />
      {/* Face */}
      {expression === "grabbed" ? (
        <>
          <rect x="17" y="21" width="3" height="4" fill="#331024" />
          <rect x="28" y="21" width="3" height="4" fill="#331024" />
          <rect x="23" y="27" width="2" height="3" fill="#ff5997" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M16 23 L20 23" stroke="#331024" strokeWidth="2" />
          <path d="M28 23 L32 23" stroke="#331024" strokeWidth="2" />
          <path d="M22 28 Q24 26 26 28" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <rect x="17" y="21" width="3" height="5" rx="1.5" fill="#331024" />
          <rect x="17" y="21" width="1.5" height="2" fill="#fff" />
          <rect x="28" y="21" width="3" height="5" rx="1.5" fill="#331024" />
          <rect x="28" y="21" width="1.5" height="2" fill="#fff" />
          <rect x="23" y="25" width="2" height="2" fill="#ff7da7" />
          <path d="M21 28 Q22.5 30 24 28 Q25.5 30 27 28" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

// 11. Matcha Kero - Tea Leaf Froggy Puff
export function KeroSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`plush-svg ${expression} ${className}`} shapeRendering="crispEdges">
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />
      {/* Frog Eyes on Top */}
      <circle cx="15" cy="12" r="6" fill="#c2f0c2" stroke="#331024" strokeWidth="2" />
      <circle cx="15" cy="12" r="3.5" fill="#331024" />
      <circle cx="16" cy="11" r="1.5" fill="#fff" />
      <circle cx="33" cy="12" r="6" fill="#c2f0c2" stroke="#331024" strokeWidth="2" />
      <circle cx="33" cy="12" r="3.5" fill="#331024" />
      <circle cx="34" cy="11" r="1.5" fill="#fff" />
      {/* Water Lily flower on head */}
      <circle cx="24" cy="9" r="3" fill="#ffe066" stroke="#331024" strokeWidth="1.5" />
      {/* Feet */}
      <rect x="11" y="38" width="7" height="5" rx="2" fill="#a3e6a3" stroke="#331024" strokeWidth="2" />
      <rect x="30" y="38" width="7" height="5" rx="2" fill="#a3e6a3" stroke="#331024" strokeWidth="2" />
      {/* Round Body */}
      <rect x="8" y="14" width="32" height="26" rx="12" fill="#c2f0c2" stroke="#331024" strokeWidth="2" />
      {/* Cheeks */}
      <rect x="12" y="27" width="5" height="3" rx="1" fill="#ff80b0" />
      <rect x="31" y="27" width="5" height="3" rx="1" fill="#ff80b0" />
      {/* Wide Mouth */}
      {expression === "grabbed" ? (
        <circle cx="24" cy="28" r="4" fill="#331024" />
      ) : expression === "dropped" ? (
        <path d="M19 28 Q24 25 29 28" stroke="#331024" strokeWidth="2" fill="none" />
      ) : (
        <path d="M18 26 Q24 32 30 26" stroke="#331024" strokeWidth="2" fill="none" />
      )}
    </svg>
  );
}

// 12. Momo Peach - Juicy Sweetheart
export function MomoSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`plush-svg ${expression} ${className}`} shapeRendering="crispEdges">
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />
      {/* Green Leaf Sprout on top */}
      <path d="M24 10 Q28 4 34 8 Q32 14 24 10 Z" fill="#69db7c" stroke="#331024" strokeWidth="1.5" />
      <rect x="23" y="8" width="2" height="4" fill="#40c057" />
      {/* Feet */}
      <rect x="12" y="38" width="7" height="5" rx="2" fill="#ff94aa" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="38" width="7" height="5" rx="2" fill="#ff94aa" stroke="#331024" strokeWidth="2" />
      {/* Peach Body with top dimple */}
      <path
        d="M24 13 Q31 9 39 16 Q42 28 36 38 Q24 43 12 38 Q6 28 9 16 Q17 9 24 13 Z"
        fill="#ffc2d1"
        stroke="#331024"
        strokeWidth="2"
      />
      {/* Peach gradient highlight */}
      <rect x="14" y="15" width="10" height="4" rx="2" fill="#ffe3ec" />
      {/* Cheeks */}
      <rect x="13" y="27" width="5" height="3" fill="#ff6b8b" />
      <rect x="30" y="27" width="5" height="3" fill="#ff6b8b" />
      {/* Face */}
      {expression === "grabbed" ? (
        <>
          <rect x="17" y="21" width="3" height="4" fill="#331024" />
          <rect x="28" y="21" width="3" height="4" fill="#331024" />
          <rect x="22" y="27" width="4" height="4" rx="2" fill="#d92e6b" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M16 23 L20 23" stroke="#331024" strokeWidth="2" />
          <path d="M28 23 L32 23" stroke="#331024" strokeWidth="2" />
          <path d="M22 29 Q24 27 26 29" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          {/* Sweet smiling eyes */}
          <path d="M16 23 Q18 20 20 23" stroke="#331024" strokeWidth="2" fill="none" />
          <path d="M28 23 Q30 20 32 23" stroke="#331024" strokeWidth="2" fill="none" />
          <rect x="23" y="27" width="2" height="2" fill="#d92e6b" />
        </>
      )}
    </svg>
  );
}

// 13. Choco Nyan - Toasted Cocoa Truffle Kitten
export function ChocoSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`plush-svg ${expression} ${className}`} shapeRendering="crispEdges">
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />
      {/* Chocolate Ears */}
      <polygon points="11,16 16,6 22,15" fill="#7f4f24" stroke="#331024" strokeWidth="2" />
      <polygon points="26,15 32,6 37,16" fill="#7f4f24" stroke="#331024" strokeWidth="2" />
      {/* Feet */}
      <rect x="12" y="38" width="7" height="5" rx="2" fill="#a47148" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="38" width="7" height="5" rx="2" fill="#a47148" stroke="#331024" strokeWidth="2" />
      {/* Body */}
      <rect x="8" y="13" width="32" height="27" rx="11" fill="#d4a373" stroke="#331024" strokeWidth="2" />
      {/* Cheeks */}
      <rect x="13" y="27" width="5" height="3" fill="#ff9999" />
      <rect x="30" y="27" width="5" height="3" fill="#ff9999" />
      {/* Cat Tail */}
      <path d="M38 30 Q44 26 42 20" stroke="#7f4f24" strokeWidth="3" fill="none" />
      {/* Face */}
      {expression === "grabbed" ? (
        <>
          <rect x="17" y="20" width="3" height="4" fill="#331024" />
          <rect x="28" y="20" width="3" height="4" fill="#331024" />
          <rect x="23" y="26" width="2" height="2" fill="#ff5c8a" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M16 22 L20 22" stroke="#331024" strokeWidth="2" />
          <path d="M28 22 L32 22" stroke="#331024" strokeWidth="2" />
          <path d="M22 28 Q24 26 26 28" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <rect x="17" y="20" width="3" height="5" rx="1.5" fill="#331024" />
          <rect x="17" y="20" width="1.5" height="2" fill="#fff" />
          <path d="M27 22 Q30 19 33 22" stroke="#331024" strokeWidth="2" fill="none" />
          <path d="M21 26 Q22.5 28 24 26 Q25.5 28 27 26" stroke="#331024" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

// 14. Sora Penguin - Baby Cloud Glider
export function SoraSprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`plush-svg ${expression} ${className}`} shapeRendering="crispEdges">
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />
      {/* Flippers */}
      <rect x="5" y="22" width="5" height="9" rx="2" fill="#90caf9" stroke="#331024" strokeWidth="2" />
      <rect x="38" y="22" width="5" height="9" rx="2" fill="#90caf9" stroke="#331024" strokeWidth="2" />
      {/* Feet */}
      <rect x="12" y="38" width="7" height="5" rx="2" fill="#ffd166" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="38" width="7" height="5" rx="2" fill="#ffd166" stroke="#331024" strokeWidth="2" />
      {/* Body */}
      <rect x="8" y="11" width="32" height="29" rx="12" fill="#bde0fe" stroke="#331024" strokeWidth="2" />
      {/* White Belly */}
      <rect x="15" y="18" width="18" height="20" rx="8" fill="#ffffff" />
      {/* Cheeks */}
      <rect x="11" y="26" width="4" height="3" fill="#ff80b0" />
      <rect x="33" y="26" width="4" height="3" fill="#ff80b0" />
      {/* Yellow Beak */}
      <polygon points="24,24 21,28 27,28" fill="#ffd166" stroke="#331024" strokeWidth="1.5" />
      {/* Eyes */}
      {expression === "grabbed" ? (
        <>
          <circle cx="18" cy="20" r="2.5" fill="#331024" />
          <circle cx="30" cy="20" r="2.5" fill="#331024" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M16 21 L20 21" stroke="#331024" strokeWidth="2" />
          <path d="M28 21 L32 21" stroke="#331024" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx="18" cy="20" r="2" fill="#331024" />
          <circle cx="19" cy="19.5" r="0.8" fill="#fff" />
          <circle cx="30" cy="20" r="2" fill="#331024" />
          <circle cx="31" cy="19.5" r="0.8" fill="#fff" />
        </>
      )}
    </svg>
  );
}

// 15. Milky Uni - Dream Unicorn Puff
export function MilkySprite({
  expression = "idle",
  size = 72,
  className = "",
}: {
  expression?: PlushExpression;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`plush-svg ${expression} ${className}`} shapeRendering="crispEdges">
      <ellipse cx="24" cy="45" rx="14" ry="3" fill="#1b1226" opacity="0.25" />
      {/* Golden Star Horn */}
      <polygon points="24,3 21,14 27,14" fill="#ffd166" stroke="#331024" strokeWidth="1.5" />
      <line x1="22" y1="8" x2="26" y2="8" stroke="#f39c12" strokeWidth="1" />
      {/* Unicorn Ears */}
      <rect x="11" y="9" width="5" height="7" rx="2" fill="#e8d7ff" stroke="#331024" strokeWidth="1.5" />
      <rect x="32" y="9" width="5" height="7" rx="2" fill="#e8d7ff" stroke="#331024" strokeWidth="1.5" />
      {/* Pastel Mane */}
      <rect x="27" y="11" width="7" height="12" rx="3" fill="#ffb4cf" />
      {/* Feet */}
      <rect x="12" y="38" width="7" height="5" rx="2" fill="#d0bfff" stroke="#331024" strokeWidth="2" />
      <rect x="29" y="38" width="7" height="5" rx="2" fill="#d0bfff" stroke="#331024" strokeWidth="2" />
      {/* Body */}
      <rect x="8" y="12" width="32" height="28" rx="12" fill="#f8f4ff" stroke="#331024" strokeWidth="2" />
      {/* Cheeks */}
      <rect x="13" y="27" width="5" height="3" fill="#ff80b0" />
      <rect x="30" y="27" width="5" height="3" fill="#ff80b0" />
      {/* Face */}
      {expression === "grabbed" ? (
        <>
          <rect x="17" y="21" width="3" height="4" fill="#331024" />
          <rect x="28" y="21" width="3" height="4" fill="#331024" />
          <rect x="23" y="27" width="2" height="2" fill="#b185db" />
        </>
      ) : expression === "dropped" ? (
        <>
          <path d="M16 23 L20 23" stroke="#331024" strokeWidth="2" />
          <path d="M28 23 L32 23" stroke="#331024" strokeWidth="2" />
        </>
      ) : (
        <>
          {/* Starry anime sleepy eyes */}
          <path d="M16 23 Q18 20 20 23" stroke="#331024" strokeWidth="2" fill="none" />
          <path d="M28 23 Q30 20 32 23" stroke="#331024" strokeWidth="2" fill="none" />
          <rect x="23" y="26" width="2" height="2" fill="#331024" />
        </>
      )}
    </svg>
  );
}

