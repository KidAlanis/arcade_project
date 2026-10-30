import "server-only";

export class PlayerError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function publicError(error: unknown) {
  if (error instanceof PlayerError) return error;
  return new PlayerError(
    "SERVICE_UNAVAILABLE",
    "Player services are unavailable. Check the database connection and apply the reviewed migrations, then try again.",
    503,
  );
}
