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
export function DailyCheckIn() { return null; }
