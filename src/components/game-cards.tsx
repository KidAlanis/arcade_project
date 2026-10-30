"use client";
import Link from "next/link";
import { games } from "@/lib/games";
import { useState } from "react";
import { Cloud, PixelIcon } from "./pixel-art";

export function GameCards() {
  const [filter, setFilter] = useState("All games");
  const [query, setQuery] = useState("");
  const filtered = games.filter(
    (game) =>
      (filter === "All games" || game.category === filter) &&
      (game.name + game.english)
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <div className="games-toolbar">
        <div className="tabs" aria-label="Game categories">
          {["All games", "Casual", "Puzzle", "Challenge"].map((tab) => (
            <button
              key={tab}
              className={filter === tab ? "active" : ""}
              aria-pressed={filter === tab}
              onClick={() => setFilter(tab)}
            >
              {tab}
              {tab === "All games" && <small>03</small>}
            </button>
          ))}
        </div>
        <label className="search-input">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Search games"
            placeholder="Find your next happy little thing…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="game-grid">
        {filtered.map((game) => (
          <Link
            className={`game-card ${game.color}`}
            href={`/games/${game.slug}`}
            key={game.slug}
          >
            <div className={`game-cover cover-${game.engine}`}>
              <div className="game-cover-grid" />
              <span className="game-category">
                {game.category} / {game.number}
              </span>
              <span className="game-bonus">+10 pts</span>
              {game.engine === "memory" ? (
                <div className="memory-cover">
                  <span>
                    <PixelIcon name="heart" size={29} />
                  </span>
                  <span>
                    <PixelIcon name="star" size={29} />
                  </span>
                  <span>?</span>
                  <span>
                    <PixelIcon name="heart" size={29} />
                  </span>
                </div>
              ) : game.engine === "stars" ? (
                <div className="star-cover">
                  <Cloud />
                  <PixelIcon name="star" size={64} />
                  <span>✦</span>
                  <Cloud />
                </div>
              ) : (
                <div className="reaction-cover">
                  <span>READY?</span>
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                  <PixelIcon name="game" size={46} />
                </div>
              )}
              <span className="cover-caption">{game.english}</span>
              <span className="play-circle">
                <PixelIcon name="arrow" size={18} />
              </span>
            </div>
            <div className="game-card-body">
              <div>
                <h3>{game.name}</h3>
                <span className="game-status">
                  <i /> PLAYABLE DEMO
                </span>
              </div>
              <p>{game.description}</p>
              <div className="game-card-footer">
                <span>First daily finish: +10 pts</span>
                <span>Let’s play →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <PixelIcon name="star" size={35} />
          <h3>No little worlds found</h3>
          <p>Try another word. Your next favorite is out there.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setFilter("All games");
            }}
          >
            See all games
          </button>
        </div>
      )}
    </>
  );
}
