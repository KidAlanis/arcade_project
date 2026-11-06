# Full-body character

The active character uses a single continuous **887×1774 RGBA sprite** (`fullbody-boots.png`) for the face, torso, thighs, knees, boot cuffs and feet. The same source image supplies the portrait and item previews. Main rendering uses uniform SVG scaling; no legs, thighs or boots are independently stretched, moved or stitched to older artwork.

`fullbody-base.png` is the registered covered underlay in the same 887×1774 coordinates. It is generated from the complete sprite with a modest opaque lavender unitard, no detachable accessories, and bare legs above the unchanged boots. It only appears through masks when the user removes an outfit component. With the original look selected, the main character renders the canonical full-body image alone.

`src/lib/character.ts` defines source dimensions, item preview crops and semantic costume regions. `src/components/layered-character.tsx` uses those regions to hide wings, cat ears, cuff, dress or tights and reveal the matching base. Dress colors apply to the canonical dress pixels, with face, phone, arms, hair, tights and boots protected. The former upper-body/boot split masks and 28px boot shift have been removed.

The fitting room fills the viewport: compact left category rail, expanded central street and right portrait/style/outfit panels. Boots and complete feet remain visible; the dialogue is placed at the lower left on wide screens. Narrow screens reserve space below the figure.

Exact built-in imagegen prompts:

- `fullbody-boots-prompt.txt`: original full-body extension with black lace-up boots.
- `fullbody-base-prompt.txt`: aligned covered base for optional outfit editing.

The older `original.png`, `body.png`, `wings.png`, `dress.png`, `tights.png`, `ears.png`, `cuffs.png` and `generation-prompts.json` are retained as previous design sources. They no longer supply any independently assembled torso/leg pieces to the active full-body compositor.

Local outfit choices still use `dreamio-photo-character-v1`. The real-world source photo is not shipped as a site asset. Photo Studio only previews new uploads locally; automatic generation for uploads and fitting arbitrary shop items remain future features.
