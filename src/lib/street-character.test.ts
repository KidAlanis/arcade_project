import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { originalStreetLook, restoreStreetLook, streetCanvas, streetSources } from "./street-character";

test("all new character variants share an RGBA canvas so outfits cannot change body scale", () => {
  for (const src of Object.values(streetSources)) {
    const data = readFileSync(new URL(`../../public${src}`, import.meta.url));
    assert.equal(data.readUInt32BE(16), streetCanvas.width, src);
    assert.equal(data.readUInt32BE(20), streetCanvas.height, src);
    assert.equal(data[25], 6, `${src}: transparency`);
  }
});

test("new outfit saves restore only supported pieces and colors", () => {
  const look = { ...originalStreetLook, jacket: false, bag: false, dressColor: "lilac" as const };
  assert.deepEqual(restoreStreetLook(JSON.stringify(look)), look);
  assert.deepEqual(restoreStreetLook('{"version":1,"jacket":"false","dressColor":"missing"}'), originalStreetLook);
  for (const value of ["broken", "null", '{"version":2,"jacket":false}']) {
    assert.deepEqual(restoreStreetLook(value), originalStreetLook);
  }
});
