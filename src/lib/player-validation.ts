export function parseRedemption(
  input: unknown,
): { prizeId: string; requestId: string } | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  if (Object.keys(value).sort().join(",") !== "prizeId,requestId") return null;
  if (
    typeof value.prizeId !== "string" ||
    !/^[a-z0-9][a-z0-9-]{0,79}$/.test(value.prizeId)
  )
    return null;
  if (
    typeof value.requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value.requestId,
    )
  )
    return null;
  return { prizeId: value.prizeId, requestId: value.requestId };
}
export function parseReward(input: unknown): { resultId: string } | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  if (
    Object.keys(value).join(",") !== "resultId" ||
    typeof value.resultId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value.resultId,
    )
  )
    return null;
  return { resultId: value.resultId };
}
