"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  originalStreetLook, restoreStreetLook, streetCanvas, streetColors, streetParts, streetSources,
  type FittingCharacter, type StreetLook, type StreetPart,
} from "@/lib/street-character";

const KEY = "dreamio-street-character-v1";
const accessoryParts = ["bag", "headband", "earrings"] as const;

export function useStreetCharacter() {
  const [state, setState] = useState({ character: "street" as FittingCharacter, look: { ...originalStreetLook } });
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    function restore(raw: string | null) {
      let next = { character: "street" as FittingCharacter, look: { ...originalStreetLook } };
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          next = {
            character: parsed?.character === "original" ? "original" : "street",
            look: restoreStreetLook(JSON.stringify(parsed?.look ?? null)),
          };
        } catch { /* Retain the complete outfit. */ }
      }
      current.current = next;
      setState(next);
    }
    try { restore(localStorage.getItem(KEY)); } catch { setStorageAvailable(false); }
    setReady(true);
    const sync = (event: StorageEvent) => { if (event.key === KEY) restore(event.newValue); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function save(character: FittingCharacter, look: StreetLook) {
    if (!ready) return;
    const next = { character, look };
    current.current = next;
    setState(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { setStorageAvailable(false); }
  }
  return {
    ...state, ready, storageAvailable,
    select: (character: FittingCharacter) => save(character, current.current.look),
    update: (change: Partial<StreetLook>) => save(current.current.character, { ...current.current.look, ...change, version: 1 }),
    reset: () => save(current.current.character, { ...originalStreetLook }),
  };
}

function PartMask({ id, part }: { id: string; part: StreetPart }) {
  const item = streetParts[part];
  return <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" {...streetCanvas} style={{ maskType: "luminance" }}>
    <rect {...streetCanvas} fill="black" />
    <path d={item.path} fill="white" />
    {item.subtract && <path d={item.subtract} fill="black" />}
  </mask>;
}

export function StreetCharacter({ look, portrait = false }: { look: StreetLook; portrait?: boolean }) {
  const id = useId().replace(/:/g, "");
  const complete = look.jacket && accessoryParts.every((part) => look[part]) && look.dressColor === "ivory";
  const source = look.jacket ? streetSources.jacket : streetSources.base;
  const color = streetColors.find((option) => option.id === look.dressColor)!;
  return <svg viewBox={portrait ? "302 140 282 262" : "0 0 887 1774"}
    preserveAspectRatio={portrait ? "xMidYMid slice" : "xMidYMax meet"} role="img"
    aria-label={portrait ? "Portrait of the leather and lace character" : "Photo-based leather and lace character, full body"}>
    <defs>
      {accessoryParts.map((part) => <PartMask key={part} id={`${id}-${part}`} part={part} />)}
      <PartMask id={`${id}-dress`} part="dress" />
      <mask id={`${id}-exposed-dress`} maskUnits="userSpaceOnUse" x="0" y="0" {...streetCanvas} style={{ maskType: "luminance" }}>
        <path d={streetParts.dress.path} fill="white" />
        {streetParts.dress.subtract && <path d={streetParts.dress.subtract} fill="black" />}
        {look.jacket && <path d={streetParts.jacket.path} fill="black" />}
      </mask>
    </defs>
    <image data-street-layer="fullbody" href={complete ? streetSources.original : source} {...streetCanvas} />
    {!complete && <>
      {look.dressColor !== "ivory" && <image data-street-layer="dress-color" href={streetSources.base} {...streetCanvas}
        mask={`url(#${id}-exposed-dress)`} style={{ filter: color.filter }} />}
      {accessoryParts.filter((part) => look[part]).map((part) => <image key={part} data-street-layer={part}
        href={streetSources.original} {...streetCanvas} mask={`url(#${id}-${part})`} />)}
    </>}
  </svg>;
}

export function StreetItemArt({ part, color = "ivory" }: { part: StreetPart; color?: StreetLook["dressColor"] }) {
  const id = useId().replace(/:/g, "");
  const item = streetParts[part];
  return <svg viewBox={item.crop} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs><PartMask id={id} part={part} /></defs>
    <image href={item.source} {...streetCanvas} mask={`url(#${id})`}
      style={part === "dress" ? { filter: streetColors.find((option) => option.id === color)!.filter } : undefined} />
  </svg>;
}
