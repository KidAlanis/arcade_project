"use client";

import { useGameSettlement } from "@/components/game-ticket-gate";
import React, { useState } from "react";
import { BATH_LEVELS } from "./levels";
import { GameBoard } from "./game-board";
import { bathAudio } from "./audio";

export function PixelBathGame() {
  const settle = useGameSettlement();

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [levelStars, setLevelStars] = useState<Record<string, number>>({});
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [lastDucksCount, setLastDucksCount] = useState(0);

  const currentLevel = BATH_LEVELS[currentLevelIndex] || BATH_LEVELS[0];

  const handleLevelComplete = (ducksCount: number) => {
    setLastDucksCount(ducksCount);
    setLevelStars((prev) => ({
      ...prev,
      [currentLevel.id]: Math.max(prev[currentLevel.id] || 0, ducksCount),
    }));

    settle(true);

    setTimeout(() => {
      setShowVictoryModal(true);
    }, 600);
  };

  const handleNextLevel = () => {
    bathAudio.pop();
    setShowVictoryModal(false);
    if (currentLevelIndex < BATH_LEVELS.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
    } else {
      setCurrentLevelIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none font-sans z-50 bg-[#0e0b20]">
      {/* 1. Fullscreen Game Canvas Board */}
      <GameBoard
        key={currentLevel.id}
        level={currentLevel}
        onLevelComplete={handleLevelComplete}
        onRestart={() => settle(false)}
      />

      {/* 2. Floating Minimal Level Switcher (Top Left, alongside HUD) */}
      <div className="absolute top-16 left-4 z-40 flex items-center gap-1.5 bg-[#171032]/85 px-3 py-1.5 rounded-full border border-indigo-400/40 shadow-lg backdrop-blur-md">
        <span className="text-[11px] text-amber-300 font-bold mr-1">关卡:</span>
        {BATH_LEVELS.map((lvl, idx) => {
          const stars = levelStars[lvl.id] || 0;
          const isActive = idx === currentLevelIndex;
          return (
            <button
              key={lvl.id}
              onClick={() => {
                bathAudio.pop();
                settle(false);
                setCurrentLevelIndex(idx);
                setShowVictoryModal(false);
              }}
              className={`px-2.5 py-0.5 rounded-full text-xs font-black transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 shadow-[0_0_10px_rgba(251,191,36,0.6)] scale-105"
                  : "bg-[#281b50]/80 text-indigo-200/90 hover:bg-[#382670] border border-indigo-400/20"
              }`}
            >
              {lvl.number} {stars > 0 && `(${stars}★)`}
            </button>
          );
        })}
      </div>

      {/* 3. Level Complete Celebration Modal (Dreamio Sky City Style) */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-[#24184a] via-[#1f1442] to-[#160c33] border-3 border-amber-400/80 rounded-3xl p-7 max-w-sm w-full shadow-[0_0_50px_rgba(251,191,36,0.4)] text-center relative animate-popIn text-white">
            <div className="text-5xl mb-2 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
              ✨ 🫧 ✨
            </div>
            <h3 className="text-2xl font-black text-amber-300 mb-1 drop-shadow-md">
              仙泉满溢！暖汤开泡！
            </h3>
            <p className="text-xs text-indigo-200/90 mb-4">
              云朵被拨开，纯净星泉流入云端浴池！小女孩开心地泡在暖汤里冒起粉嫩泡泡～
            </p>

            {/* Ducks Star Rating */}
            <div className="flex items-center justify-center gap-3 mb-4 bg-[#110b28]/90 py-3 rounded-2xl border border-indigo-400/40 shadow-inner">
              {[1, 2, 3].map((starNum) => (
                <span
                  key={starNum}
                  className={`text-4xl transition-transform ${
                    starNum <= lastDucksCount
                      ? "scale-110 drop-shadow-[0_0_12px_#fde047]"
                      : "opacity-20 grayscale"
                  }`}
                >
                  🐥
                </span>
              ))}
            </div>

            <div className="p-3 bg-[#2d1b54]/80 rounded-xl border border-indigo-400/30 mb-5 font-bold text-xs text-amber-200 shadow-inner">
              🎟️ 恭喜获得街机奖券: +{lastDucksCount * 2 + 5} 张！
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleNextLevel}
                className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-900 font-black text-sm rounded-2xl border-2 border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.5)] transition-transform hover:scale-[1.02] active:scale-95"
              >
                {currentLevelIndex < BATH_LEVELS.length - 1
                  ? "飞向下一片云海 →"
                  : "重新游玩本关 ↺"}
              </button>
              <button
                onClick={() => setShowVictoryModal(false)}
                className="w-full py-2 text-xs font-bold text-indigo-300 hover:text-white transition-colors"
              >
                留在当前画面欣赏云景
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
