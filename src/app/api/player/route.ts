import { getPlayerSnapshot } from "@/lib/server/player-data";
import { errorResponse, json } from "@/lib/server/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return json(await getPlayerSnapshot());
  } catch (error) {
    return errorResponse(error);
  }
}
