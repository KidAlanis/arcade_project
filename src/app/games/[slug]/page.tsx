import { notFound } from "next/navigation";
import { games } from "@/lib/games";
import { ArcadeGame } from "@/components/arcade-game";
export function generateStaticParams() {
  return games.map(({ slug }) => ({ slug }));
}
export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = games.find((game) => game.slug === slug);
  if (!game) notFound();
  return <ArcadeGame game={game} />;
}
