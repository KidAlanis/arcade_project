import { test } from "node:test";
import assert from "node:assert/strict";
import { updateBalance } from "./wallet";
test("earn, spend, and spend the exact balance", () => {
  assert.equal(updateBalance(0, 20, "add"), 20);
  assert.equal(updateBalance(20, 5, "spend"), 15);
  assert.equal(updateBalance(20, 20, "spend"), 0);
});
test("reject overspending, invalid ticket amounts, and overflow", () => {
  assert.equal(updateBalance(5, 6, "spend"), null);
  for (const amount of [
    -1,
    0,
    1.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.equal(updateBalance(5, amount, "add"), null);
    assert.equal(updateBalance(5, amount, "spend"), null);
  }
  assert.equal(updateBalance(Number.MAX_SAFE_INTEGER, 1, "add"), null);
});
