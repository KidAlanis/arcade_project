export type CharacterLayer =
  "body" | "wings" | "dress" | "tights" | "foreground" | "ears" | "cuffs" | "boots";
export type DressColor = "original" | "lavender" | "rose";
export type CharacterLook = {
  version: 1;
  dress: boolean;
  wings: boolean;
  tights: boolean;
  ears: boolean;
  cuffs: boolean;
  dressColor: DressColor;
};
export const originalCharacterLook: CharacterLook = {
  version: 1,
  dress: true,
  wings: true,
  tights: true,
  ears: true,
  cuffs: true,
  dressColor: "original",
};
export const characterCanvas = { width: 887, height: 1774 } as const;
export const characterSource = "/art/character/fullbody-boots.png";
export const characterBase = "/art/character/fullbody-base.png";
export const characterRegions = {
  wings: "M20 310L125 330L215 380L263 407L264 470L245 560L208 631L110 600L35 510Z M642 414L699 375L854 300L875 356L855 462L820 541L724 609L660 600L655 530Z",
  ears: "M274 158Q292 78 344 38L366 49L407 121L392 167Z M491 130L542 39L575 48L595 143L579 176Z",
  cuffs: "M208 803L245 787L303 810L289 866L220 852Z",
  dress: "M275 497L338 514L365 534L535 533L555 509L596 497L620 510L613 551L603 608L593 685L590 779L654 839L683 875L666 911L691 951L708 1008L667 1047L608 1064L537 1052L466 1063L392 1045L326 1049L279 1031L244 1006L226 965L239 921L261 894L278 840L321 796L341 744L351 680L350 591L313 540L277 530Z",
  tights: "M303 1007L450 1019L440 1136L423 1256L323 1258L322 1176L312 1094Z M471 1020L613 1017L619 1115L638 1255L537 1260L509 1191L493 1095Z",
  boots: "M285 1225H710V1760H285Z",
};
// Keep hair, arms and the phone in their original colors above costume edits.
export const characterForeground = "M342 475C365 519 391 591 396 659C399 738 375 784 351 797L350 744C365 676 350 597 337 542Z M536 465L582 508Q612 620 601 722L621 810L585 837Q563 756 558 693L555 571Z M280 443Q302 432 335 440L354 494L350 570L351 638Q356 708 318 776L281 850L271 885L278 926L268 988L253 1017L204 990L183 960L204 875L223 815L255 738L265 635L263 529Z M538 366L608 369L653 421L671 503L686 623L666 688L626 669L606 604L600 541L574 489L534 438Z";
const sourceSize = [887, 1774] as const;
export const characterLayers: {
  id: CharacterLayer;
  name: string;
  src: string;
  crop: string;
  sourceSize?: readonly [number, number];
}[] = [
  { id: "wings", name: "Black Feather Wings", src: characterSource, crop: "0 295 887 350", sourceSize },
  { id: "body", name: "Covered Base Character", src: characterBase, crop: "265 45 350 360", sourceSize },
  { id: "tights", name: "Lace Fishnet Tights", src: characterSource, crop: "290 1000 370 270", sourceSize },
  { id: "dress", name: "Black Corset Dress", src: characterSource, crop: "225 490 490 580", sourceSize },
  { id: "foreground", name: "Original Hair, Face and Selfie Pose", src: characterSource, crop: "265 45 350 360", sourceSize },
  { id: "ears", name: "Black Cat Ears", src: characterSource, crop: "270 30 335 155", sourceSize },
  { id: "cuffs", name: "Silver Studded Cuff", src: characterSource, crop: "200 780 115 95", sourceSize },
  { id: "boots", name: "Black Lace-up Boots", src: characterSource, crop: "280 1225 435 535", sourceSize },
];
export const dressColors: {
  id: DressColor;
  name: string;
  color: string;
  filter: string;
}[] = [
  { id: "original", name: "Original Black", color: "#37313f", filter: "none" },
  {
    id: "lavender",
    name: "Lavender Corset",
    color: "#a999d4",
    filter: "brightness(2.1) sepia(.65) saturate(1.7) hue-rotate(208deg)",
  },
  {
    id: "rose",
    name: "Rose Corset",
    color: "#cc98b5",
    filter: "brightness(2) sepia(.7) saturate(1.7) hue-rotate(287deg)",
  },
];
export function restoreCharacterLook(raw: string): CharacterLook {
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1) return { ...originalCharacterLook };
    const look = { ...originalCharacterLook };
    for (const key of ["dress", "wings", "tights", "ears", "cuffs"] as const) {
      if (typeof value[key] === "boolean") look[key] = value[key];
    }
    if (dressColors.some((color) => color.id === value.dressColor))
      look.dressColor = value.dressColor;
    return look;
  } catch {
    return { ...originalCharacterLook };
  }
}
