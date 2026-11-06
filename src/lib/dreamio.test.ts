import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buyItem,
  claimDaily,
  equipItem,
  finishGame,
  initialDream,
  restoreDream,
  saveProfile,
} from "./dreamio";
const player = () => ({ ...initialDream(), nickname: "Dreamer" });
const day = (n: number) => new Date(2026, 9, n, 12);
test("profile settings survive reload without changing game progress or older saves", () => {
  const state = claimDaily(player(), day(1))!;
  const saved = saveProfile(state, "  Moon  ", "nonbinary", 83.25)!;
  assert.equal(saved.nickname, "Moon");
  assert.equal(saved.tickets, state.tickets);
  assert.deepEqual(saved.owned, state.owned);
  assert.deepEqual(restoreDream(JSON.stringify(saved)), saved);
  assert.equal(saveProfile(state, " ", "female", 0), null);
  assert.equal(saveProfile(state, "Moon", "male", NaN), null);
  const { gender, daylight, ...olderSave } = state;
  const restored = restoreDream(JSON.stringify(olderSave));
  assert.equal(restored.gender, "unspecified");
  assert.equal(restored.daylight, 0);
  assert.equal(restoreDream(JSON.stringify({ ...state, gender: "invalid", daylight: 500 })).daylight, 100);
  assert.equal(restoreDream(JSON.stringify({ ...state, gender: "invalid" })).gender, "unspecified");
});
test("daily reward is once per local calendar day, with a seven-day bonus", () => {
  let state = player();
  for (let i = 1; i <= 7; i++) {
    state = claimDaily(state, day(i))!;
    assert.equal(state.streak, i);
    assert.equal(claimDaily(state, day(i)), null);
  }
  assert.equal(state.tickets, 190);
  assert.equal(claimDaily(state, day(6)), null);
  const gap = claimDaily(state, day(9))!;
  assert.equal(gap.streak, 1);
  assert.equal(gap.tickets, 210);
  assert.equal(claimDaily(initialDream(), day(1)), null);
});
test("exchange deducts points once and only owned clothes can be equipped", () => {
  const state = claimDaily(player(), day(1))!;
  assert.equal(buyItem(state, "accessory-bunny"), null);
  assert.equal(equipItem(state, "top-pink"), null);
  assert.equal(buyItem(state, "not-an-item"), null);
  const bought = buyItem(state, "top-pink")!;
  assert.equal(bought.tickets, 0);
  assert.equal(buyItem(bought, "top-pink"), null);
  assert.equal(equipItem(bought, "top-pink")!.look.top, "top-pink");
  assert.equal(state.look.top, "top-white");
  assert.equal(buyItem(initialDream(), "top-pink"), null);
});
test("game rewards are per game per day and personal best never falls", () => {
  const first = finishGame(player(), "game-1", 100, day(1))!;
  assert.equal(first.tickets, 10);
  const replay = finishGame(first, "game-1", 20, day(1))!;
  assert.equal(replay.tickets, 10);
  assert.equal(replay.best["game-1"], 100);
  assert.equal(finishGame(replay, "game-2", 40, day(1))!.tickets, 20);
  assert.equal(finishGame(replay, "game-1", 110, day(2))!.tickets, 20);
  assert.equal(finishGame(first, "unknown", 30, day(1)), null);
  assert.equal(finishGame(first, "game-1", 0, day(1)), null);
  assert.equal(finishGame(initialDream(), "game-1", 10, day(1))!.tickets, 0);
});
test("saved progress survives reload; corrupt storage cannot equip unowned items", () => {
  const bought = buyItem(claimDaily(player(), day(1))!, "top-pink")!;
  const equipped = equipItem(bought, "top-pink")!;
  assert.deepEqual(restoreDream(JSON.stringify(equipped)), equipped);
  assert.deepEqual(restoreDream("null"), initialDream());
  assert.deepEqual(restoreDream("broken-json"), initialDream());
  const invalid = restoreDream(
    JSON.stringify({
      version: 1,
      tickets: -2,
      owned: ["bad"],
      look: { top: "top-pink" },
      hair: 88,
      skin: -1,
      nickname: " a ",
      best: { "game-1": -8 },
    }),
  );
  assert.equal(invalid.tickets, 0);
  assert.equal(invalid.look.top, "top-white");
  assert.equal(invalid.nickname, "a");
  assert.equal(invalid.hair, 0);
  assert.equal(invalid.skin, 0);
  assert.deepEqual(invalid.best, {});
});

test("dresses and bags preserve older closets and switch back to separates", () => {
  const oldSave = {
    ...player(),
    look: {
      top: "top-white",
      bottom: "bottom-blue",
      shoes: "shoes-white",
      accessory: "",
    },
  };
  const restored = restoreDream(JSON.stringify(oldSave));
  assert.equal(restored.look.dress, "");
  assert.equal(restored.look.bag, "");
  const funded = { ...restored, tickets: 100 };
  const withDress = equipItem(
    buyItem(funded, "dress-midnight")!,
    "dress-midnight",
  )!;
  assert.equal(withDress.look.dress, "dress-midnight");
  const withBag = equipItem(
    buyItem(withDress, "bag-lavender")!,
    "bag-lavender",
  )!;
  assert.equal(withBag.look.bag, "bag-lavender");
  assert.equal(equipItem(withBag, "top-white")!.look.dress, "");
  assert.equal(equipItem(withBag, "", "dress")!.look.dress, "");
  assert.equal(equipItem(withBag, "", "bag")!.look.bag, "");
  assert.equal(equipItem(withBag, "", "top"), null);
  assert.deepEqual(restoreDream(JSON.stringify(withBag)), withBag);
});
