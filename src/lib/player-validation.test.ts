import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRedemption, parseReward } from "./player-validation";
import { safeReturnPath } from "./player-contract";
import { rewardForVerifiedResult } from "./server/game-rewards";
const requestId = "b60e8984-90b5-4610-9bac-d4d228416470";
test("redemptions accept identifiers only, never client prices, balances, or identities", () => {
  const valid = { prizeId: "pixel-pin", requestId };
  assert.deepEqual(parseRedemption(valid), valid);
  for (const extra of [
    { userId: "someone-else" },
    { price: 0 },
    { balance: 999 },
    { amount: -20 },
    { stock: 20 },
  ])
    assert.equal(parseRedemption({ ...valid, ...extra }), null);
  for (const value of [
    null,
    [],
    {},
    { ...valid, requestId: "" },
    { ...valid, prizeId: "'; DROP TABLE" },
  ])
    assert.equal(parseRedemption(value), null);
});
test("rewards accept a result reference, never client-reported scores or ticket amounts", () => {
  assert.deepEqual(parseReward({ resultId: requestId }), {
    resultId: requestId,
  });
  for (const extra of [{ amount: 10 }, { score: 999 }, { userId: "other" }])
    assert.equal(parseReward({ resultId: requestId, ...extra }), null);
  assert.equal(parseReward({ resultId: 12 }), null);
});
test("placeholder games and unknown games cannot issue ticket rewards", () => {
  for (const game of ["game-1", "game-2", "game-3", "unknown", "__proto__"])
    assert.throws(() => rewardForVerifiedResult(game, "win"), /not enabled/);
});
test("login return paths stay on known local pages", () => {
  for (const path of ["/", "/shop", "/shelf", "/games/game-1"])
    assert.equal(safeReturnPath(path), path);
  for (const path of [
    "//evil.com",
    "https://evil.com",
    "/\\evil.com",
    "/api/auth/sign-out",
    "/%2f%2fevil.com",
    null,
  ])
    assert.equal(safeReturnPath(path), "/");
});
