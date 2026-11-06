import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { streetCanvas, streetParts } from "../src/lib/street-character";

// Export the same masks used by the fitting room; no raster resampling or leg stitching.
const destination = resolve("output/street-character-layers");
mkdirSync(destination, { recursive: true });
for (const [part, item] of Object.entries(streetParts)) {
  const data = readFileSync(resolve(`public${item.source}`)).toString("base64");
  const { width, height } = streetCanvas;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<title>${item.name}</title>
<defs><mask id="part" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" style="mask-type:luminance">
<rect width="${width}" height="${height}" fill="black"/><path d="${item.path}" fill="white"/>
${item.subtract ? `<path d="${item.subtract}" fill="black"/>` : ""}</mask></defs>
<image width="${width}" height="${height}" href="data:image/png;base64,${data}" mask="url(#part)"/>
</svg>\n`;
  writeFileSync(resolve(destination, `${part}.svg`), svg);
}
writeFileSync(resolve(destination, "README.txt"), `Dreamio — Leather & Lace\n\nSix transparent SVG item cutouts: jacket, dress, boots, bag, headband, earrings.\nEach embeds the generated PNG pixels and retains the shared 887 x 1774 canvas.\nUse the fitting-room renderer for complete outfit changes: the clean jacket and sleeveless dress variants provide occluded pixels.\nThe lace dress and original boots stay equipped; jacket and accessories can be removed, and the dress has three color choices.\nOriginal photos are not included.\nRegenerate exports: node --import tsx scripts/export-street-character.ts\n`);
console.log(`Exported ${Object.keys(streetParts).length} registered transparent item layers to ${destination}`);
