"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categories, items, type Category } from "@/lib/dreamio";
import { useTicketWallet } from "./ticket-wallet";
import { ItemArt, PixelAvatar, PixelIcon } from "./pixel-art";
import { WindowBar } from "./world-ui";
export function Wardrobe() {
  const { look, hair, skin, nickname, owned, equip, appearance, ready } =
    useTicketWallet();
  const [category, setCategory] = useState<Category>("top");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <main>
      <div className="page-breadcrumb">
        <span>HOME / MY DRESSING ROOM</span>
        <span>EVERY VERSION OF YOU IS LOVELY ♡</span>
      </div>
      <div className="wardrobe-heading">
        <div>
          <p className="eyebrow">SAME YOU. A BRAND NEW MOOD.</p>
          <h1>
            My dressing room <span>✦</span>
          </h1>
          <p>A little cute, a little cool, a whole lot of you.</p>
        </div>
        <Link href="/shop" className="button outline-button">
          <PixelIcon name="bag" size={17} />
          Visit the pixel shop ↗
        </Link>
      </div>
      <section className="dressing-room">
        <div className="pixel-window avatar-window">
          <WindowBar title="MY PIXEL SELF" icon="person" />
          <div className="dressing-stage">
            <div className="dressing-scene" />
            <span className="dressing-name">
              {nickname || "DREAMER"}
              <small>STYLE LV. 01</small>
            </span>
            <span className="speech-bubble">
              NEW LOOK! <span>♥</span>
            </span>
            <div className="dressing-avatar">
              <PixelAvatar look={look} hair={hair} skin={skin} />
            </div>
            <span className="stage-floor" />
            <span className="stage-star star-a">✦</span>
            <span className="stage-star star-b">✧</span>
          </div>
          <div className="avatar-caption">
            <PixelIcon name="heart" size={17} />
            <span>{message || "Every version of you is a lovely one."}</span>
            <span>♥ ♥ ♥</span>
          </div>
        </div>
        <div className="wardrobe-controls pixel-window">
          <WindowBar title="YOUR LITTLE CLOSET" icon="shirt" />
          <div className="closet-body">
            <div className="closet-heading">
              <h2>Your little closet</h2>
              <span>{owned.length} little finds</span>
            </div>
            <div className="closet-tabs" aria-label="Closet categories">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={category === c.id ? "active" : ""}
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  <PixelIcon name={c.icon} size={23} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
            <div className="closet-items">
              {category === "accessory" && (
                <button
                  className={`closet-item ${look.accessory === "" ? "selected" : ""}`}
                  disabled={!ready}
                  onClick={() => {
                    equip("");
                    setMessage("A fresh little look. Outfit saved.");
                  }}
                >
                  <span className="no-accessory">✧</span>
                  <span>No accessory</span>
                </button>
              )}
              {items
                .filter((i) => i.category === category && owned.includes(i.id))
                .map((item) => (
                  <button
                    key={item.id}
                    className={`closet-item ${look[category] === item.id ? "selected" : ""}`}
                    aria-pressed={look[category] === item.id}
                    disabled={!ready}
                    onClick={() => {
                      if (equip(item.id))
                        setMessage(`Wearing ${item.name} · Outfit saved`);
                    }}
                  >
                    <ItemArt item={item} />
                    <span>{item.name}</span>
                    {look[category] === item.id && (
                      <span className="selected-check">✓</span>
                    )}
                  </button>
                ))}
              <Link href="/shop" className="closet-item add-item">
                <span>+</span>
                <span>Find more cuteness</span>
              </Link>
            </div>
            <div className="appearance-options">
              <h3>
                Base avatar <small>MAKE IT YOURS</small>
              </h3>
              <div>
                <span>Hair</span>
                <div className="swatches">
                  {["#a47eac", "#a37b68", "#69728f"].map((color, i) => (
                    <button
                      key={color}
                      style={{ background: color }}
                      className={hair === i ? "selected" : ""}
                      aria-label={
                        [
                          "Lavender long hair",
                          "Chestnut long hair",
                          "Midnight short hair",
                        ][i]
                      }
                      aria-pressed={hair === i}
                      disabled={!ready}
                      onClick={() => appearance("hair", i)}
                    >
                      {hair === i && "✓"}
                    </button>
                  ))}
                </div>
                <span>Skin tone</span>
                <div className="swatches">
                  {["#fbdac5", "#dfad89", "#ae775d"].map((color, i) => (
                    <button
                      key={color}
                      style={{ background: color }}
                      className={skin === i ? "selected" : ""}
                      aria-label={`Skin tone ${i + 1}`}
                      aria-pressed={skin === i}
                      disabled={!ready}
                      onClick={() => appearance("skin", i)}
                    >
                      {skin === i && "✓"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="closet-saved" role="status">
              <PixelIcon name="check" size={15} />
              {message || "Your outfit is saved automatically in this browser"}
            </div>
          </div>
        </div>
      </section>
      <section className="photo-section pixel-window">
        <WindowBar title="A PIXEL VERSION OF YOU" icon="upload" />
        <div className="photo-body">
          <div className="photo-intro">
            <span className="tiny-tag">NEXT CHAPTER</span>
            <h2>Meet the pixel version of you.</h2>
            <p>
              A future update will turn your photo into a personal chibi avatar,
              ready to dress up.
            </p>
            <p className="photo-status">
              AI generation is not connected yet. You can preview a photo
              locally; it is never uploaded or saved.
            </p>
          </div>
          <div className="photo-upload">
            {preview ? (
              <div className="photo-preview">
                <img src={preview} alt="Local preview of your selected photo" />
                <button
                  aria-label="Remove preview photo"
                  onClick={() => setFile(null)}
                >
                  ×
                </button>
              </div>
            ) : (
              <PixelIcon name="upload" size={27} />
            )}
            <label className="upload-label">
              {preview ? "Choose another photo" : "Preview a photo"}
              <input
                key={preview ? "selected" : "empty"}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
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
            {error && (
              <span className="form-error" role="alert">
                {error}
              </span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
