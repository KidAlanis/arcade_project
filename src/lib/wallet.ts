/** Positive whole tickets only; reject unsafe values and overflow. */
export function updateBalance(
  balance: number,
  amount: number,
  operation: "add" | "spend",
): number | null {
  if (
    !Number.isSafeInteger(balance) ||
    balance < 0 ||
    !Number.isSafeInteger(amount) ||
    amount <= 0
  )
    return null;
  const next = operation === "add" ? balance + amount : balance - amount;
  return Number.isSafeInteger(next) && next >= 0 ? next : null;
}
