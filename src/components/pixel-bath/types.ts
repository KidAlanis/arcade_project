export const CELL_AIR = 0;
export const CELL_DIRT = 1;
export const CELL_ROCK = 2;
export const CELL_WOOD = 3;

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
  theme: "farm" | "greenhouse" | "mine" | "cherry";
  subtitle: string;
  gridWidth: number;
  gridHeight: number;
  ducks: RubberDuck[];
  tub: TubIntake;
  spawners: WaterSpawner[];
  // Initial terrain generator function
  generateTerrain: (width: number, height: number) => Uint8Array;
}
