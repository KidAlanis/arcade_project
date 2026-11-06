import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultDreamerProfile, restoreDreamerProfile } from "./dreamer-profile";

test("onboarding migrates cosmetic preferences without importing legacy wallet data", () => {
  const profile = restoreDreamerProfile(JSON.stringify({ nickname: " Dreamer ", gender: "female", daylight: 85, tickets: 99999, owned: ["paid-item"], user: { id: "fake" } }));
  assert.deepEqual(profile, { nickname: "Dreamer", gender: "female", daylight: 85 });
  assert.deepEqual(Object.keys(profile).sort(), ["daylight", "gender", "nickname"]);
});

test("invalid onboarding data uses defaults and clamps time of day", () => {
  for (const raw of [null, "broken", "null", "42"]) assert.deepEqual(restoreDreamerProfile(raw), defaultDreamerProfile);
  assert.deepEqual(restoreDreamerProfile('{"nickname":42,"gender":"invalid","daylight":150}'), { ...defaultDreamerProfile, daylight: 100 });
});
