"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import type { Gender } from "@/lib/dreamio";
import { useTicketWallet } from "./ticket-wallet";
import { useDreamerProfile } from "./dreamer-profile";
import styles from "./dreamer-setup.module.css";

const genderOptions: { value: Gender; label: string; symbol: string }[] = [
  { value: "female", label: "Female", symbol: "♀" },
  { value: "male", label: "Male", symbol: "♂" },
  { value: "nonbinary", label: "Non-binary", symbol: "✧" },
  { value: "unspecified", label: "Prefer not to say", symbol: "♡" },
];
const timeLabel = (value: number) => value < 30 ? "Daylight" : value < 72 ? "Golden hour" : "Starry night";

export function DreamerSetup() {
  const wallet = useTicketWallet();
  const profile = useDreamerProfile();
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("unspecified");
  const [time, setTime] = useState(0);
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [dragging, setDragging] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const desired = useRef(0);
  const frame = useRef<number | null>(null);
  const initialized = useRef(false);
  const drag = useRef<{ id: number; x: number; value: number; width: number } | null>(null);

  // Keep only the latest requested frame while a previous seek is decoding.
  function seek() {
    const media = video.current;
    if (!media || media.readyState < 1 || !Number.isFinite(media.duration) || media.seeking) return;
    const target = Math.max(0, media.duration - 0.04) * desired.current / 100;
    media.pause();
    if (Math.abs(media.currentTime - target) > 0.015) media.currentTime = target;
  }
  function changeTime(value: number) {
    const next = Math.max(0, Math.min(100, value));
    desired.current = next;
    setTime(next);
    if (frame.current === null) frame.current = requestAnimationFrame(() => {
      frame.current = null;
      seek();
    });
  }
  useEffect(() => {
    if (profile.ready && !initialized.current) {
      initialized.current = true;
      setName(profile.nickname || wallet.nickname);
      setGender(profile.gender);
      desired.current = profile.daylight;
      setTime(profile.daylight);
      seek();
    }
  }, [profile.ready, profile.nickname, profile.gender, profile.daylight, wallet.nickname]);
  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || drag.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, value: desired.current, width: event.currentTarget.clientWidth };
    setDragging(true);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || event.pointerId !== start.id) return;
    changeTime(start.value + (event.clientX - start.x) / start.width * 100);
  }
  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
  }
  function enter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (profile.updateProfile(name, gender, time)) router.push("/intro");
  }

  return (
    <main className={styles.page}>
      <div className={styles.scene}>
        <video
          ref={video}
          className={styles.video}
          src="/video/dreamio-day-night.mp4"
          poster="/art/dreamio-castle-day.png"
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
          onLoadedMetadata={seek}
          onLoadedData={() => { setMediaReady(true); setMediaError(false); seek(); }}
          onSeeked={seek}
          onPlay={() => video.current?.pause()}
          onError={() => { setMediaError(true); setMediaReady(false); }}
        />
        <div className={styles.shade} aria-hidden="true" />
        <div
          className={styles.sky}
          data-dragging={dragging}
          data-testid="sky-scrubber"
          aria-hidden="true"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
        />
      </div>

      <div className={styles.topbar}>
        <Link href="/" className={styles.brand}>dreamio <span>✦</span></Link>
        <span className={styles.chapter}>01 / YOUR STORY BEGINS</span>
        <Link href="/lobby" className={styles.skip}>Just explore ↗</Link>
      </div>

      <section className={styles.profile} aria-labelledby="profile-title">
        <div className={styles.profileHeading}><span>✧</span><p>NEW ADVENTURE</p><span>✧</span></div>
        <h1 id="profile-title">Hello, dreamer.</h1>
        <p className={styles.description}>Every adventure starts with you.</p>
        <form onSubmit={enter}>
          <label className={styles.fieldLabel} htmlFor="dreamer-name">YOUR NAME <span>01</span></label>
          <input
            id="dreamer-name"
            className={styles.name}
            placeholder="What should we call you?"
            autoComplete="nickname"
            maxLength={16}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <span className={styles.inputHint}>Up to 16 characters. A little nickname is perfect.</span>
          <fieldset className={styles.genders}>
            <legend className={styles.fieldLabel}>GENDER <span>OPTIONAL</span></legend>
            <div className={styles.genderGrid}>
              {genderOptions.map((option) => (
                <label key={option.value} className={styles.genderChoice}>
                  <input type="radio" name="gender" value={option.value} checked={gender === option.value} onChange={() => setGender(option.value)} />
                  <span className={styles.genderButton}><b aria-hidden="true">{option.symbol}</b>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className={styles.choiceNote}>Your world, your choice. You can change this later.</p>
          <button className={styles.enter} type="submit" disabled={!profile.ready || !name.trim()}>LET’S BEGIN <span>→</span></button>
          <p className={styles.localNote}>{profile.storageAvailable ? "Dreamer preferences saved in this browser · Games and tickets use your account" : "Storage is unavailable. Your preferences may not be saved."}</p>
        </form>
      </section>

      <section className={styles.timeControl} aria-label="Choose your time of day">
        <div className={styles.timeHeading}><span>MAKE THE SKY YOURS</span><output htmlFor="day-night">{timeLabel(time)} ✦</output></div>
        <div className={styles.sliderRow}>
          <button type="button" onClick={() => changeTime(0)} aria-label="Set daytime">☀</button>
          <input
            id="day-night"
            type="range"
            min="0"
            max="100"
            step="0.25"
            value={time}
            onChange={(event) => changeTime(Number(event.target.value))}
            aria-label="Day to night"
            aria-valuetext={`${timeLabel(time)}, ${Math.round(time)} percent toward night`}
            disabled={mediaError}
          />
          <button type="button" onClick={() => changeTime(100)} aria-label="Set nighttime">☾</button>
        </div>
        <p role="status">{mediaError ? "The sky couldn’t load." : !mediaReady ? "Gathering a little sky magic…" : "Drag the sky left or right, or move the slider."}
          {mediaError && <button type="button" className={styles.retry} onClick={() => { setMediaError(false); video.current?.load(); }}>Try again</button>}
        </p>
      </section>
      <span className={styles.bottomNote}>SMALL PIXELS. ENDLESS POSSIBILITIES.</span>
    </main>
  );
}
