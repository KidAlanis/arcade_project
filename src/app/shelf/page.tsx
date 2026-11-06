import { pageAccess } from "@/lib/server/session";
import { PlayerUnavailable } from "@/components/player-unavailable";
import { PrizeShelf } from "@/components/prize-shelf";
export const dynamic = "force-dynamic";
export default async function ShelfPage() {
  const issue = await pageAccess("/shelf");
  return issue ? <PlayerUnavailable message={issue} /> : <PrizeShelf />;
}
