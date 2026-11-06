export type StreetPart = "jacket" | "bag" | "headband" | "earrings" | "dress" | "boots";
export type StreetColor = "ivory" | "lilac" | "pink";
export type StreetLook = {
  version: 1;
  jacket: boolean;
  bag: boolean;
  headband: boolean;
  earrings: boolean;
  dressColor: StreetColor;
};
export type FittingCharacter = "street" | "original";
export const streetCanvas = { width: 887, height: 1774 } as const;
export const streetSources = {
  original: "/art/character/street-girl.png",
  jacket: "/art/character/street-girl-clean.png",
  base: "/art/character/street-girl-base.png",
} as const;
export const originalStreetLook: StreetLook = {
  version: 1, jacket: true, bag: true, headband: true, earrings: true, dressColor: "ivory",
};
export const streetColors = [
  { id: "ivory", name: "Original Ivory", filter: "none" },
  { id: "lilac", name: "Lilac Lace", filter: "sepia(.35) saturate(1.7) hue-rotate(205deg) brightness(.94)" },
  { id: "pink", name: "Blush Lace", filter: "sepia(.3) saturate(1.8) hue-rotate(285deg) brightness(.97)" },
] as const;

// Every item uses the same source canvas. Legs and boots are never stretched or spliced.
export const streetParts: Record<StreetPart, { name: string; crop: string; path: string; source: string; subtract?: string }> = {
  jacket: {
    name: "Black Leather Jacket", crop: "145 390 595 545", source: streetSources.jacket,
    path: "M281 442L344 405L398 401L439 439L469 469L509 408L561 403L621 451L646 526L674 683L698 778L724 889L650 916L629 881L562 919L535 795L517 673L477 648L443 771L423 918L275 894L259 857L239 914L158 893L180 788L207 700L226 578Z",
    subtract: "M337 393L405 399L444 469L466 565L473 671L454 717L419 740L361 705L346 597Z",
  },
  bag: {
    name: "Gold-chain Mini Bag", crop: "228 815 140 140", source: streetSources.original,
    path: "M347 403L361 408L360 601L335 733L306 835L341 835L356 857L355 932L329 944L241 934L230 909L233 852L253 830L294 829L325 729L350 598Z",
  },
  headband: {
    name: "Black Satin Headband", crop: "292 65 284 122", source: streetSources.original,
    path: "M293 173Q339 59 454 78Q529 77 573 138L562 155Q511 95 449 101Q354 87 305 187Z",
  },
  earrings: {
    name: "Silver Earrings", crop: "354 282 204 62", source: streetSources.original,
    path: "M360 299L381 302L392 319L382 337L367 326Z M533 286L552 287L551 309L537 321L532 306Z",
  },
  dress: {
    name: "Ivory Lace Dress", crop: "218 400 454 664", source: streetSources.base,
    path: "M369 410L428 401L474 422L515 399L547 410L564 467L563 610L555 689L589 770L617 851L667 982L654 1012L599 1040L534 1055L475 1042L441 1057L388 1041L328 1046L271 1022L222 996L232 951L284 825L331 730L350 641L346 520Z",
    subtract: "M338 391L407 398L443 468L467 564L474 667L452 715L416 738L360 704L345 594Z",
  },
  boots: {
    name: "Black Knee-high Boots", crop: "278 1270 342 477", source: streetSources.original,
    path: "M280 1273H622V1751H280Z",
  },
};

export function restoreStreetLook(raw: string): StreetLook {
  const look = { ...originalStreetLook };
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1) return look;
    for (const key of ["jacket", "bag", "headband", "earrings"] as const) {
      if (typeof value[key] === "boolean") look[key] = value[key];
    }
    if (streetColors.some((color) => color.id === value.dressColor)) look.dressColor = value.dressColor;
  } catch { /* Invalid local data falls back to the complete photo outfit. */ }
  return look;
}
