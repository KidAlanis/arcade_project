"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  characterLayers,
  characterSource,
  characterBase,
  characterCanvas,
  characterRegions,
  characterForeground,
  dressColors,
  originalCharacterLook,
  restoreCharacterLook,
  type CharacterLayer,
  type CharacterLook,
} from "@/lib/character";

const KEY = "dreamio-photo-character-v1";
export function useCharacterLook() {
  const [look, setLook] = useState<CharacterLook>({ ...originalCharacterLook });
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const current = useRef(look);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) current.current = restoreCharacterLook(raw);
    } catch {
      setStorageAvailable(false);
    }
    setLook(current.current);
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== KEY) return;
      current.current = event.newValue
        ? restoreCharacterLook(event.newValue)
        : { ...originalCharacterLook };
      setLook(current.current);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function update(change: Partial<CharacterLook>) {
    if (!ready) return;
    const next = { ...current.current, ...change, version: 1 as const };
    current.current = next;
    setLook(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      setStorageAvailable(false);
    }
  }
  return {
    look,
    ready,
    storageAvailable,
    update,
    reset: () => update({ ...originalCharacterLook }),
  };
}
const optionalParts = ["wings", "ears", "dress", "tights", "cuffs"] as const;
const removalRegion = (part: typeof optionalParts[number]) => part === "wings"
  ? "M0 280H300V680H0Z M625 280H887V660H625Z"
  : characterRegions[part];

export function LayeredCharacter({ look, portrait = false, className = "" }: {
  look: CharacterLook; portrait?: boolean; className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const hiddenParts = optionalParts.filter((part) => !look[part]);
  const filter = dressColors.find((color) => color.id === look.dressColor)!.filter;
  const maskSize = { x: 0, y: 0, width: characterCanvas.width, height: characterCanvas.height };
  return (
    <svg className={className} viewBox={portrait ? "270 115 350 330" : "0 0 887 1774"}
      preserveAspectRatio={portrait ? "xMidYMid slice" : "xMidYMax meet"} role="img"
      aria-label={portrait ? "Portrait of your photo-based character" : "Your photo-based character with layered outfit"}>
      <defs>
        <mask id={`${id}-source`} maskUnits="userSpaceOnUse" {...maskSize} style={{ maskType: "luminance" }}>
          {look.dress ? <>
            <rect {...maskSize} fill="white" />
            {hiddenParts.map((part) => <path key={part} d={removalRegion(part)} fill="black" />)}
          </> : <>
            <rect {...maskSize} fill="black" />
            <rect x="250" y="180" width="400" height="295" fill="white" />
            {optionalParts.filter((part) => part !== "dress" && look[part]).map((part) => <path key={part} d={characterRegions[part]} fill="white" />)}
          </>}
        </mask>
        <mask id={`${id}-base`} maskUnits="userSpaceOnUse" {...maskSize} style={{ maskType: "luminance" }}>
          <rect {...maskSize} fill={look.dress ? "black" : "white"} />
          {look.dress && hiddenParts.map((part) => <path key={part} d={removalRegion(part)} fill="white" />)}
        </mask>
        <mask id={`${id}-dress`} maskUnits="userSpaceOnUse" {...maskSize} style={{ maskType: "luminance" }}>
          <rect {...maskSize} fill="black" /><path d={characterRegions.dress} fill="white" /><path d={characterForeground} fill="black" /><path d={characterRegions.tights} fill="black" />
        </mask>
      </defs>
      {hiddenParts.length > 0 && <image data-character-layer="covered-base" href={characterBase} {...maskSize} mask={`url(#${id}-base)`} />}
      <image data-character-layer="canonical-fullbody" href={characterSource} {...maskSize} mask={`url(#${id}-source)`} />
      {look.dress && look.dressColor !== "original" && <image data-character-layer="dress-color" href={characterSource} {...maskSize} mask={`url(#${id}-dress)`} style={{ filter }} />}
    </svg>
  );
}

export function CharacterLayerArt({ layer, color = "original" }: {
  layer: CharacterLayer; color?: CharacterLook["dressColor"];
}) {
  const id = useId().replace(/:/g, "");
  const asset = characterLayers.find((item) => item.id === layer)!;
  const region = layer === "body" || layer === "foreground" ? null : characterRegions[layer];
  return (
    <svg viewBox={asset.crop} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {region && <defs><mask id={`${id}-part`} maskUnits="userSpaceOnUse" x="0" y="0" width="887" height="1774" style={{ maskType: "luminance" }}>
        <rect width="887" height="1774" fill="black" /><path d={region} fill="white" />
        {layer === "dress" && <path d={characterForeground} fill="black" />}
        {layer === "dress" && <path d={characterRegions.tights} fill="black" />}
      </mask></defs>}
      <image href={asset.src} width="887" height="1774" mask={region ? `url(#${id}-part)` : undefined}
        style={layer === "dress" ? { filter: dressColors.find((option) => option.id === color)!.filter } : undefined} />
    </svg>
  );
}
