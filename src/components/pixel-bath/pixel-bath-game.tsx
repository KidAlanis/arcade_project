"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTicketWallet } from "@/components/ticket-wallet";
import { BATH_LEVELS } from "./levels";
import { GameBoard } from "./game-board";
import { bathAudio } from "./audio";

export function PixelBathGame() {
  const { addTickets } = useTicketWallet();

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

    const earnedTickets = ducksCount * 2 + 5;
    addTickets(earnedTickets);

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
    <main className="w-full max-w-none px-3 sm:px-8 py-3 select-none font-sans flex flex-col items-center">
      {/* Top Arcade Breadcrumb & Level Selector */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 pb-3 text-xs font-bold text-gray-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors text-sm">
            ← 返回街机大厅
          </Link>
          <span>/</span>
          <span className="text-[#ff65c5]">CABINET 01</span>
          <span>/</span>
          <span className="text-amber-300 font-extrabold text-sm">星露爱洗澡 · PIXEL BATH</span>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex items-center gap-2 bg-[#1f1610] px-3.5 py-1.5 rounded-full border border-[#5c3818] shadow-md">
          <span className="text-xs text-amber-300 font-bold">地图关卡:</span>
          {BATH_LEVELS.map((lvl, idx) => {
            const stars = levelStars[lvl.id] || 0;
            const isActive = idx === currentLevelIndex;
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  bathAudio.pop();
                  setCurrentLevelIndex(idx);
                  setShowVictoryModal(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  isActive
                    ? "bg-amber-500 text-stone-900 shadow-lg scale-105"
                    : "bg-[#331c11] text-amber-200/80 hover:bg-[#4a2817]"
                }`}
              >
                第 {lvl.number} 关 {stars > 0 && `(${stars}★)`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Full-Screen Game Arcade Cabinet Frame */}
      <div className="w-full max-w-5xl min-h-[780px] rounded-3xl overflow-hidden border-4 border-[#5c3818] shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-[#1e130c] p-4 sm:p-6 flex flex-col items-center justify-center relative">
        <GameBoard
          key={currentLevel.id}
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          onRestart={() => setShowVictoryModal(false)}
        />

        {/* Level Complete Celebration Modal */}
        {showVictoryModal && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#fff9eb] border-5 border-[#5c3818] rounded-3xl p-7 max-w-sm w-full shadow-2xl text-center relative animate-popIn">
              <div className="text-5xl mb-2">🎉</div>
              <h3 className="text-2xl font-black text-[#4a2810] mb-1">
                水满啦！舒服地泡澡啦！
              </h3>
              <p className="text-xs text-[#795548] mb-4">
                小女孩开心地笑啦，周围冒起了可爱的像素泡泡！
              </p>

              {/* Ducks Star Rating */}
              <div className="flex items-center justify-center gap-3 mb-4 bg-[#fcedc7] py-2.5 rounded-2xl border-2 border-[#5c3818]">
                {[1, 2, 3].map((starNum) => (
                  <span
                    key={starNum}
                    className={`text-4xl transition-transform ${
                      starNum <= lastDucksCount
                        ? "scale-110 drop-shadow-[0_0_10px_#f59e0b]"
                        : "opacity-25 grayscale"
                    }`}
                  >
                    🐥
                  </span>
                ))}
              </div>

              <div className="p-3 bg-[#f5ebe0] rounded-xl border border-[#d6ccc2] mb-5 font-bold text-xs text-[#5d4037]">
                🎟️ 恭喜获得街机奖券: +{lastDucksCount * 2 + 5} 张！
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleNextLevel}
                  className="w-full py-3 bg-[#e67e22] hover:bg-[#d35400] text-white font-black text-sm rounded-2xl border-3 border-[#4a2810] shadow-md transition-transform hover:scale-[1.02] active:scale-95"
                >
                  {currentLevelIndex < BATH_LEVELS.length - 1
                    ? "前往下一关地图 →"
                    : "重新游玩本关 ↺"}
                </button>
                <button
                  onClick={() => setShowVictoryModal(false)}
                  className="w-full py-2.5 text-xs font-bold text-[#8d6e63] hover:text-[#4a2810]"
                >
                  留在当前画面
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Under-Cabinet Description Bar */}
      <div className="mt-3 text-center text-xs text-[#9895aa] flex flex-wrap items-center justify-center gap-3">
        <span>🌱 像素治愈风 · 星露谷风格</span>
        <span>•</span>
        <span>⛏️ 类似小鳄鱼爱洗澡物理玩法：挖通泥土导流泉水</span>
        <span>•</span>
        <span>🐥 水流经过可收集小黄鸭获取 3 星评级</span>
        <span>•</span>
        <span>🛁 浴桶注满水即可通关并赚取街机奖券</span>
      </div>
    </main>
  );
}
