export type Player = { id: string; name: string };
export type Redemption = {
  id: string;
  prizeId: string;
  name: string;
  price: number;
  redeemedAt: string;
};
export type PlayerSnapshot = {
  user: Player;
  tickets: number;
  shelf: Redemption[];
};
export type Prize = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number | null;
};
export type MutationResult = {
  userId: string;
  tickets: number;
  redemptionId?: string;
  alreadyApplied: boolean;
};

export function safeReturnPath(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u001f]/.test(value)
  )
    return "/";
  // Only known application destinations; reject sign-out/auth routes and encoded redirects.
  return /^\/(?:$|shop(?:\?|$)|shelf(?:\?|$)|games\/[a-z0-9-]+(?:\?|$))/.test(
    value,
  )
    ? value
    : "/";
}
