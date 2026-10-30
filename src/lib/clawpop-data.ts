export interface PlushToy {
  id: string;
  name: string;
  japaneseName: string;
  title: string;
  color: string;
  accentColor: string;
  personality: string;
  favoritePhrase: string;
  rarity: "common" | "uncommon" | "rare";
  // Position coordinates in the plush pit (percentage 0-100)
  defaultX: number;
  defaultY: number;
  scale: number;
}

export const PLUSH_CATALOG: PlushToy[] = [
  {
    id: "popu",
    name: "Popu",
    japaneseName: "ポプ",
    title: "Bubblegum Puff",
    color: "#ff9ec4",
    accentColor: "#ff5997",
    personality: "A round, bubbly pink marshmallow who loves dancing to bubblegum pop songs and giving sweet hugs.",
    favoritePhrase: "Poyo-pop! ♡",
    rarity: "common",
    defaultX: 48,
    defaultY: 66,
    scale: 1.05,
  },
  {
    id: "purin",
    name: "Purin Bear",
    japaneseName: "プリンくま",
    title: "Caramel Custard",
    color: "#ffe071",
    accentColor: "#b26829",
    personality: "A sleepy little bear made of sweet egg pudding. Wears a glossy caramel hat and snoozes everywhere.",
    favoritePhrase: "Wobbly dreams... zzz",
    rarity: "common",
    defaultX: 74,
    defaultY: 70,
    scale: 1.0,
  },
  {
    id: "berry",
    name: "Berry Squish",
    japaneseName: "ベリスク",
    title: "Lavender Kitten",
    color: "#cdb4ff",
    accentColor: "#9364e8",
    personality: "A round lavender kitten-drop with wild strawberry ears. Sneaks candy when no one is looking.",
    favoritePhrase: "Nya-berry bite!",
    rarity: "common",
    defaultX: 30,
    defaultY: 68,
    scale: 0.98,
  },
  {
    id: "mame",
    name: "Mame Bun",
    japaneseName: "まめパン",
    title: "Melon Turtle",
    color: "#b4f8c8",
    accentColor: "#3bb273",
    personality: "A cheerful melon-bread turtle bun who smells faintly of vanilla sugar and fresh bakery warmness.",
    favoritePhrase: "Freshly baked smile! ✦",
    rarity: "uncommon",
    defaultX: 86,
    defaultY: 76,
    scale: 1.02,
  },
  {
    id: "ame",
    name: "Ame-chan",
    japaneseName: "アメちゃん",
    title: "Dewdrop Dreamer",
    color: "#a0e7e5",
    accentColor: "#3baea3",
    personality: "A tender sky-blue cloud drop with a cherry ribbon. Brings soothing rainy-day calm wherever she rests.",
    favoritePhrase: "Drip-drop sparkle... ✧",
    rarity: "uncommon",
    defaultX: 40,
    defaultY: 80,
    scale: 0.96,
  },
  {
    id: "hoshi",
    name: "Hoshi Poko",
    japaneseName: "ホシぽこ",
    title: "Starlight Poko",
    color: "#ffd384",
    accentColor: "#f39c12",
    personality: "A rare celestial star-puff who fell from the Milky Way into the arcade cabinet. Grants sweet luck!",
    favoritePhrase: "Twinkle twinkle pop! ★",
    rarity: "rare",
    defaultX: 62,
    defaultY: 82,
    scale: 1.1,
  },
  {
    id: "poko",
    name: "Poko Bunny",
    japaneseName: "ポコうさ",
    title: "Strawberry Mochi",
    color: "#fff0f5",
    accentColor: "#ff70a6",
    personality: "A fluffy white mochi bunny with strawberry jelly tipped ears. Squirms with joy when cuddled.",
    favoritePhrase: "Hop-hop mochi! ♡",
    rarity: "common",
    defaultX: 20,
    defaultY: 76,
    scale: 1.0,
  },
  {
    id: "kero",
    name: "Matcha Kero",
    japaneseName: "まっちゃケロ",
    title: "Tea Leaf Hopper",
    color: "#c2f0c2",
    accentColor: "#4cae4c",
    personality: "A gentle round green tea frog who loves meditating on giant water lilies and drinking matcha.",
    favoritePhrase: "Kero-kero zen! ✿",
    rarity: "common",
    defaultX: 58,
    defaultY: 66,
    scale: 0.98,
  },
  {
    id: "momo",
    name: "Momo Peach",
    japaneseName: "モモちゃん",
    title: "Juicy Sweetheart",
    color: "#ffc2d1",
    accentColor: "#e64980",
    personality: "A sun-warmed peach creature with a green leaf hat. Sweet, fragrant, and perpetually blushing.",
    favoritePhrase: "Peachy keen dream! ✦",
    rarity: "uncommon",
    defaultX: 68,
    defaultY: 78,
    scale: 1.04,
  },
  {
    id: "choco",
    name: "Choco Nyan",
    japaneseName: "チョコにゃん",
    title: "Toasted Truffle",
    color: "#d4a373",
    accentColor: "#7f4f24",
    personality: "A cocoa-dusted kitten puff with chocolate bean paws and heart-shaped cheeks.",
    favoritePhrase: "Sweet melt nya! 🍫",
    rarity: "common",
    defaultX: 34,
    defaultY: 84,
    scale: 0.98,
  },
  {
    id: "sora",
    name: "Sora Penguin",
    japaneseName: "ソラペン",
    title: "Cloud Glider",
    color: "#bde0fe",
    accentColor: "#3a86ff",
    personality: "A round baby penguin who believes with all its heart that it can fly if it flaps fast enough.",
    favoritePhrase: "Sora flap-flap! ☁️",
    rarity: "uncommon",
    defaultX: 80,
    defaultY: 82,
    scale: 1.0,
  },
  {
    id: "milky",
    name: "Milky Uni",
    japaneseName: "ミルキー",
    title: "Dream Unicorn",
    color: "#e8d7ff",
    accentColor: "#9d4edd",
    personality: "An ethereal round unicorn ball with a shimmering golden sugar horn. Whispers comforting bedtime stories.",
    favoritePhrase: "Magic dust dream... ✧",
    rarity: "rare",
    defaultX: 50,
    defaultY: 84,
    scale: 1.08,
  },
];

// Rich, layered multi-toy pit arrangement (20 plushies stacked across the floor)
export const INITIAL_PIT_LAYOUT: {
  toyId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}[] = [
  // Deep Background Layer (back of pile)
  { toyId: "purin", x: 74, y: 64, scale: 0.92, rotation: -8 },
  { toyId: "kero", x: 56, y: 62, scale: 0.90, rotation: 10 },
  { toyId: "berry", x: 38, y: 63, scale: 0.92, rotation: -6 },
  { toyId: "poko", x: 24, y: 65, scale: 0.90, rotation: 12 },
  { toyId: "mame", x: 88, y: 66, scale: 0.94, rotation: -10 },

  // Mid Layer (main targets)
  { toyId: "popu", x: 48, y: 70, scale: 1.05, rotation: 4 },
  { toyId: "momo", x: 66, y: 72, scale: 1.02, rotation: -4 },
  { toyId: "sora", x: 82, y: 73, scale: 0.98, rotation: 8 },
  { toyId: "choco", x: 32, y: 72, scale: 0.98, rotation: -7 },
  { toyId: "ame", x: 22, y: 75, scale: 0.96, rotation: 5 },
  { toyId: "hoshi", x: 58, y: 74, scale: 1.04, rotation: -2 },
  { toyId: "milky", x: 42, y: 76, scale: 1.06, rotation: 6 },

  // Foreground Layer (front edge, tumbled & overlapping)
  { toyId: "popu", x: 70, y: 82, scale: 1.08, rotation: 12 },
  { toyId: "purin", x: 86, y: 84, scale: 1.00, rotation: -14 },
  { toyId: "kero", x: 50, y: 84, scale: 0.96, rotation: -5 },
  { toyId: "berry", x: 34, y: 84, scale: 1.00, rotation: 9 },
  { toyId: "momo", x: 62, y: 86, scale: 1.04, rotation: 7 },
  { toyId: "poko", x: 24, y: 85, scale: 1.02, rotation: -8 },
  { toyId: "hoshi", x: 78, y: 87, scale: 1.10, rotation: -3 },
  { toyId: "sora", x: 42, y: 88, scale: 0.98, rotation: 11 },
];

export const WIN_MESSAGES = [
  "Congratulations!",
  "You Got One!",
  "Lucky Catch! ★",
  "Plushie Secured! ♡",
  "Super Grab! ✦",
  "Dreamio Winner! ✧",
];

export const DROP_FAILURE_MESSAGES = [
  "Aww, so close! It slipped away! (っ˘̩╭╮˘̩)っ",
  "Oops! Butterfingers claw! (；´д｀)",
  "Almost had it! It tumbled back down! ✦",
  "Slipped right out! Give it one more try! ♡",
  "The plushie wriggled free! (,,>﹏<,,)",
];

export const MISS_MESSAGES = [
  "Whoosh! Missed by a whisker! (っ- ‸ - ς)",
  "Grabbed thin air! Adjust your aim! ✦",
  "Nothing in the claw! Try re-positioning! ♡",
  "Just a little off-center! You got this! ✧",
];
