import { PlayerUnavailable } from "@/components/player-unavailable";
import { pageAccess } from "@/lib/server/session";
import { Wardrobe } from "@/components/wardrobe";
export default async function WardrobePage() {
 const unavailable = await pageAccess("/wardrobe");
 if (unavailable) return <PlayerUnavailable message={unavailable} />;
  return <Wardrobe />;
}
