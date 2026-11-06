"use client";
import { useEffect, useState } from "react";
import { defaultDreamerProfile, restoreDreamerProfile } from "@/lib/dreamer-profile";
import { genders, type Gender } from "@/lib/dreamio";

const KEY = "dreamio-setup-profile-v1";
export function useDreamerProfile() {
  const [profile, setProfile] = useState({ ...defaultDreamerProfile });
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      setProfile(restoreDreamerProfile(localStorage.getItem(KEY) ?? localStorage.getItem("dreamio-world-v1")));
    } catch { setStorageAvailable(false); }
    setReady(true);
    const sync = (event: StorageEvent) => { if (event.key === KEY) setProfile(restoreDreamerProfile(event.newValue)); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function updateProfile(nickname: string, gender: Gender, daylight: number) {
    if (!ready || !nickname.trim() || !genders.includes(gender) || !Number.isFinite(daylight)) return false;
    const next = restoreDreamerProfile(JSON.stringify({ nickname, gender, daylight }));
    setProfile(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { setStorageAvailable(false); }
    return true;
  }
  return { ...profile, ready, storageAvailable, updateProfile };
}
