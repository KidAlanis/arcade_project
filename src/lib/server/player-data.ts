import "server-only";
import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import type {
  MutationResult,
  PlayerSnapshot,
  Prize,
  Redemption,
} from "@/lib/player-contract";
import { updateBalance } from "@/lib/wallet";
import { parseRedemption, parseReward } from "@/lib/player-validation";
import { getPool } from "./db";
import { requirePlayer } from "./session";
import { PlayerError } from "./errors";
import { rewardForVerifiedResult } from "./game-rewards";

async function transaction<T>(
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();
  let destroyed = false;
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL statement_timeout = '10s'");
    await client.query("SET LOCAL lock_timeout = '5s'");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      destroyed = true;
      client.release(true);
      throw error;
    }
    throw error;
  } finally {
    if (!destroyed) client.release();
  }
}
async function lockWallet(client: PoolClient, userId: string): Promise<number> {
  // Handles existing Better Auth users too; never transfers a guest balance.
  await client.query(
    "INSERT INTO public.arcade_wallets (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
    [userId],
  );
  const { rows } = await client.query<{ balance: number }>(
    "SELECT balance FROM public.arcade_wallets WHERE user_id = $1 FOR UPDATE",
    [userId],
  );
  return rows[0].balance;
}

export async function getPlayerSnapshot(): Promise<PlayerSnapshot> {
  const user = await requirePlayer();
  return transaction(async (client) => {
    // The wallet lock also makes the balance and shelf one consistent snapshot.
    const tickets = await lockWallet(client, user.id);
    const { rows } = await client.query<Redemption>(
      `SELECT id, prize_id AS "prizeId", prize_name AS name, price,
       to_char(redeemed_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "redeemedAt"
       FROM public.arcade_redemptions WHERE user_id = $1 ORDER BY redeemed_at DESC, id DESC`,
      [user.id],
    );
    return { user: { id: user.id, name: user.name }, tickets, shelf: rows };
  });
}

export async function listPrizes(): Promise<Prize[]> {
  await requirePlayer();
  const { rows } = await getPool().query<Prize>(
    "SELECT id, name, description, price, stock FROM public.arcade_prizes WHERE active = true ORDER BY price, id",
  );
  return rows;
}

export async function redeemPrize(input: unknown): Promise<MutationResult> {
  const user = await requirePlayer();
  const parsed = parseRedemption(input);
  if (!parsed)
    throw new PlayerError(
      "INVALID_REQUEST",
      "Choose a prize and supply a valid redemption request ID. Prices and balances are determined by the server.",
    );
  const { prizeId, requestId } = parsed;
  return transaction(async (client) => {
    const balance = await lockWallet(client, user.id);
    // All requests for this player's wallet serialize before checking the key.
    const existing = await client.query<{ id: string; prize_id: string }>(
      "SELECT id, prize_id FROM public.arcade_redemptions WHERE user_id = $1 AND request_id = $2",
      [user.id, requestId],
    );
    if (existing.rows[0]) {
      if (existing.rows[0].prize_id !== prizeId)
        throw new PlayerError(
          "REQUEST_CONFLICT",
          "This request ID was already used for another prize.",
          409,
        );
      return {
        userId: user.id,
        tickets: balance,
        redemptionId: existing.rows[0].id,
        alreadyApplied: true,
      };
    }
    const { rows } = await client.query<Prize & { active: boolean }>(
      "SELECT id, name, description, price, stock, active FROM public.arcade_prizes WHERE id = $1 FOR UPDATE",
      [prizeId],
    );
    const prize = rows[0];
    if (!prize?.active)
      throw new PlayerError(
        "PRIZE_UNAVAILABLE",
        "This prize is no longer available.",
        409,
      );
    if (prize.stock !== null && prize.stock <= 0)
      throw new PlayerError("OUT_OF_STOCK", "This prize is out of stock.", 409);
    if (updateBalance(balance, prize.price, "spend") === null)
      throw new PlayerError(
        "INSUFFICIENT_TICKETS",
        "You do not have enough tickets for this prize.",
        409,
      );
    const updated = await client.query<{ balance: number }>(
      "UPDATE public.arcade_wallets SET balance = balance - $2, updated_at = now() WHERE user_id = $1 AND balance >= $2 RETURNING balance",
      [user.id, prize.price],
    );
    if (!updated.rows[0])
      throw new PlayerError(
        "INSUFFICIENT_TICKETS",
        "You do not have enough tickets for this prize.",
        409,
      );
    if (prize.stock !== null)
      await client.query(
        "UPDATE public.arcade_prizes SET stock = stock - 1 WHERE id = $1",
        [prizeId],
      );
    const id = randomUUID();
    await client.query(
      "INSERT INTO public.arcade_redemptions (id, user_id, prize_id, prize_name, price, request_id) VALUES ($1,$2,$3,$4,$5,$6)",
      [id, user.id, prizeId, prize.name, prize.price, requestId],
    );
    return {
      userId: user.id,
      tickets: updated.rows[0].balance,
      redemptionId: id,
      alreadyApplied: false,
    };
  });
}

export async function earnTickets(input: unknown): Promise<MutationResult> {
  const user = await requirePlayer();
  const parsed = parseReward(input);
  if (!parsed)
    throw new PlayerError(
      "INVALID_REQUEST",
      "Submit a server-verified result ID. Ticket amounts and user IDs are not accepted.",
    );
  return transaction(async (client) => {
    const balance = await lockWallet(client, user.id);
    const { rows } = await client.query<{
      game_id: string;
      outcome: string;
      verified_at: Date | null;
      claimed_at: Date | null;
    }>(
      "SELECT game_id, outcome, verified_at, claimed_at FROM public.arcade_game_results WHERE id = $1 AND user_id = $2 FOR UPDATE",
      [parsed.resultId, user.id],
    );
    const result = rows[0];
    if (!result?.verified_at)
      throw new PlayerError(
        "INVALID_RESULT",
        "A verified game result was not found for this player.",
        404,
      );
    if (result.claimed_at)
      return { userId: user.id, tickets: balance, alreadyApplied: true };
    const amount = rewardForVerifiedResult(result.game_id, result.outcome);
    const updated = await client.query<{ balance: number }>(
      "UPDATE public.arcade_wallets SET balance = balance + $2, updated_at = now() WHERE user_id = $1 AND balance <= 2147483647 - $2 RETURNING balance",
      [user.id, amount],
    );
    if (!updated.rows[0])
      throw new PlayerError(
        "WALLET_LIMIT",
        "Your wallet has reached its ticket limit.",
        409,
      );
    await client.query(
      "UPDATE public.arcade_game_results SET claimed_at = now(), awarded_tickets = $2 WHERE id = $1 AND user_id = $3",
      [parsed.resultId, amount, user.id],
    );
    return {
      userId: user.id,
      tickets: updated.rows[0].balance,
      alreadyApplied: false,
    };
  });
}
