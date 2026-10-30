import { PlayerUnavailable } from "@/components/player-unavailable";
import { pageAccess } from "@/lib/server/session";
import { notFound } from "next/navigation";
import { games } from "@/lib/games";
import { ArcadeGame } from "@/components/arcade-game";
export function generateStaticParams() {
  return games.filter((game) => game.slug !== "game-1").map(({ slug }) => ({ slug }));
}
export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = games.find((game) => game.slug === slug);
  if (!game) notFound();
  const unavailable = await pageAccess(`/games/${slug}`);
  if (unavailable) return <PlayerUnavailable message={unavailable} />;
  return <ArcadeGame game={game} />;
}
