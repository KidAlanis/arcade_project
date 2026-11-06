# Castle map room sprite

The active fitting-room overlay clips the actual decoded final video frame in the browser. It keeps the original side perspective, curtain, dresses, mirror and lighting without redrawing them. Hover or keyboard focus enlarges this original-pixel layer to 1.015× and adds a restrained warm halo. Its label uses the same Silkscreen pixel font, cream/gold color and stepped purple text shadow as the cinematic titles, at a smaller size. The left library is not an entrance.

`fitting-room-original.svg` is a standalone cutout with transparency outside an approximate arch silhouette. It embeds the exact source screenshot pixels, positioned in the original video's 2672×1792 coordinate system. It is used by the compact mobile entry. `castle-final-reference.jpg` is the matching static fallback for browsers unable to capture a video frame. Source: `output/previews/dreamio-castle-clean-still.jpg` (1280×720 centered cover crop).

The earlier generated front-view `fitting-room.png` and its prompt are retained as unused design history. The application no longer renders that generated image.
