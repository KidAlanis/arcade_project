import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { characterLayers } from "./character";

test("registered raster layers match their declared RGBA source canvases", () => {
  for (const layer of characterLayers) {
    const bytes = readFileSync(
      new URL(`../../public${layer.src}`, import.meta.url),
    );
    assert.deepEqual(
      [...bytes.subarray(0, 8)],
      [137, 80, 78, 71, 13, 10, 26, 10],
      layer.id,
    );
    assert.equal(bytes.readUInt32BE(16), layer.sourceSize?.[0] ?? 1024, `${layer.id}: width`);
    assert.equal(bytes.readUInt32BE(20), layer.sourceSize?.[1] ?? 1536, `${layer.id}: height`);
    assert.equal(bytes[25], 6, `${layer.id}: RGBA alpha`);
  }
});
