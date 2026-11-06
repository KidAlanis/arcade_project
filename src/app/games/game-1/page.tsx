import { PlayerUnavailable } from "@/components/player-unavailable";
import { PixelBathGame } from "@/components/pixel-bath/pixel-bath-game";
import { pageAccess } from "@/lib/server/session";
export default async function Game1Page() {
 const unavailable = await pageAccess("/games/game-1");
 if (unavailable) return <PlayerUnavailable message={unavailable} />;
 return <PixelBathGame />;
}
