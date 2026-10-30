import { updateBalance } from "./wallet";

export type Category = "top" | "bottom" | "shoes" | "accessory";
export type Item = {
  id: string;
  name: string;
  category: Category;
  color: string;
  dark: string;
  price: number;
  style?: string;
  tag?: string;
};
export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "top", label: "Tops", icon: "shirt" },
  { id: "bottom", label: "Bottoms", icon: "pants" },
  { id: "shoes", label: "Shoes", icon: "shoe" },
  { id: "accessory", label: "Accessories", icon: "bow" },
];
export const items: Item[] = [
  {
    id: "top-white",
    name: "Cloud Nine Tee",
    category: "top",
    color: "#fff9ee",
    dark: "#b5aacb",
    price: 0,
  },
  {
    id: "bottom-blue",
    name: "Sky Blue Jeans",
    category: "bottom",
    color: "#91b5e4",
    dark: "#6378b5",
    price: 0,
  },
  {
    id: "shoes-white",
    name: "Cream Sneakers",
    category: "shoes",
    color: "#fff8ed",
    dark: "#aa9bbd",
    price: 0,
  },
  {
    id: "top-pink",
    name: "Strawberry Hoodie",
    category: "top",
    color: "#f0a5c7",
    dark: "#bd6f9e",
    price: 20,
    style: "heart",
    tag: "HOT",
  },
  {
    id: "top-purple",
    name: "Lavender Daydream",
    category: "top",
    color: "#b9a6e9",
    dark: "#8270af",
    price: 20,
    style: "star",
  },
  {
    id: "top-mint",
    name: "Mint Soda Jacket",
    category: "top",
    color: "#a0d7c4",
    dark: "#619e9a",
    price: 25,
    tag: "NEW",
  },
  {
    id: "bottom-skirt",
    name: "Cherry Blossom Skirt",
    category: "bottom",
    color: "#eda8c8",
    dark: "#b77ba6",
    price: 15,
    style: "skirt",
  },
  {
    id: "bottom-purple",
    name: "Starlight Trousers",
    category: "bottom",
    color: "#afa1de",
    dark: "#7866ab",
    price: 15,
  },
  {
    id: "shoes-purple",
    name: "Berry Platform Boots",
    category: "shoes",
    color: "#a58bc9",
    dark: "#67517d",
    price: 15,
  },
  {
    id: "accessory-bow",
    name: "Sweetheart Bow",
    category: "accessory",
    color: "#ee91bb",
    dark: "#b75f92",
    price: 10,
    style: "bow",
    tag: "NEW",
  },
  {
    id: "accessory-star",
    name: "Little Star Clip",
    category: "accessory",
    color: "#ffe69f",
    dark: "#b89258",
    price: 10,
    style: "star",
  },
  {
    id: "accessory-bunny",
    name: "Bunny Ears",
    category: "accessory",
    color: "#fff5eb",
    dark: "#bc90af",
    price: 30,
    style: "bunny",
  },
];
export type Look = Record<Category, string>;
export const defaultLook: Look = {
  top: "top-white",
  bottom: "bottom-blue",
  shoes: "shoes-white",
  accessory: "",
};
export type DreamState = {
  version: 1;
  nickname: string;
  tickets: number;
  owned: string[];
  look: Look;
  hair: number;
  skin: number;
  lastCheckIn: string;
  streak: number;
  rewards: Record<string, string>;
  best: Record<string, number>;
};
export function initialDream(): DreamState {
  return {
    version: 1,
    nickname: "",
    tickets: 0,
    owned: items.filter((i) => i.price === 0).map((i) => i.id),
    look: { ...defaultLook },
    hair: 0,
    skin: 0,
    lastCheckIn: "",
    streak: 0,
    rewards: {},
    best: {},
  };
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function claimDaily(
  state: DreamState,
  date = new Date(),
): DreamState | null {
  const today = localDay(date);
  if (!state.nickname || state.lastCheckIn >= today) return null;
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const streak =
    state.lastCheckIn === localDay(yesterday) ? state.streak + 1 : 1;
  const tickets = updateBalance(
    state.tickets,
    20 + (streak % 7 === 0 ? 50 : 0),
    "add",
  );
  return tickets === null
    ? null
    : { ...state, tickets, lastCheckIn: today, streak };
}
export function buyItem(state: DreamState, id: string): DreamState | null {
  const item = items.find((i) => i.id === id);
  if (!state.nickname || !item || state.owned.includes(id)) return null;
  const tickets = updateBalance(state.tickets, item.price, "spend");
  return tickets === null
    ? null
    : { ...state, tickets, owned: [...state.owned, id] };
}
export function equipItem(state: DreamState, id: string): DreamState | null {
  if (id === "") return { ...state, look: { ...state.look, accessory: "" } };
  const item = items.find((i) => i.id === id);
  return item && state.owned.includes(id)
    ? { ...state, look: { ...state.look, [item.category]: id } }
    : null;
}
export function finishGame(
  state: DreamState,
  slug: string,
  score: number,
  date = new Date(),
): DreamState | null {
  if (
    !["game-1", "game-2", "game-3"].includes(slug) ||
    !Number.isSafeInteger(score) ||
    score <= 0
  )
    return null;
  const today = localDay(date);
  const reward = state.nickname && state.rewards[slug] !== today ? 10 : 0;
  const tickets = reward
    ? updateBalance(state.tickets, reward, "add")
    : state.tickets;
  if (tickets === null) return null;
  return {
    ...state,
    tickets,
    best: { ...state.best, [slug]: Math.max(state.best[slug] || 0, score) },
    rewards: reward ? { ...state.rewards, [slug]: today } : state.rewards,
  };
}
export function restoreDream(raw: string): DreamState {
  const base = initialDream();
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return base;
    const owned = [
      ...new Set<string>([
        ...base.owned,
        ...(Array.isArray(data.owned)
          ? data.owned.filter((id: unknown) => items.some((i) => i.id === id))
          : []),
      ]),
    ];
    const look = { ...base.look };
    for (const { id: category } of categories) {
      const id = data.look?.[category];
      if (
        owned.includes(id) &&
        items.some((i) => i.id === id && i.category === category)
      )
        look[category] = id;
    }
    const rewards: Record<string, string> = {};
    const best: Record<string, number> = {};
    for (const slug of ["game-1", "game-2", "game-3"]) {
      if (
        typeof data.rewards?.[slug] === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(data.rewards[slug])
      )
        rewards[slug] = data.rewards[slug];
      if (Number.isSafeInteger(data.best?.[slug]) && data.best[slug] > 0)
        best[slug] = data.best[slug];
    }
    return {
      ...base,
      nickname:
        typeof data.nickname === "string"
          ? data.nickname.trim().slice(0, 16)
          : "",
      tickets:
        Number.isSafeInteger(data.tickets) && data.tickets >= 0
          ? data.tickets
          : 0,
      owned,
      look,
      hair: [0, 1, 2].includes(data.hair) ? data.hair : 0,
      skin: [0, 1, 2].includes(data.skin) ? data.skin : 0,
      lastCheckIn:
        typeof data.lastCheckIn === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(data.lastCheckIn)
          ? data.lastCheckIn
          : "",
      streak:
        Number.isSafeInteger(data.streak) && data.streak >= 0 ? data.streak : 0,
      rewards,
      best,
    };
  } catch {
    return base;
  }
}
