import {
  BathLevel,
  CELL_AIR,
  CELL_CLOUD_WHITE,
  CELL_CLOUD_PINK,
  CELL_CLOUD_LAVENDER,
  CELL_CLOUD_PEACH,
  CELL_ROCK,
  CELL_WOOD,
} from "./types";

// Helper utilities for drawing cloud masses and celestial structures
function fillRect(
  grid: Uint8Array,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  type: number
) {
  const minX = Math.max(0, Math.floor(x0));
  const maxX = Math.min(w - 1, Math.floor(x1));
  const minY = Math.max(0, Math.floor(y0));
  const maxY = Math.min(h - 1, Math.floor(y1));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      grid[y * w + x] = type;
    }
  }
}

function fillCircle(
  grid: Uint8Array,
  w: number,
  h: number,
  cx: number,
  cy: number,
  r: number,
  type: number
) {
  const minX = Math.max(0, Math.floor(cx - r));
  const maxX = Math.min(w - 1, Math.floor(cx + r));
  const minY = Math.max(0, Math.floor(cy - r));
  const maxY = Math.min(h - 1, Math.floor(cy + r));
  const rSq = r * r;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= rSq) {
        grid[y * w + x] = type;
      }
    }
  }
}

function fillEllipse(
  grid: Uint8Array,
  w: number,
  h: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  type: number
) {
  const minX = Math.max(0, Math.floor(cx - rx));
  const maxX = Math.min(w - 1, Math.floor(cx + rx));
  const minY = Math.max(0, Math.floor(cy - ry));
  const maxY = Math.min(h - 1, Math.floor(cy + ry));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) {
        grid[y * w + x] = type;
      }
    }
  }
}

/**
 * Creates a massive, lush, organic cloud ocean in the lower/middle section.
 * The clouds are a dreamy mix of white, pastel pink, lavender, and sunset peach!
 */
function generateCloudOcean(
  grid: Uint8Array,
  w: number,
  h: number,
  startY: number,
  tubX: number,
  tubY: number
) {
  // 1. Fill base grid with alternating layers of dreamy clouds
  for (let y = startY; y < h - 1; y++) {
    for (let x = 2; x < w - 2; x++) {
      // Create multi-tone pastel clouds
      const noise = Math.sin(x * 0.18) * Math.cos(y * 0.15) + Math.sin((x + y) * 0.12);
      if (noise > 0.5) {
        grid[y * w + x] = CELL_CLOUD_PINK;
      } else if (noise > 0.1) {
        grid[y * w + x] = CELL_CLOUD_WHITE;
      } else if (noise > -0.3) {
        grid[y * w + x] = CELL_CLOUD_LAVENDER;
      } else {
        grid[y * w + x] = CELL_CLOUD_PEACH;
      }
    }
  }

  // 2. Add large puffy billowy cloud domes for volumetric cloud look
  const cloudDomes = [
    { cx: w * 0.2, cy: startY + 4, rx: w * 0.15, ry: 7, type: CELL_CLOUD_WHITE },
    { cx: w * 0.45, cy: startY + 6, rx: w * 0.18, ry: 8, type: CELL_CLOUD_PINK },
    { cx: w * 0.75, cy: startY + 5, rx: w * 0.16, ry: 7, type: CELL_CLOUD_LAVENDER },
    { cx: w * 0.32, cy: startY + 18, rx: w * 0.22, ry: 10, type: CELL_CLOUD_PEACH },
    { cx: w * 0.65, cy: startY + 22, rx: w * 0.24, ry: 11, type: CELL_CLOUD_WHITE },
    { cx: w * 0.22, cy: startY + 32, rx: w * 0.18, ry: 9, type: CELL_CLOUD_PINK },
    { cx: w * 0.78, cy: startY + 36, rx: w * 0.2, ry: 10, type: CELL_CLOUD_LAVENDER },
    { cx: w * 0.5, cy: startY + 44, rx: w * 0.28, ry: 12, type: CELL_CLOUD_PEACH },
  ];

  cloudDomes.forEach((d) => {
    fillEllipse(grid, w, h, d.cx, d.cy, d.rx, d.ry, d.type);
  });

  // 3. Keep the girl's bathtub platform securely supported on top of the clouds!
  // Solid cloud foundation beneath the tub
  fillRect(grid, w, h, tubX - 4, tubY + 8, tubX + 24, h - 1, CELL_CLOUD_WHITE);
  fillEllipse(grid, w, h, tubX + 10, tubY + 10, 16, 5, CELL_CLOUD_PINK);

  // Air pocket inside the tub intake area so water can enter freely
  fillRect(grid, w, h, tubX, tubY - 1, tubX + 20, tubY + 8, CELL_AIR);
}

// Fullscreen Dynamic Level Definitions
export const BATH_LEVELS: BathLevel[] = [
  // ================= LEVEL 1: DREAMIO SKY CLOUD SEAS =================
  {
    id: "level-1",
    number: "01",
    name: "幻梦天都 · 霞光云海",
    theme: "sky-sunset",
    subtitle: "用鼠标挖开天空中绵绵的白云与彩云，引导星泉流向云端浴池！",
    gridWidth: 100,
    gridHeight: 70,
    ducks: [
      { id: "d1-1", x: 28, y: 34, isCollected: false, fillLevel: 0 },
      { id: "d1-2", x: 62, y: 44, isCollected: false, fillLevel: 0 },
      { id: "d1-3", x: 36, y: 55, isCollected: false, fillLevel: 0 },
    ],
    tub: {
      x: 68,
      y: 56,
      width: 20,
      height: 9,
      targetWater: 28,
    },
    spawners: [
      { x: 48, y: 8, count: 200 },
    ],
    generateTerrain: (w, h) => {
      const grid = new Uint8Array(w * h);
      const startY = Math.floor(h * 0.22);
      const tubX = Math.floor(w * 0.68);
      const tubY = Math.floor(h * 0.78);

      // Border bounds
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (x < 2 || x >= w - 2 || y >= h - 1) {
            grid[y * w + x] = CELL_ROCK;
          }
        }
      }

      // Sky reservoir at top center (open air holding starlight water)
      const resX0 = Math.floor(w * 0.36);
      const resX1 = Math.floor(w * 0.64);
      const resY0 = Math.floor(h * 0.05);
      const resY1 = Math.floor(h * 0.16);

      // Reservoir stone rim
      for (let x = resX0 - 2; x <= resX1 + 2; x++) {
        grid[(resY1 + 1) * w + x] = CELL_ROCK;
      }
      for (let y = resY0; y <= resY1; y++) {
        grid[y * w + (resX0 - 2)] = CELL_ROCK;
        grid[y * w + (resX1 + 2)] = CELL_ROCK;
      }

      // Cloud plug at the reservoir bottom (ready to be dug by mouse!)
      const plugX0 = Math.floor(w * 0.45);
      const plugX1 = Math.floor(w * 0.55);
      for (let x = plugX0; x <= plugX1; x++) {
        grid[(resY1 + 1) * w + x] = CELL_CLOUD_WHITE;
        grid[(resY1 + 2) * w + x] = CELL_CLOUD_PINK;
      }

      // Generate massive sea of white & dreamy pastel clouds!
      generateCloudOcean(grid, w, h, startY, tubX, tubY);

      // Air pockets around celestial ducks so they float visibly in cloud grottos
      const duckPoints = [
        { x: Math.floor(w * 0.28), y: Math.floor(h * 0.4) },
        { x: Math.floor(w * 0.64), y: Math.floor(h * 0.52) },
        { x: Math.floor(w * 0.38), y: Math.floor(h * 0.65) },
      ];
      duckPoints.forEach(({ x, y }) => {
        fillCircle(grid, w, h, x, y, 4, CELL_AIR);
      });

      // Floating Sky Castle Stone Ledges to direct the celestial waterfall
      fillRect(grid, w, h, w * 0.2, h * 0.46, w * 0.38, h * 0.49, CELL_ROCK);
      fillRect(grid, w, h, w * 0.52, h * 0.58, w * 0.72, h * 0.61, CELL_ROCK);

      return grid;
    },
  },

  // ================= LEVEL 2: TWIN PALACE CLOUD AISLES =================
  {
    id: "level-2",
    number: "02",
    name: "浮岛天宫 · 星廊云涧",
    theme: "sky-sunset",
    subtitle: "天宫浮岛与云海相依，分别挖开两侧梦幻云彩收集星羽小鸭！",
    gridWidth: 100,
    gridHeight: 70,
    ducks: [
      { id: "d2-1", x: 24, y: 38, isCollected: false, fillLevel: 0 },
      { id: "d2-2", x: 74, y: 38, isCollected: false, fillLevel: 0 },
      { id: "d2-3", x: 48, y: 62, isCollected: false, fillLevel: 0 },
    ],
    tub: {
      x: 40,
      y: 58,
      width: 20,
      height: 9,
      targetWater: 30,
    },
    spawners: [
      { x: 26, y: 8, count: 110 },
      { x: 72, y: 8, count: 110 },
    ],
    generateTerrain: (w, h) => {
      const grid = new Uint8Array(w * h);
      const startY = Math.floor(h * 0.22);
      const tubX = Math.floor(w * 0.4);
      const tubY = Math.floor(h * 0.78);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (x < 2 || x >= w - 2 || y >= h - 1) {
            grid[y * w + x] = CELL_ROCK;
          }
        }
      }

      // Center Sky Palace Arch Column separating left and right
      const centerColX = Math.floor(w * 0.48);
      fillRect(grid, w, h, centerColX - 2, h * 0.05, centerColX + 2, h * 0.55, CELL_ROCK);

      // Left water cloud pool
      const leftX0 = Math.floor(w * 0.16);
      const leftX1 = Math.floor(w * 0.38);
      const resY1 = Math.floor(h * 0.16);
      fillRect(grid, w, h, leftX0 - 2, resY1 + 1, leftX1 + 2, resY1 + 1, CELL_ROCK);
      // Cloud plug
      fillRect(grid, w, h, leftX0 + 4, resY1 + 1, leftX1 - 4, resY1 + 2, CELL_CLOUD_PINK);

      // Right water cloud pool
      const rightX0 = Math.floor(w * 0.62);
      const rightX1 = Math.floor(w * 0.84);
      fillRect(grid, w, h, rightX0 - 2, resY1 + 1, rightX1 + 2, resY1 + 1, CELL_ROCK);
      // Cloud plug
      fillRect(grid, w, h, rightX0 + 4, resY1 + 1, rightX1 - 4, resY1 + 2, CELL_CLOUD_LAVENDER);

      // Generate vast cloud ocean
      generateCloudOcean(grid, w, h, startY, tubX, tubY);

      // Duck cloud grottoes
      [
        { x: Math.floor(w * 0.24), y: Math.floor(h * 0.45) },
        { x: Math.floor(w * 0.74), y: Math.floor(h * 0.45) },
        { x: Math.floor(w * 0.49), y: Math.floor(h * 0.68) },
      ].forEach(({ x, y }) => {
        fillCircle(grid, w, h, x, y, 4, CELL_AIR);
      });

      // Terrace wooden railings
      fillRect(grid, w, h, w * 0.18, h * 0.56, w * 0.36, h * 0.58, CELL_WOOD);
      fillRect(grid, w, h, w * 0.64, h * 0.56, w * 0.82, h * 0.58, CELL_WOOD);

      return grid;
    },
  },

  // ================= LEVEL 3: MOONLIT WATERFALL =================
  {
    id: "level-3",
    number: "03",
    name: "星月天阶 · 幻境瀑布",
    theme: "sky-night",
    subtitle: "穿过层层彩色月光云朵与悬空天桥，开辟最美云泉天路！",
    gridWidth: 100,
    gridHeight: 70,
    ducks: [
      { id: "d3-1", x: 74, y: 35, isCollected: false, fillLevel: 0 },
      { id: "d3-2", x: 26, y: 52, isCollected: false, fillLevel: 0 },
      { id: "d3-3", x: 70, y: 65, isCollected: false, fillLevel: 0 },
    ],
    tub: {
      x: 66,
      y: 56,
      width: 20,
      height: 9,
      targetWater: 32,
    },
    spawners: [
      { x: 30, y: 8, count: 220 },
    ],
    generateTerrain: (w, h) => {
      const grid = new Uint8Array(w * h);
      const startY = Math.floor(h * 0.22);
      const tubX = Math.floor(w * 0.66);
      const tubY = Math.floor(h * 0.78);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (x < 2 || x >= w - 2 || y >= h - 1) {
            grid[y * w + x] = CELL_ROCK;
          }
        }
      }

      // Top cloud reservoir
      const resX0 = Math.floor(w * 0.18);
      const resX1 = Math.floor(w * 0.44);
      const resY1 = Math.floor(h * 0.16);
      fillRect(grid, w, h, resX0 - 2, resY1 + 1, resX1 + 2, resY1 + 1, CELL_ROCK);
      // Cloud plug
      fillRect(grid, w, h, resX0 + 4, resY1 + 1, resX1 - 4, resY1 + 2, CELL_CLOUD_PEACH);

      // Generate vast cloud ocean
      generateCloudOcean(grid, w, h, startY, tubX, tubY);

      // Zig-zag sky stone steps
      fillRect(grid, w, h, w * 0.08, h * 0.42, w * 0.58, h * 0.45, CELL_ROCK);
      fillRect(grid, w, h, w * 0.42, h * 0.6, w * 0.92, h * 0.63, CELL_ROCK);

      // Duck pockets
      [
        { x: Math.floor(w * 0.74), y: Math.floor(h * 0.38) },
        { x: Math.floor(w * 0.26), y: Math.floor(h * 0.54) },
        { x: Math.floor(w * 0.7), y: Math.floor(h * 0.7) },
      ].forEach(({ x, y }) => {
        fillCircle(grid, w, h, x, y, 4, CELL_AIR);
      });

      return grid;
    },
  },
];
