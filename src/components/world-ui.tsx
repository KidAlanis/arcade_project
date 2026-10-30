"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useTicketWallet } from "./ticket-wallet";
import { localDay } from "@/lib/dreamio";
import { PixelIcon } from "./pixel-art";

export function WindowBar({
  title,
  icon = "star",
}: {
  title: string;
  icon?: string;
}) {
  return (
    <div className="window-bar">
      <span>
        <PixelIcon name={icon} size={13} />
        {title}
      </span>
      <span className="window-controls" aria-hidden="true">
        — □ ×
      </span>
    </div>
  );
}
export function SectionHeading({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>
          {title}
          <span>✦</span>
        </h2>
      </div>
      {children}
    </div>
  );
}
export function DailyCheckIn() {
  const { nickname, streak, lastCheckIn, ready, checkIn } = useTicketWallet();
  const [today, setToday] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const tick = () => setToday(localDay());
    tick();
    const timer = setInterval(tick, 30000);
    return () => clearInterval(timer);
  }, []);
  const checked = today !== "" && lastCheckIn === today;
  const progress = checked
    ? ((streak - 1) % 7) + 1
    : (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return lastCheckIn === localDay(yesterday) ? streak % 7 : 0;
      })();
  return (
    <section className="pixel-window daily-window">
      <WindowBar title="DAILY LITTLE HAPPINESS" icon="heart" />
      <div className="daily-body">
        <div className="daily-title">
          <span className="daily-gift">
            <PixelIcon name="coin" size={28} />
          </span>
          <div>
            <h2>A little gift, every day</h2>
            <p>Drop by. Collect a little happiness.</p>
          </div>
          <span className="tiny-tag">DAILY</span>
        </div>
        <div className="check-days">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              className={`check-day ${i < progress ? "done" : ""} ${i === progress && !checked ? "next" : ""}`}
              key={i}
            >
              <small>DAY {i + 1}</small>
              <PixelIcon
                name={i < progress ? "check" : i === 6 ? "bag" : "coin"}
                size={i === 6 ? 19 : 15}
              />
              <b>+{i === 6 ? "70" : "20"}</b>
            </div>
          ))}
        </div>
        {nickname ? (
          <button
            className="button pink-button full"
            disabled={!ready || checked}
            onClick={() => {
              const reward = checkIn();
              setMessage(
                reward
                  ? `You’re checked in! +${reward} points in your pocket ♥`
                  : "Already checked in. See you tomorrow ♥",
              );
            }}
          >
            {checked
              ? "✓ Claimed today. See you tomorrow!"
              : "Claim today’s 20 points"}
            <PixelIcon name={checked ? "heart" : "arrow"} size={15} />
          </button>
        ) : (
          <Link className="button pink-button full" href="/#login">
            Sign in to claim 20 points <PixelIcon name="arrow" size={15} />
          </Link>
        )}
        <p className="daily-foot" role="status">
          {message ||
            (streak
              ? `${streak}-day streak · 50 bonus points every 7 days`
              : "Check in 7 days in a row for 50 bonus points")}
        </p>
      </div>
    </section>
  );
}
