import { genders, type Gender } from "./dreamio";

// Cosmetic onboarding preferences only. Never import a browser balance into the server wallet.
export type DreamerProfile = { nickname: string; gender: Gender; daylight: number };
export const defaultDreamerProfile: DreamerProfile = { nickname: "", gender: "unspecified", daylight: 0 };
export function restoreDreamerProfile(raw: string | null): DreamerProfile {
  const profile = { ...defaultDreamerProfile };
  try {
    const data = JSON.parse(raw ?? "null");
    if (!data || typeof data !== "object") return profile;
    if (typeof data.nickname === "string") profile.nickname = data.nickname.trim().slice(0, 16);
    if (genders.includes(data.gender)) profile.gender = data.gender;
    if (typeof data.daylight === "number" && Number.isFinite(data.daylight)) profile.daylight = Math.max(0, Math.min(100, data.daylight));
  } catch { /* Keep default preferences for malformed local data. */ }
  return profile;
}
