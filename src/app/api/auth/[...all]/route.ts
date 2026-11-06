import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import { errorResponse, json } from "@/lib/server/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handle(request: Request) {
  try {
    const handlers = toNextJsHandler(getAuth());
    const response = await (request.method === "GET"
      ? handlers.GET(request)
      : handlers.POST(request));
    // Never expose database/adapter stack traces or connection details.
    if (response.status >= 500)
      return json(
        {
          code: "SERVICE_UNAVAILABLE",
          message:
            "Authentication is unavailable. Check the database connection and reviewed migrations, then try again.",
        },
        503,
      );
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
export const GET = handle;
export const POST = handle;
