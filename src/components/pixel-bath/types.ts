export const CELL_AIR = 0;
export const CELL_CLOUD_WHITE = 1; // 经典白棉花云
export const CELL_DIRT = 1;        // 兼容别名
export const CELL_CLOUD = 1;       // 兼容别名
export const CELL_ROCK = 2;        // 天空浮岛巨石 / 宫殿石柱（不可破坏）
export const CELL_WOOD = 3;        // 露台围栏 / 宫殿木梁
export const CELL_CLOUD_PINK = 4;     // 梦幻粉色云
export const CELL_CLOUD_LAVENDER = 5; // 梦幻薰衣草紫云
export const CELL_CLOUD_PEACH = 6;    // 梦幻霞光桃粉云

export function isCloud(cell: number): boolean {
  return (
    cell === CELL_CLOUD_WHITE ||
    cell === CELL_CLOUD_PINK ||
    cell === CELL_CLOUD_LAVENDER ||
    cell === CELL_CLOUD_PEACH
  );
}

export interface WaterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface RubberDuck {
  id: string;
  x: number; // grid coordinate
  y: number;
  isCollected: boolean;
  fillLevel: number; // 0 to 1
}

export interface TubIntake {
  x: number; // grid coordinate
  y: number;
  width: number;
  height: number;
  targetWater: number;
}

export interface WaterSpawner {
  x: number;
  y: number;
  count: number;
}

export interface BathLevel {
  id: string;
  number: string;
  name: string;
  theme: "sky-sunset" | "sky-night" | "sky-palace" | "farm" | "greenhouse" | "mine" | "cherry";
  subtitle: string;
  gridWidth: number;
  gridHeight: number;
  ducks: RubberDuck[];
  tub: TubIntake;
  spawners: WaterSpawner[];
  // Initial terrain generator function (dynamically adapts to width & height)
  generateTerrain: (width: number, height: number) => Uint8Array;
}
