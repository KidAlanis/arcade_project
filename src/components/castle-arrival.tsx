"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import styles from "./castle-arrival.module.css";

const clips = [
  "/video/dreamio-castle-arrival.mp4?v=7183-hd",
  "/video/dreamio-castle-gate-approach.mp4?v=8472-hd",
  "/video/dreamio-castle-doors-open.mp4?v=2597-hd",
];
const PLAYBACK_RATE = 1.2;
const roomOutline = "M2080 1445V985Q2080 830 2240 745L2355 680L2470 745Q2630 830 2630 985V1445Z";
const chapters = [
  { eyebrow: "A NEW WORLD IS WAITING", title: "Ready to enter\nthe world of Dreamio?", detail: "A little wonder. A whole world for you." },
  { eyebrow: "FOLLOW YOUR CURIOSITY", title: "Little games.\nBig adventures.", detail: "Discover a new favorite, one little game at a time." },
  { eyebrow: "BE EVERY VERSION OF YOU", title: "Play. Dress up.\nDream a little.", detail: "Earn Dream Points. Find your style. Make yourself at home." },
];
type Phase = "ready" | "loading" | "playing" | "paused" | "seeking" | "held" | "complete";

export function CastleArrival() {
  const id = useId().replace(/:/g, "");
  const media = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(0);
  const phase = useRef<Phase>("ready");
  const skipToNext = useRef(false);
  const action = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const [durations, setDurations] = useState(clips.map(() => 5.056));
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState(false);
  const [finalFrame, setFinalFrame] = useState("");
  const chapter = chapters[active];

  function playClip(index: number) {
    const next = media.current[index];
    if (!next) return;
    phase.current = "loading";
    activeRef.current = index;
    setActive(index);
    setHeld(false);
    setNeedsPlay(false);
    setWaiting(next.readyState < 3);
    next.playbackRate = PLAYBACK_RATE;
    void next.play().catch(() => {
      phase.current = "paused";
      setNeedsPlay(true);
      setWaiting(false);
    });
  }
  function finishClip(index: number) {
    if (index !== activeRef.current || phase.current === "held" || phase.current === "complete") return;
    media.current[index]?.pause();
    setPlaying(false);
    setWaiting(false);
    setHeld(true);
    phase.current = "held";
    if (index !== clips.length - 1) {
      if (skipToNext.current) {
        skipToNext.current = false;
        playClip(index + 1);
      }
      return;
    }
    skipToNext.current = false;

    // Reuse the decoded last frame so the selected room retains the exact perspective.
    const video = media.current[index];
    if (video?.videoWidth) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(video, 0, 0);
          setFinalFrame(canvas.toDataURL("image/png"));
        }
      } catch { /* The matching static frame remains available as a fallback. */ }
    }
    phase.current = "complete";
    setProgress(1);
    setComplete(true);
  }
  function advance() {
    if (complete || error || phase.current === "loading" || phase.current === "seeking") return;
    const index = activeRef.current;
    const video = media.current[index];
    if (!video) return;
    if (phase.current === "playing") {
      if (!Number.isFinite(video.duration)) return;
      skipToNext.current = true;
      phase.current = "seeking";
      video.pause();
      video.currentTime = video.duration;
      return;
    }
    playClip(phase.current === "held" ? index + 1 : index);
  }
  function clickScene(event: MouseEvent<HTMLElement>) {
    if ((event.target as Element).closest("a, button, input, select, textarea")) return;
    advance();
  }
  useEffect(() => { action.current = advance; });
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as Element | null;
      if (target?.closest("a, button, input, select, textarea, [contenteditable=true]")) return;
      event.preventDefault();
      action.current();
    };
    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("keydown", keydown);
      media.current.forEach((video) => video?.pause());
    };
  }, []);
  function togglePlayback() {
    const video = media.current[activeRef.current];
    if (!video) return;
    if (playing) {
      phase.current = "paused";
      video.pause();
    } else advance();
  }
  function retry() {
    setError(false);
    setNeedsPlay(false);
    setWaiting(false);
    phase.current = "ready";
    media.current[activeRef.current]?.load();
  }

  return (
    <main className={styles.page} data-complete={complete} data-held={held} onClick={clickScene} aria-label={complete ? "Dreamio castle interior" : "Dreamio introduction"}>
      <div className={styles.scene} aria-hidden="true">
        {clips.map((src, index) => (
          <video key={src} ref={(element) => { media.current[index] = element; }} src={src} preload="auto" muted playsInline
            className={styles.video} data-active={active === index} data-clip={index + 1}
            onLoadedMetadata={(event) => {
              event.currentTarget.playbackRate = PLAYBACK_RATE;
              const duration = event.currentTarget.duration;
              if (Number.isFinite(duration)) setDurations((old) => old.map((value, i) => i === index ? duration : value));
            }}
            onCanPlay={() => { if (index === activeRef.current) setWaiting(false); }}
            onWaiting={() => { if (index === activeRef.current && phase.current === "playing") setWaiting(true); }}
            onPlaying={() => { if (index === activeRef.current) { phase.current = "playing"; setPlaying(true); setWaiting(false); setNeedsPlay(false); } }}
            onPause={() => { if (index === activeRef.current) setPlaying(false); }}
            onTimeUpdate={(event) => {
              if (index !== activeRef.current) return;
              const before = durations.slice(0, index).reduce((sum, value) => sum + value, 0);
              setProgress(Math.min(1, (before + event.currentTarget.currentTime) / durations.reduce((sum, value) => sum + value, 0)));
            }}
            onSeeked={() => { if (index === activeRef.current && phase.current === "seeking") finishClip(index); }}
            onEnded={() => finishClip(index)}
            onError={() => { setError(true); setWaiting(false); media.current[activeRef.current]?.pause(); }}
          />
        ))}
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.topbar} inert={complete} aria-hidden={complete}>
        <Link href="/" className={styles.brand}>DREAMIO <span>✦</span></Link>
        <Link href="/welcome" className={styles.back}>← Your dreamer profile</Link>
      </div>
      <section className={styles.caption} aria-live="polite" aria-atomic="true" aria-hidden={complete}>
        <div key={chapter.eyebrow} className={styles.words}>
          <p className={styles.eyebrow}><span aria-hidden="true">✧</span> {chapter.eyebrow}</p>
          <h1>{chapter.title}</h1><p className={styles.detail}>{chapter.detail}</p>
        </div>
      </section>
      <div className={styles.controls} inert={complete} aria-hidden={complete}>
        <div className={styles.track} aria-hidden="true"><span style={{width: `${progress * 100}%`}} /></div>
        <div className={styles.controlRow}>
          <span className={styles.journey}>✦ THE JOURNEY BEGINS <span>{String(active + 1).padStart(2, "0")} / 03</span></span>
          <button type="button" onClick={advance} disabled={error || complete || waiting} aria-label={playing ? "Skip to the next scene" : held ? "Continue to the next scene" : "Play this scene"}>
            {playing ? "CLICK / SPACE · NEXT →" : "CLICK / SPACE · CONTINUE →"}
          </button>
          {playing && <button type="button" onClick={togglePlayback} aria-label="Pause introduction">Ⅱ</button>}
        </div>
      </div>
      {(error || needsPlay || waiting) && !complete && (
        <div className={styles.playbackNotice} role="status">
          {error ? <><p>The journey couldn’t load.</p><button onClick={retry}>Try again ↻</button></> : needsPlay ? <button onClick={() => playClip(activeRef.current)}>▷ Continue the journey</button> : <p>Gathering a little magic…</p>}
        </div>
      )}
      {complete && (
        <nav className={styles.worldMap} aria-label="Castle destinations">
          <svg className={styles.mapRegions} viewBox="0 0 2672 1792" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id={`glow-${id}`}><stop offset="0" stopColor="#fff5be" stopOpacity=".85" /><stop offset=".55" stopColor="#ffd66e" stopOpacity=".45" /><stop offset="1" stopColor="#ffbd45" stopOpacity="0" /></radialGradient>
              <clipPath id={`room-${id}`}><path d={roomOutline} /></clipPath>
            </defs>
            <Link href="/wardrobe" className={styles.roomLink} aria-label="Enter the fitting room" tabIndex={0}>
              <ellipse className={styles.roomGlow} cx="2350" cy="1070" rx="325" ry="425" fill={`url(#glow-${id})`} />
              <g className={styles.roomSprite}>
                <image href={finalFrame || "/art/map/castle-final-reference.jpg"} x="0" y={finalFrame ? 0 : 144.5} width="2672" height={finalFrame ? 1792 : 1503} preserveAspectRatio="none" clipPath={`url(#room-${id})`} aria-hidden="true" />
              </g>
              <path className={styles.roomShape} d="M2080 1575V985Q2080 830 2240 745L2355 680L2470 745Q2630 830 2630 985V1575Z" />
              <g className={styles.roomLabel}><text x="2355" y="1545" textAnchor="middle">FITTING ROOM</text></g>
            </Link>
          </svg>
          <Link href="/wardrobe" className={styles.mobileRoomLink} aria-label="Enter the fitting room">
            <img src="/art/map/fitting-room-original.svg" alt="" width="80" height="100" draggable={false} /><span>FITTING ROOM ↗</span>
          </Link>
        </nav>
      )}
    </main>
  );
}
