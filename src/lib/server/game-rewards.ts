import "server-only";
import { PlayerError } from "./errors";

// No playable games exist yet. Enable a game only alongside a server result validator.
// The browser never supplies a reward amount, score-to-ticket conversion, or user ID.
const rewards: Record<string, { enabled: boolean; win: number }> = {
  "game-1": { enabled: false, win: 10 },
  "game-2": { enabled: false, win: 10 },
  "game-3": { enabled: false, win: 10 },
};
export function rewardForVerifiedResult(
  gameId: string,
  outcome: string,
): number {
  const rule = Object.hasOwn(rewards, gameId) ? rewards[gameId] : undefined;
  if (!rule?.enabled)
    throw new PlayerError(
      "GAME_NOT_READY",
      "Ticket rewards are not enabled for this game yet.",
      409,
    );
  if (outcome !== "win")
    throw new PlayerError(
      "INVALID_RESULT",
      "This result does not qualify for a ticket reward.",
    );
  return rule.win;
}
