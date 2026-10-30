import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { PlayerError, publicError } from "./errors";

export async function requirePlayer() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
  if (!session)
    throw new PlayerError(
      "UNAUTHORIZED",
      "Sign in to use your wallet and prize shelf.",
      401,
    );
  return session.user;
}
export async function pageAccess(returnTo: string): Promise<string | null> {
  try {
    await requirePlayer();
    return null;
  } catch (error) {
    if (error instanceof PlayerError && error.status === 401)
      redirect(`/sign-in?next=${encodeURIComponent(returnTo)}`);
    return publicError(error).message;
  }
}
