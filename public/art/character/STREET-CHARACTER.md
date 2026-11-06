# Leather & Lace / 皮衣蕾丝角色

Generated with the built-in ImageGen tool from the user's two outfit/portrait references, using `fullbody-boots.png` only as the pixel-art style reference. The two photos describe one character. Original photographs are not copied into the website.

- `street-girl.png`: complete photo outfit; the default render uses this coherent full-body sprite directly.
- `street-girl-clean.png`: same outfit without bag, headband or earrings, used beneath optional accessories.
- `street-girl-base.png`: sleeveless ivory dress and original boots, used when the jacket is removed.
- All three PNGs have real alpha and the same **887 × 1774** source canvas. No body section is independently stretched or moved.
- Exact prompts: `street-girl-prompt.txt`, `street-girl-clean-prompt.txt`, `street-girl-base-prompt.txt`.

The fitting room opens with **LEATHER & LACE** selected on first use. The **SWITCH CHARACTER** button shows the other character’s portrait and switches between **LEATHER & LACE** and **MIDNIGHT WINGS**, retaining each saved outfit. Jacket, bag, headband and earrings toggle independently. The dress has ivory, lilac and blush options. The one-piece dress and matching black boots remain equipped; this release does not provide arbitrary cross-character clothing swaps.

Layer definitions and masks are in `src/lib/street-character.ts`. `node --import tsx scripts/export-street-character.ts` creates six self-contained transparent SVG item cutouts in `output/street-character-layers/`, embedding the generated raster pixels at their original registration. The PNG variants supply occluded pixels during outfit changes; the cutouts alone are not an anatomical base or a complete reconstruction of hidden garments.

## Check in the browser

1. Open `/wardrobe`; select LEATHER & LACE.
2. TOPS → Black Leather Jacket toggles the jacket, keeping a complete dress and continuous legs/boots.
3. BAGS toggles the gold-chain bag. ACCESSORIES toggles headband and earrings.
4. DRESSES changes the lace color without tinting skin or boots.
5. Reload to confirm the choice persists. FACE → Restore photo outfit returns the original look.
6. Click SWITCH CHARACTER to change to MIDNIGHT WINGS, then click again to return. Each character retains its own outfit.

换装入口保留了原人物；新人物的外套、包、发箍、耳饰可以独立开关。连衣裙可换色，靴子保持原图款式。素材拆分保留统一画布，避免腿和靴子的比例或位置断开。
