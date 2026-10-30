import Link from "next/link";
import { notFound } from "next/navigation";
import { games } from "@/lib/games";
import { pageAccess } from "@/lib/server/session";
import { PlayerUnavailable } from "@/components/player-unavailable";

export const dynamic = "force-dynamic";
export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = games.find((game) => game.slug === slug);
  if (!game) notFound();
  const issue = await pageAccess(`/games/${slug}`);
  if (issue) return <PlayerUnavailable message={issue} />;
  return (
    <main className="placeholder">
      <p className="eyebrow">CABINET {game.number}</p>
      <div className={`placeholder-symbol ${game.color}`} aria-hidden="true">
        {game.symbol}
      </div>
      <h1>{game.name}</h1>
      <h2>Coming soon</h2>
      <p>This cabinet is warming up. A new challenge is on its way.</p>
      <Link href="/" className="button">
        ← BACK TO THE FLOOR
      </Link>
    </main>
  );
}
