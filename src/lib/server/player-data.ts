import { items, defaultLook, type Look } from "@/lib/dreamio";
import {parseTicketClaim,parseGameTicketRequest,PLAY_COST,WIN_REWARD} from "@/lib/game-ticket-rules";
import "server-only";
import { randomUUID, randomInt } from "node:crypto";
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
    const exists = await client.query("SELECT to_regclass('public.arcade_avatars') IS NOT NULL AS ready");
    let avatar = {look: {...defaultLook}, hair: 0, skin: 0};
    if(exists.rows[0].ready){
      const profile=await client.query("SELECT look,hair,skin FROM public.arcade_avatars WHERE user_id=$1",[user.id]);
      if(profile.rows[0])avatar=profile.rows[0];
    }
    const owned=Array.from(new Set([...items.filter(item=>item.price===0).map(item=>item.id),...rows.map(row=>row.prizeId).filter(id=>items.some(item=>item.id===id))]));
    return { user: { id: user.id, name: user.name }, tickets, shelf: rows, owned, ...avatar };
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
    if(items.some(item=>item.id===prizeId)){
      const owned=await client.query("SELECT id FROM public.arcade_redemptions WHERE user_id=$1 AND prize_id=$2",[user.id,prizeId]);
      if(owned.rows[0])return {userId:user.id,tickets:balance,redemptionId:owned.rows[0].id,alreadyApplied:true};
    }
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

// One paid run per player. A new start abandons the previous unfinished run.
export async function gameTicketAction(input: unknown) {
 const user = await requirePlayer();
 const data = parseGameTicketRequest(input);
 if(!data)throw new PlayerError("INVALID_REQUEST", "Submit only a supported game and round ID, or a round outcome. Ticket amounts and user IDs are not accepted.");
 const runId=data.runId;
 return transaction(async client => {
  await requireTable(client,"public.arcade_game_runs");
  const balance = await lockWallet(client, user.id);
  const found = await client.query<{game_id:string; outcome:string|null; age:number}>("SELECT game_id, outcome, extract(epoch from (now()-started_at))::float8 AS age FROM public.arcade_game_runs WHERE id=$1 AND user_id=$2 FOR UPDATE", [runId,user.id]);
  const run = found.rows[0];
  if (data.action === "start") {
   if (run) {
    if (run.game_id !== data.gameId || run.outcome) throw new PlayerError("RUN_CLOSED", "Start a new round.",409);
    return {runId,tickets:balance,alreadyApplied:true};
   }
   if (balance < PLAY_COST) throw new PlayerError("INSUFFICIENT_TICKETS", "You need 1 ticket to play.",409);
   await client.query("UPDATE public.arcade_game_runs SET outcome='loss',finished_at=now() WHERE user_id=$1 AND finished_at IS NULL",[user.id]);
   await client.query("INSERT INTO public.arcade_game_runs(id,user_id,game_id) VALUES ($1,$2,$3)",[runId,user.id,data.gameId]);
   await client.query("UPDATE public.arcade_wallets SET balance=balance-1,updated_at=now() WHERE user_id=$1",[user.id]);
   return {runId,tickets:balance-PLAY_COST,alreadyApplied:false};
  }
  if (!run) throw new PlayerError("INVALID_RESULT", "Paid round not found for this player.",404);
  if (run.outcome) {
   if (run.outcome !== data.outcome) throw new PlayerError("RUN_CLOSED", "This round was already settled.",409);
   return {runId,tickets:balance,alreadyApplied:true};
  }
  if (run.age < 0.5 || run.age > 86400) throw new PlayerError("INVALID_RESULT", "This round cannot be settled yet or has expired.",409);
  if (data.outcome === "win") {
   if (balance > 2147483647-WIN_REWARD) throw new PlayerError("WALLET_LIMIT", "Wallet limit reached.",409);
   await client.query("UPDATE public.arcade_wallets SET balance=balance+5,updated_at=now() WHERE user_id=$1",[user.id]);
  }
  await client.query("UPDATE public.arcade_game_runs SET outcome=$3,finished_at=now() WHERE id=$1 AND user_id=$2",[runId,user.id,data.outcome]);
  return {runId,tickets:balance+(data.outcome === "win" ? WIN_REWARD : 0),alreadyApplied:false};
 });
}

export async function claimFreeTickets(input: unknown) {
 const user=await requirePlayer();
 const d=parseTicketClaim(input);
 if(!d)throw new PlayerError("INVALID_REQUEST","Submit only a claim kind and request ID.");
 return transaction(async client=>{
  await requireTable(client,"public.arcade_ticket_claims");
  const balance=await lockWallet(client,user.id);
  const previous=await client.query<{kind:string;amount:number}>("SELECT kind,amount FROM public.arcade_ticket_claims WHERE user_id=$1 AND request_id=$2",[user.id,d.requestId]);
  if(previous.rows[0]){
   if(previous.rows[0].kind!==d.kind)throw new PlayerError("REQUEST_CONFLICT","This request was used for a different claim.",409);
   return {userId:user.id,tickets:balance,amount:previous.rows[0].amount,alreadyApplied:true};
  }
  let day:string|null=null;
  if(d.kind==='daily'){
   const date=await client.query<{day:string}>("SELECT to_char(now() AT TIME ZONE 'UTC','YYYY-MM-DD') AS day");day=date.rows[0].day;
   const claimed=await client.query<{amount:number}>("SELECT amount FROM public.arcade_ticket_claims WHERE user_id=$1 AND kind='daily' AND claim_day=$2",[user.id,day]);
   if(claimed.rows[0])return {userId:user.id,tickets:balance,amount:claimed.rows[0].amount,alreadyApplied:true};
  }else if(balance!==0)throw new PlayerError("NOT_ELIGIBLE","Free refill is available only when your wallet has 0 tickets.",409);
  const amount=d.kind==='daily'?randomInt(10,51):10;
  if(balance>2147483647-amount)throw new PlayerError("WALLET_LIMIT","Wallet limit reached.",409);
  await client.query("INSERT INTO public.arcade_ticket_claims(id,user_id,request_id,kind,amount,claim_day) VALUES ($1,$2,$3,$4,$5,$6)",[randomUUID(),user.id,d.requestId,d.kind,amount,day]);
  await client.query("UPDATE public.arcade_wallets SET balance=balance+$2,updated_at=now() WHERE user_id=$1",[user.id,amount]);
  return {userId:user.id,tickets:balance+amount,amount,alreadyApplied:false};
 });
}

async function requireTable(client:PoolClient, table:string){
 const result=await client.query("SELECT to_regclass($1) IS NOT NULL AS ready",[table]);
 if(!result.rows[0].ready)throw new PlayerError("SETUP_REQUIRED","This feature needs the pending database update. Please try again after setup is complete.",503);
}
export async function updateAvatar(input:unknown){
 const user=await requirePlayer();
 if(!input||typeof input!=="object"||Array.isArray(input))throw new PlayerError("INVALID_REQUEST","Invalid avatar request.");
 const d=input as Record<string,unknown>;
 const equip=Object.keys(d).length===1&&typeof d.itemId==="string";
 const appearance=Object.keys(d).length===2&&(d.kind==="hair"||d.kind==="skin")&&Number.isInteger(d.value)&&[0,1,2].includes(d.value as number);
 if(!equip&&!appearance)throw new PlayerError("INVALID_REQUEST","Choose a clothing item or valid appearance option.");
 return transaction(async client=>{
  await requireTable(client,"public.arcade_avatars");
  const balance=await lockWallet(client,user.id);
  await client.query("INSERT INTO public.arcade_avatars(user_id,look) VALUES($1,$2::jsonb) ON CONFLICT DO NOTHING",[user.id,JSON.stringify(defaultLook)]);
  const profile=await client.query<{look:Look;hair:number;skin:number}>("SELECT look,hair,skin FROM public.arcade_avatars WHERE user_id=$1 FOR UPDATE",[user.id]);
  const avatar=profile.rows[0];
  if(equip){
   if(d.itemId==="")avatar.look.accessory="";
   else{
    const item=items.find(item=>item.id===d.itemId);
    if(!item)throw new PlayerError("INVALID_REQUEST","Unknown clothing item.");
    if(item.price!==0){
     const ownership=await client.query("SELECT id FROM public.arcade_redemptions WHERE user_id=$1 AND prize_id=$2",[user.id,item.id]);
     if(!ownership.rows[0])throw new PlayerError("NOT_OWNED","Redeem this item before wearing it.",403);
    }
    avatar.look[item.category]=item.id;
   }
  }else avatar[d.kind as "hair"|"skin"]=d.value as number;
  await client.query("UPDATE public.arcade_avatars SET look=$2::jsonb,hair=$3,skin=$4,updated_at=now() WHERE user_id=$1",[user.id,JSON.stringify(avatar.look),avatar.hair,avatar.skin]);
  return {userId:user.id,tickets:balance,alreadyApplied:false};
 });
}
