export const PLAY_COST = 1;
export const WIN_REWARD = 5;
export type GameTicketRequest = { action: "start"; gameId: string; runId: string } | { action: "finish"; runId: string; outcome: "win" | "loss" };
export function parseGameTicketRequest(input: unknown): GameTicketRequest | null {
 if (!input || typeof input !== "object" || Array.isArray(input)) return null;
 const d=input as Record<string,unknown>;
 if (typeof d.runId!=="string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(d.runId))return null;
 if(d.action==="start" && Object.keys(d).length===3 && typeof d.gameId==="string" && ["game-1","game-2","game-3","clawpop"].includes(d.gameId)) return {action:"start",gameId:d.gameId,runId:d.runId};
 if(d.action==="finish" && Object.keys(d).length===3 && (d.outcome==="win"||d.outcome==="loss"))return {action:"finish",runId:d.runId,outcome:d.outcome};
 return null;
}

export function parseTicketClaim(input:unknown):{kind:"daily"|"rescue";requestId:string}|null {
 if(!input||typeof input!=="object"||Array.isArray(input))return null;
 const d=input as Record<string,unknown>;
 if(Object.keys(d).length!==2||(d.kind!=="daily"&&d.kind!=="rescue")||typeof d.requestId!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(d.requestId))return null;
 return {kind:d.kind,requestId:d.requestId};
}
