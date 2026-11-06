"use client";

import { useEffect, useRef } from "react";
import { useGameSettlement } from "@/components/game-ticket-gate";

export function PixelBathGame() {
  const frame = useRef<HTMLIFrameElement>(null);
  const settle = useGameSettlement();

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "dreamio:cloud-bath-complete"
      ) return;
      settle(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [settle]);

  return (
    <iframe
      ref={frame}
      src="/pixel-cloud-bath.html?arcade=1&version=8"
      title="Dreamio Cloud Bath — eight cloudscapes, including Cosmic Finale"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", border: 0, zIndex: 50 }}
    />
  );
}
