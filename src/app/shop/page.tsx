import { pageAccess } from "@/lib/server/session";
import { listPrizes } from "@/lib/server/player-data";
import { publicError } from "@/lib/server/errors";
import { PlayerUnavailable } from "@/components/player-unavailable";
import { PrizeShop } from "@/components/prize-shop";
export const dynamic = "force-dynamic";
export default async function ShopPage() {
  const issue = await pageAccess("/shop");
  if (issue) return <PlayerUnavailable message={issue} />;
  try {
    return <PrizeShop prizes={await listPrizes()} />;
  } catch (error) {
    return <PlayerUnavailable message={publicError(error).message} />;
  }
}
