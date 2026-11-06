import { gameTicketAction } from "@/lib/server/player-data";
import { errorResponse,json,readMutation } from "@/lib/server/http";
export const runtime = "nodejs";
export async function POST(request:Request) {
 try { return json(await gameTicketAction(await readMutation(request))); }
 catch(error) { return errorResponse(error); }
}
