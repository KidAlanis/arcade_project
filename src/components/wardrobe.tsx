"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Category } from "@/lib/dreamio";
import { dressColors, type CharacterLayer } from "@/lib/character";
import { streetColors, streetParts, type StreetPart } from "@/lib/street-character";
import { StreetCharacter, StreetItemArt, useStreetCharacter } from "./street-character";
import { useDreamerProfile } from "./dreamer-profile";
import { useTicketWallet } from "./ticket-wallet";
import { PixelIcon } from "./pixel-art";
import {
  CharacterLayerArt,
  LayeredCharacter,
  useCharacterLook,
} from "./layered-character";
import styles from "./wardrobe.module.css";

type RoomTab = Category | "hair" | "face";
const menu: { id: RoomTab; label: string; icon: string }[] = [
  { id: "top", label: "TOPS", icon: "shirt" },
  { id: "bottom", label: "BOTTOMS", icon: "pants" },
  { id: "dress", label: "DRESSES", icon: "dress" },
  { id: "shoes", label: "SHOES", icon: "shoe" },
  { id: "bag", label: "BAGS", icon: "bag" },
  { id: "accessory", label: "ACCESSORIES", icon: "bow" },
  { id: "hair", label: "HAIR", icon: "hair" },
  { id: "face", label: "FACE", icon: "face" },
];

function Hearts({ count, large = false }: { count: number; large?: boolean }) {
  return (
    <span
      className={`${styles.hearts} ${large ? styles.largeHearts : ""}`}
      aria-label={`${count} of 5 hearts`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <PixelIcon
          key={i}
          name="heart"
          size={large ? 23 : 14}
          className={i < count ? styles.pinkHeart : styles.blueHeart}
        />
      ))}
    </span>
  );
}

export function Wardrobe() {
  const { nickname, tickets } = useTicketWallet();
  const profile = useDreamerProfile();
  const { look, ready, storageAvailable, update, reset } = useCharacterLook();
  const street = useStreetCharacter();
  const isStreet = street.character === "street";
  const [tab, setTab] = useState<RoomTab>("top");
  const [closetOpen, setClosetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const photoDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setClosetOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const avatar = isStreet ? <StreetCharacter look={street.look} /> : <LayeredCharacter look={look} />;
  const portrait = isStreet ? <StreetCharacter look={street.look} portrait /> : <LayeredCharacter look={look} portrait />;
  const rating = isStreet ? {
    CUTE: street.look.headband ? 4 : 3,
    COOL: street.look.jacket ? 5 : 3,
    PRETTY: 4,
    TRENDY: street.look.bag ? 4 : 3,
  } : {
    CUTE: look.ears ? 4 : 3,
    COOL: look.wings ? 5 : 3,
    PRETTY: look.dress ? 4 : 3,
    TRENDY: look.cuffs ? 4 : 3,
  };
  const currentMenu = menu.find((m) => m.id === tab)!;
  function streetChoice(part: "jacket" | "bag" | "headband" | "earrings") {
    const item = streetParts[part];
    return <button key={part} className={`${styles.item} ${street.look[part] ? styles.selectedItem : ""}`}
      aria-label={item.name} aria-pressed={street.look[part]} disabled={!street.ready}
      onClick={() => {
        street.update({ [part]: !street.look[part] });
        setMessage(street.look[part] ? "A little less. A new mood. ♡" : "NEW LOOK! Looking good. ♥");
      }}>
      <StreetItemArt part={part} /><span>{item.name}</span>
      <b className={styles.shopPrice}>{street.look[part] ? "ON · TAP TO REMOVE" : "OFF · TAP TO WEAR"}</b>
    </button>;
  }
  function renderStreetChoices() {
    if (tab === "top") return <>{streetChoice("jacket")}<p className={styles.editorNote}>Wear the leather jacket over your lace dress, or try the dress on its own.</p></>;
    if (tab === "bag") return <>{streetChoice("bag")}</>;
    if (tab === "accessory") return <>{streetChoice("headband")}{streetChoice("earrings")}</>;
    if (tab === "hair") return <>
      <div className={`${styles.item} ${styles.selectedItem}`}><span className={styles.optionAvatar}>{portrait}</span><span>Long Dark Hair</span></div>
      {streetChoice("headband")}
    </>;
    if (tab === "shoes") return <>
      <div className={`${styles.item} ${styles.selectedItem}`}><StreetItemArt part="boots" /><span>Black Knee-high Boots</span><b className={styles.shopPrice}>EQUIPPED ✦</b></div>
      <p className={styles.editorNote}>Your photo's original black boots. The full-body proportions stay connected.</p>
    </>;
    if (tab === "face") return <>
      <div className={`${styles.item} ${styles.selectedItem}`}><span className={styles.optionAvatar}>{portrait}</span><span>Photo Portrait</span></div>
      <button className={styles.item} disabled={!street.ready} onClick={() => { street.reset(); setMessage("Your original leather & lace look. ♥"); }}>
        <span className={styles.none}>↺</span><span>Restore photo outfit</span>
      </button>
    </>;
    return <>
      {streetColors.map((color) => <button key={color.id}
        className={`${styles.item} ${street.look.dressColor === color.id ? styles.selectedItem : ""}`}
        aria-label={color.name} aria-pressed={street.look.dressColor === color.id} disabled={!street.ready}
        onClick={() => { street.update({ dressColor: color.id }); setMessage(`${color.name.toUpperCase()} — NEW LOOK! ♥`); }}>
        <StreetItemArt part="dress" color={color.id} /><span>{color.name}</span>
      </button>)}
      {tab === "bottom" && <p className={styles.editorNote}>The lace skirt belongs to this one-piece dress.</p>}
    </>;
  }
  function toggleLayer(layer: Exclude<CharacterLayer, "body" | "foreground" | "boots">) {
    update({ [layer]: !look[layer] });
    setMessage(
      look[layer]
        ? "A little less. A new mood. ♡"
        : "NEW LOOK! Looking good. ♥",
    );
  }
  function layerChoice(
    layer: Exclude<CharacterLayer, "body" | "foreground" | "boots">,
    name: string,
  ) {
    return (
      <button
        key={layer}
        className={`${styles.item} ${look[layer] ? styles.selectedItem : ""}`}
        aria-label={name}
        aria-pressed={look[layer]}
        disabled={!ready}
        onClick={() => toggleLayer(layer)}
      >
        <CharacterLayerArt layer={layer} />
        <span>{name}</span>
        <b className={styles.shopPrice}>
          {look[layer] ? "ON · TAP TO REMOVE" : "OFF · TAP TO WEAR"}
        </b>
      </button>
    );
  }
  function renderChoices() {
    if (isStreet) return renderStreetChoices();
    if (tab === "shoes") return (
      <>
        <div className={`${styles.item} ${styles.selectedItem}`}>
          <CharacterLayerArt layer="boots" />
          <span>Black Lace-up Boots</span>
          <b className={styles.shopPrice}>EQUIPPED ✦</b>
        </div>
        <p className={styles.editorNote}>Black lace-up boots, made to match your original pixel look.</p>
      </>
    );
    if (tab === "dress" || tab === "top")
      return (
        <>
          {dressColors.map((color) => (
            <button
              key={color.id}
              className={`${styles.item} ${look.dress && look.dressColor === color.id ? styles.selectedItem : ""}`}
              aria-label={color.name}
              aria-pressed={look.dress && look.dressColor === color.id}
              disabled={!ready}
              onClick={() => {
                update({ dress: true, dressColor: color.id });
                setMessage(`${color.name.toUpperCase()} — NEW LOOK! ♥`);
              }}
            >
              <CharacterLayerArt layer="dress" color={color.id} />
              <span>{color.name}</span>
            </button>
          ))}
          <button
            className={`${styles.item} ${!look.dress ? styles.selectedItem : ""}`}
            aria-label="Use covered base outfit"
            aria-pressed={!look.dress}
            disabled={!ready}
            onClick={() => {
              update({ dress: false });
              setMessage("Back to your covered base outfit. ♡");
            }}
          >
            <span className={styles.none}>✧</span>
            <span>Base outfit</span>
          </button>
        </>
      );
    if (tab === "bottom")
      return (
        <>
          {layerChoice("tights", "Fishnet Tights")}
          <p className={styles.editorNote}>
            The tights are a separate layer. Tap to wear or remove them.
          </p>
        </>
      );
    if (tab === "accessory")
      return (
        <>
          {layerChoice("wings", "Black Feather Wings")}
          {layerChoice("cuffs", "Silver Wrist Cuff")}
          {layerChoice("ears", "Cat Ears")}
        </>
      );
    if (tab === "hair")
      return (
        <>
          <div className={`${styles.item} ${styles.selectedItem}`}>
            <span className={styles.optionAvatar}>{portrait}</span>
            <span>Original Black Hair</span>
          </div>
          {layerChoice("ears", "Cat Ears")}
          <p className={styles.editorNote}>
            Your original hair and face stay with this character.
          </p>
        </>
      );
    if (tab === "face")
      return (
        <>
          <div className={`${styles.item} ${styles.selectedItem}`}>
            <span className={styles.optionAvatar}>{portrait}</span>
            <span>Original Portrait</span>
          </div>
          <button
            className={styles.item}
            disabled={!ready}
            onClick={() => {
              reset();
              setMessage("Your original look, just like the photo. ♥");
            }}
          >
            <span className={styles.none}>↺</span>
            <span>Restore original look</span>
          </button>
        </>
      );
    return (
      <div className={styles.editorNote}>
        <PixelIcon name="bag" size={27} />
        <p>
          Your original look has no bag. The phone stays with your selfie pose.
        </p>
        <Link href="/shop">VISIT THE SHOP ↗</Link>
      </div>
    );
  }
  return (
    <main className={styles.room}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <h1 className={styles.title}>
            <PixelIcon name="star" size={28} />
            <span>Dreamio Style</span>
            <PixelIcon name="star" size={28} />
          </h1>
          <button
            className={styles.characterPicker}
            aria-label={`Switch character to ${isStreet ? "Midnight Wings" : "Leather and Lace"}`}
            disabled={!street.ready || !ready}
            onClick={() => {
              street.select(isStreet ? "original" : "street");
              setClosetOpen(false);
              setMessage(`HELLO, ${isStreet ? "MIDNIGHT WINGS" : "LEATHER & LACE"}! ♥`);
            }}
          >
            <span className={styles.switchPortrait} aria-hidden="true">
              {isStreet ? <LayeredCharacter look={look} portrait /> : <StreetCharacter look={street.look} portrait />}
            </span>
            <span className={styles.switchCopy}>
              <b>SWITCH CHARACTER</b>
              <small>{isStreet ? "MIDNIGHT WINGS" : "LEATHER & LACE"}</small>
            </span>
            <span className={styles.switchArrow} aria-hidden="true">⇄</span>
          </button>
          <div className={styles.topActions}>
            <Link
              href="/shop"
              className={styles.points}
              aria-label={`Visit shop, ${tickets} Dream Points`}
            >
              <PixelIcon name="coin" size={18} />
              <span>{tickets}</span>
            </Link>
            <button
              className={styles.topButton}
              aria-label="Open photo preview"
              onClick={() => photoDialog.current?.showModal()}
            >
              <PixelIcon name="person" size={22} />
            </button>
            <Link
              href="/lobby"
              className={styles.exitButton}
              aria-label="Back to game lobby"
            >
              <span aria-hidden="true">◧</span>
              <span aria-hidden="true">◨</span>
            </Link>
          </div>
        </header>
        <div className={styles.workspace}>
          <nav className={styles.menu} aria-label="Dressing room categories">
            {menu.map((entry) => (
              <button
                key={entry.id}
                className={`${styles.menuButton} ${tab === entry.id ? styles.activeMenu : ""}`}
                aria-label={entry.label}
                aria-pressed={tab === entry.id}
                aria-expanded={closetOpen && tab === entry.id}
                aria-controls="room-closet"
                onClick={() => {
                  setClosetOpen(tab === entry.id ? !closetOpen : true);
                  setTab(entry.id);
                }}
              >
                <PixelIcon name={entry.icon} size={42} />
                <span>{entry.label}</span>
              </button>
            ))}
          </nav>
          <section
            className={styles.stage}
            aria-label="Your outfit on the city street"
          >
            <div className={styles.street} aria-hidden="true" />
            <div className={styles.sceneGrain} aria-hidden="true" />
            <span className={styles.playerName}>{profile.nickname || nickname || "DREAMER"}</span>
            <span className={styles.streetSign} aria-hidden="true">
              DREAMIO <b>21:05</b>
            </span>
            <div className={styles.mainAvatar}>{avatar}</div>

            <div className={styles.dialogue} role="status">
              <span className={styles.bunny} aria-hidden="true">
                <i />
                <i />
                <b>• ᴗ •</b>
              </span>
              <span>
                {message || (
                  <>
                    So...
                    <br />
                    what do you think?
                    <br />
                    <em>♡</em>
                  </>
                )}
              </span>
            </div>
            <span className={styles.savedLabel}>
              {(isStreet ? street.storageAvailable : storageAvailable) ? "AUTO SAVED" : "SESSION ONLY"} <span>✦</span>
            </span>
            {closetOpen && (
              <section
                id="room-closet"
                className={styles.closet}
                aria-label={`${currentMenu.label} selection`}
              >
                <div className={styles.closetHeader}>
                  <span>
                    <PixelIcon name={currentMenu.icon} size={17} />
                    {currentMenu.label}
                  </span>
                  <button
                    aria-label="Close item selection"
                    onClick={() => setClosetOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.itemGrid}>{renderChoices()}</div>
                <div className={styles.closetFoot}>
                  <span>YOUR PHOTO · YOUR LAYERS</span>
                  <Link href="/shop">SHOP ↗</Link>
                </div>
              </section>
            )}
          </section>
          <aside className={styles.sidebar} aria-label="Your style preview">
            <section className={styles.portraitCard}>
              <div className={styles.portraitFrame}>
                <div className={styles.portraitStreet} />
                <span className={styles.portraitAvatar}>{portrait}</span>
              </div>
              <div className={styles.newLook}>
                NEW LOOK!
                <PixelIcon name="heart" size={21} />
              </div>
            </section>
            <section
              className={styles.styleCheck}
              aria-label="Outfit mood ratings"
            >
              <h2>STYLE CHECK</h2>
              <div className={styles.overallHearts}>
                <Hearts count={4} large />
              </div>
              <div className={styles.ratings}>
                {Object.entries(rating).map(([label, count]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <Hearts count={count} />
                  </div>
                ))}
              </div>
            </section>
            <section
              className={styles.outfitCard}
              aria-label="Current outfit pieces"
            >
              <div className={styles.outfitInner}>
                <div className={styles.outfitPieces}>
                  {isStreet ? (["jacket", "dress", "bag", "headband", "earrings", "boots"] as StreetPart[]).map((part) => (
                    <button key={part} className={`${styles.outfitPiece} ${part !== "dress" && part !== "boots" && !street.look[part] ? styles.hiddenPiece : ""}`}
                      aria-label={`Edit ${streetParts[part].name}`}
                      onClick={() => {
                        setTab(part === "jacket" ? "top" : part === "boots" ? "shoes" : part === "bag" ? "bag" : part === "dress" ? "dress" : "accessory");
                        setClosetOpen(true);
                      }}><StreetItemArt part={part} color={street.look.dressColor} /></button>
                  )) : (["dress", "wings", "cuffs", "tights", "boots"] as const).map(
                    (layer) => (
                      <button
                        key={layer}
                        className={`${styles.outfitPiece} ${layer !== "boots" && !look[layer] ? styles.hiddenPiece : ""}`}
                        aria-label={`Edit ${layer} layer`}
                        onClick={() => {
                          setTab(
                            layer === "boots"
                              ? "shoes"
                              : layer === "dress"
                              ? "dress"
                              : layer === "tights"
                                ? "bottom"
                                : "accessory",
                          );
                          setClosetOpen(true);
                        }}
                      >
                        <CharacterLayerArt
                          layer={layer}
                          color={look.dressColor}
                        />
                      </button>
                    ),
                  )}
                </div>
              </div>
            </section>
            <Link
              href="/shop"
              className={styles.nextButton}
              aria-label="Next: visit the pixel shop"
            >
              NEXT <span>▶</span>
            </Link>
          </aside>
        </div>
        <div className={styles.bottomBar}>
          <Link href="/lobby">◀ GAME LOBBY</Link>
          <span>YOUR LITTLE DRESS-UP WORLD</span>
          <button onClick={() => photoDialog.current?.showModal()}>
            PHOTO STUDIO <PixelIcon name="person" size={12} />
          </button>
        </div>
      </div>
      <dialog
        aria-label="Photo Studio"
        ref={photoDialog}
        className={styles.photoDialog}
      >
        <div className={styles.closetHeader}>
          <span>PHOTO STUDIO</span>
          <button
            aria-label="Close photo studio"
            onClick={() => photoDialog.current?.close()}
          >
            ×
          </button>
        </div>
        <div className={styles.photoContent}>
          <PixelIcon name="person" size={40} />
          <h2>A pixel version of you.</h2>
          <p>
            Your current character was made from your photo. Preview a new photo
            here; automatic generation for new uploads is not connected yet.
          </p>
          <p className={styles.photoNote}>
            Local preview only. Your photo is not uploaded or saved.
          </p>
          {preview && (
            <div className={styles.photoPreview}>
              <img src={preview} alt="Local preview of your selected photo" />
              <button
                aria-label="Remove preview photo"
                onClick={() => setFile(null)}
              >
                ×
              </button>
            </div>
          )}
          <label className={styles.uploadButton}>
            {preview ? "CHOOSE ANOTHER PHOTO" : "PREVIEW A PHOTO"}
            <input
              key={preview ? "selected" : "empty"}
              aria-label="Choose a photo for local preview"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                if (!selected) return;
                if (
                  !["image/jpeg", "image/png", "image/webp"].includes(
                    selected.type,
                  ) ||
                  selected.size > 10 * 1024 * 1024
                ) {
                  setError("Choose a JPG, PNG, or WebP image under 10 MB.");
                  return;
                }
                setError("");
                setFile(selected);
              }}
            />
          </label>
          <small>JPG / PNG / WEBP · MAX 10 MB</small>
          {error && <p role="alert">{error}</p>}
        </div>
      </dialog>
    </main>
  );
}
