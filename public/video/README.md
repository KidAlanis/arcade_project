# Dreamio video sources

User-supplied videos, matched by first/last frames and verified by SHA-256 on 2026-11-05. Original source filenames are preserved here for future replacements.

| Order | Website asset | Source filename | Resolution | Action |
| --- | --- | --- | --- | --- |
| 1 | `dreamio-castle-arrival.mp4` | `jimeng-2026-11-05-7183-镜头推进到尾针.mp4` | 2672×1792 | Replaced 794×530 city-to-castle approach with the HD version. |
| 2 | `dreamio-castle-gate-approach.mp4` | `jimeng-2026-11-05-8472-镜头推进到尾针.mp4` | 2672×1792 | Replaced 794×530 castle-to-gate approach with the HD version. |
| 3 | `dreamio-castle-doors-open.mp4` | `jimeng-2026-11-05-2597-门打开，镜头推进到尾针.mp4` | 2672×1792 | Replaced 794×530 doors-opening-to-interior clip with the matched HD version. |

`jimeng-2026-11-05-6860-镜头推进到尾针.mp4` was skipped: it was byte-identical to the previous second clip (SHA-256 `dca640f10dc93cdc08f573474414148577bdf72ff61d4449ea7efb1542f83ed7`). The distinct HD file 8472 upgrades that same position in the sequence.

Current SHA-256 values:

- Arrival / 7183: `dcb3cd319e8e70c3fc7a391703a638ded41874e2f1c623452baca4234ad2e23e`
- Gate / 8472: `921fb85d3d992c414b3283a7b5a7f94b5cb3e1da0a13d7a29cab2b0c8a7b6a06`
- Doors / 2597: `2afb9311a39274b653b736bcf8316f945c74a57256434358d51755246bac3ad0`

All three are approximately 5.055 seconds. Shots play at 1.2× only after a scene click or Space. The initial frame is paused, each shot holds at its ending, and an action while playing fast-forwards directly to the next shot. After a natural ending, an action continues to the next shot; there is no automatic inter-shot advancement. The sequence stops on the final interior frame. All introductory text, navigation, controls and the dimming overlay then fade away over 1.8 seconds, leaving the unobstructed castle scene. HD asset URLs include revision query strings to avoid stale cached video.

`dreamio-day-night.mp4` is the separate manually scrubbed day/night scene on `/welcome` and is unchanged.
