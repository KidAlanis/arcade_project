import {
  BathLevel,
  CELL_AIR,
  CELL_DIRT,
  CELL_ROCK,
  CELL_WOOD,
} from "./types";

const GW = 64;
const GH = 80;

export const BATH_LEVELS: BathLevel[] = [
  // ================= LEVEL 1: FARMSTEAD BACKYARD =================
  {
    id: "level-1",
    number: "01",
    name: "晨曦农场 · 后院暖汤",
    theme: "farm",
    subtitle: "用手指或鼠标挖掘泥土，指引清泉流入浴桶！",
    gridWidth: GW,
    gridHeight: GH,
    ducks: [
      { id: "d1-1", x: 26, y: 30, isCollected: false, fillLevel: 0 },
      { id: "d1-2", x: 44, y: 46, isCollected: false, fillLevel: 0 },
      { id: "d1-3", x: 22, y: 62, isCollected: false, fillLevel: 0 },
    ],
    tub: {
      x: 8,
      y: 68,
      width: 20,
      height: 10,
      targetWater: 24,
    },
    spawners: [
      { x: 38, y: 10, count: 140 },
    ],
    generateTerrain: (w, h) => {
      const grid = new Uint8Array(w * h);

      // Fill mostly with dirt
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          // Outer borders: Rock
          if (x < 2 || x >= w - 2 || y >= h - 2) {
            grid[idx] = CELL_ROCK;
          } else if (y < 4) {
            grid[idx] = CELL_AIR; // Sky/open top
          } else {
            grid[idx] = CELL_DIRT; // Default diggable soil
          }
        }
      }

      // Water basin at top: air pocket surrounded by rock/dirt
      for (let y = 6; y <= 16; y++) {
        for (let x = 28; x <= 50; x++) {
          grid[y * w + x] = CELL_AIR;
        }
      }
      // Basin bottom rock ridge to hold initial water until dug
      for (let x = 26; x <= 52; x++) {
        grid[17 * w + x] = CELL_ROCK;
      }
      // Leave a dirt plug at (36..42, 17) to be dug out
      for (let x = 36; x <= 42; x++) {
        grid[17 * w + x] = CELL_DIRT;
      }

      // Air pockets around ducks so they are visible
      const duckAir = [
        { x: 26, y: 30 },
        { x: 44, y: 46 },
        { x: 22, y: 62 },
      ];
      duckAir.forEach(({ x, y }) => {
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            grid[(y + dy) * w + (x + dx)] = CELL_AIR;
          }
        }
      });

      // Air pocket for Tub at bottom-left
      for (let y = 66; y < h - 2; y++) {
        for (let x = 6; x < 28; x++) {
          grid[y * w + x] = CELL_AIR;
        }
      }

      // A few solid stone boulders to direct water flow
      for (let y = 36; y <= 40; y++) {
        for (let x = 16; x <= 32; x++) {
          grid[y * w + x] = CELL_ROCK;
        }
      }
      for (let y = 52; y <= 56; y++) {
        for (let x = 34; x <= 50; x++) {
          grid[y * w + x] = CELL_ROCK;
        }
      }

      return grid;
    },
  },

  // ================= LEVEL 2: GREENHOUSE SPRINKLER =================
  {
    id: "level-2",
    number: "02",
    name: "星露温室 · 水滴迷宫",
    theme: "greenhouse",
    subtitle: "双侧蓄水池！分别引导水流收集全部小黄鸭！",
    gridWidth: GW,
    gridHeight: GH,
    ducks: [
      { id: "d2-1", x: 18, y: 28, isCollected: false, fillLevel: 0 },
      { id: "d2-2", x: 46, y: 32, isCollected: false, fillLevel: 0 },
      { id: "d2-3", x: 32, y: 56, isCollected: false, fillLevel: 0 },
    ],
    tub: {
      x: 22,
      y: 68,
      width: 20,
      height: 10,
      targetWater: 28,
    },
    spawners: [
      { x: 16, y: 10, count: 80 },
      { x: 48, y: 10, count: 80 },
    ],
    generateTerrain: (w, h) => {
      const grid = new Uint8Array(w * h);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          if (x < 2 || x >= w - 2 || y >= h - 2) {
            grid[idx] = CELL_ROCK;
          } else if (y < 4) {
            grid[idx] = CELL_AIR;
          } else {
            grid[idx] = CELL_DIRT;
          }
        }
      }

      // Center stone pillar separating left and right
      for (let y = 4; y <= 42; y++) {
        for (let x = 30; x <= 34; x++) {
          grid[y * w + x] = CELL_ROCK;
        }
      }

      // Left water pool
      for (let y = 6; y <= 14; y++) {
        for (let x = 8; x <= 26; x++) {
          grid[y * w + x] = CELL_AIR;
        }
      }
      for (let x = 6; x <= 28; x++) {
        grid[15 * w + x] = CELL_ROCK;
      }
      for (let x = 14; x <= 20; x++) {
        grid[15 * w + x] = CELL_DIRT; // Diggable release
      }

      // Right water pool
      for (let y = 6; y <= 14; y++) {
        for (let x = 38; x <= 56; x++) {
          grid[y * w + x] = CELL_AIR;
        }
      }
      for (let x = 36; x <= 58; x++) {
        grid[15 * w + x] = CELL_ROCK;
      }
      for (let x = 44; x <= 50; x++) {
        grid[15 * w + x] = CELL_DIRT; // Diggable release
      }

      // Duck pockets
      [
        { x: 18, y: 28 },
        { x: 46, y: 32 },
        { x: 32, y: 56 },
      ].forEach(({ x, y }) => {
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            grid[(y + dy) * w + (x + dx)] = CELL_AIR;
          }
        }
      });

      // Center tub chamber at bottom
      for (let y = 66; y < h - 2; y++) {
        for (let x = 20; x < 44; x++) {
          grid[y * w + x] = CELL_AIR;
        }
      }

      // Wooden beams
      for (let x = 12; x <= 22; x++) {
        grid[44 * w + x] = CELL_WOOD;
      }
      for (let x = 42; x <= 52; x++) {
        grid[44 * w + x] = CELL_WOOD;
      }

      return grid;
    },
  },

  // ================= LEVEL 3: CRYSTAL CAVERN =================
  {
    id: "level-3",
    number: "03",
    name: "晶石矿洞 · 幽蓝暗河",
    theme: "mine",
    subtitle: "蜿蜒石壁与晶石！避开深坑把甘泉送达！",
    gridWidth: GW,
    gridHeight: GH,
    ducks: [
      { id: "d3-1", x: 48, y: 24, isCollected: false, fillLevel: 0 },
      { id: "d3-2", x: 16, y: 44, isCollected: false, fillLevel: 0 },
      { id: "d3-3", x: 46, y: 58, isCollected: false, fillLevel: 0 },
    ],
    tub: {
      x: 36,
      y: 68,
      width: 20,
      height: 10,
      targetWater: 30,
    },
    spawners: [
      { x: 20, y: 8, count: 160 },
    ],
    generateTerrain: (w, h) => {
      const grid = new Uint8Array(w * h);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          if (x < 2 || x >= w - 2 || y >= h - 2) {
            grid[idx] = CELL_ROCK;
          } else {
            grid[idx] = CELL_DIRT;
          }
        }
      }

      // Top reservoir
      for (let y = 4; y <= 14; y++) {
        for (let x = 10; x <= 32; x++) {
          grid[y * w + x] = CELL_AIR;
        }
      }
      for (let x = 8; x <= 34; x++) {
        grid[15 * w + x] = CELL_ROCK;
      }
      for (let x = 18; x <= 24; x++) {
        grid[15 * w + x] = CELL_DIRT;
      }

      // Zig-zag stone baffles
      for (let y = 28; y <= 32; y++) {
        for (let x = 4; x <= 40; x++) {
          grid[y * w + x] = CELL_ROCK;
        }
      }
      for (let y = 46; y <= 50; y++) {
        for (let x = 24; x <= 60; x++) {
          grid[y * w + x] = CELL_ROCK;
        }
      }

      // Duck pockets
      [
        { x: 48, y: 24 },
        { x: 16, y: 44 },
        { x: 46, y: 58 },
      ].forEach(({ x, y }) => {
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            grid[(y + dy) * w + (x + dx)] = CELL_AIR;
          }
        }
      });

      // Bottom tub chamber
      for (let y = 66; y < h - 2; y++) {
        for (let x = 34; x < 58; x++) {
          grid[y * w + x] = CELL_AIR;
        }
      }

      return grid;
    },
  },
];
