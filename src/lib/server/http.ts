import "server-only";
import { PlayerError, publicError } from "./errors";
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
export function errorResponse(error: unknown) {
  const safe = publicError(error);
  return json({ code: safe.code, message: safe.message }, safe.status);
}
export async function readMutation(request: Request): Promise<unknown> {
  const allowed = process.env.BETTER_AUTH_URL;
  if (!allowed || request.headers.get("origin") !== new URL(allowed).origin)
    throw new PlayerError(
      "INVALID_ORIGIN",
      "This request must come from the arcade website.",
      403,
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new PlayerError("INVALID_REQUEST", "Send a JSON request.", 415);
  const body = await request.text();
  if (body.length > 4096)
    throw new PlayerError("INVALID_REQUEST", "The request is too large.", 413);
  try {
    return JSON.parse(body);
  } catch {
    throw new PlayerError(
      "INVALID_REQUEST",
      "The request contains invalid JSON.",
    );
  }
}
