"use client";
import Link from "next/link";
import { useState } from "react";
import { categories, items, type Category } from "@/lib/dreamio";
import { useTicketWallet } from "./ticket-wallet";
import { ItemArt, PixelIcon } from "./pixel-art";
import { SectionHeading } from "./world-ui";
export function Shop() {
  const { tickets, owned, nickname, ready, purchase } = useTicketWallet();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [message, setMessage] = useState("");
  return (
    <main>
      <div className="page-breadcrumb">
        <span>HOME / PIXEL SHOP</span>
        <span>GOOD THINGS COME IN PIXELS ♡</span>
      </div>
      <section className="shop-hero">
        <div>
          <p className="eyebrow">DREAMIO LITTLE DEPARTMENT STORE</p>
          <h1>
            Wear a little happiness.<span>♡</span>
          </h1>
          <p>Turn your little victories into your next favorite thing.</p>
          <span className="shop-tip">
            ✦ Daily check-ins and game rewards become new outfits.
          </span>
        </div>
        <div className="shop-bag-art">
          <PixelIcon name="bag" size={104} />
          <span>✦</span>
          <span>♡</span>
        </div>
        <div className="shop-balance">
          <span>My little treasure</span>
          <strong>
            <PixelIcon name="coin" size={25} /> {tickets}
          </strong>
          <small>DREAM POINTS</small>
        </div>
      </section>
      <section className="shop-section">
        <SectionHeading
          kicker="A LITTLE SOMETHING FOR YOU"
          title="Fresh pixel finds"
        >
          <Link href="/wardrobe" className="text-link">
            Visit my dressing room ↗
          </Link>
        </SectionHeading>
        <div className="tabs shop-tabs" aria-label="Shop categories">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
          >
            All finds
          </button>
          {categories.map((c) => (
            <button
              className={filter === c.id ? "active" : ""}
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
              key={c.id}
            >
              <PixelIcon name={c.icon} size={15} />
              {c.label}
            </button>
          ))}
        </div>
        <div className="shop-grid">
          {items
            .filter((item) => filter === "all" || item.category === filter)
            .map((item) => {
              const has = owned.includes(item.id);
              return (
                <article className="product-card" key={item.id}>
                  <div className={`product-art product-${item.category}`}>
                    {item.tag && (
                      <span className="product-tag">{item.tag}</span>
                    )}
                    <ItemArt item={item} />
                    <span className="product-spark">✧</span>
                    {has && <span className="owned-tag">✓ OWNED</span>}
                  </div>
                  <div className="product-info">
                    <span className="product-category">
                      {categories.find((c) => c.id === item.category)?.label} /
                      DREAMIO ORIGINAL
                    </span>
                    <h3>{item.name}</h3>
                    <div className="product-bottom">
                      <span className="price">
                        <PixelIcon name="coin" size={17} />
                        {item.price === 0 ? "Free starter" : item.price}
                      </span>
                      {has ? (
                        <Link
                          href="/wardrobe"
                          className="purchase-button owned"
                        >
                          Wear it ↗
                        </Link>
                      ) : (
                        <button
                          className="purchase-button"
                          disabled={!ready || !nickname || tickets < item.price}
                          onClick={() =>
                            setMessage(
                              purchase(item.id)
                                ? `${item.name} is in your closet. Time for a new look!`
                                : "Not enough points. Check in or finish a game first.",
                            )
                          }
                        >
                          {!nickname
                            ? "Sign in first"
                            : tickets < item.price
                              ? "Need more pts"
                              : "Get it +"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
        <div className="shop-notice" role="status">
          {message ? (
            <>
              <PixelIcon name="check" size={18} />
              <span>{message}</span>
              <Link href="/wardrobe">Dress up now →</Link>
            </>
          ) : (
            <>
              <PixelIcon name="heart" size={18} />
              <span>
                {nickname
                  ? "Need more points? Check in for +20, and finish each game daily for +10."
                  : "Join the local demo with a nickname to collect points and little finds."}
              </span>
              <Link href={nickname ? "/lobby" : "/#login"}>
                {nickname ? "Earn points" : "Sign in"} →
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
