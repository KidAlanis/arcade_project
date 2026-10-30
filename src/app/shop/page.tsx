import Link from "next/link";
export default function ShopPage() {
  return (
    <main className="placeholder">
      <p className="eyebrow">THE PRIZE COUNTER</p>
      <div className="placeholder-symbol lime" aria-hidden="true">
        ▤
      </div>
      <h1>
        Prize shop<span className="pink">.</span>
      </h1>
      <h2>Coming soon</h2>
      <p>
        The shelves are getting stocked. Soon, you can spend your tickets here.
      </p>
      <Link href="/" className="button">
        ← BACK TO THE FLOOR
      </Link>
    </main>
  );
}
