import Link from "next/link";
export function PlayerUnavailable({ message }: { message: string }) {
  return (
    <main className="placeholder">
      <p className="eyebrow">PLAYER SERVICES</p>
      <h1>Not ready yet</h1>
      <p role="status">{message}</p>
      <Link className="button" href="/">
        ← BACK TO THE FLOOR
      </Link>
    </main>
  );
}
