// Explicit origins only; never derive trust from an incoming Host/Origin header.
export function trustedOrigins(env: Record<string, string | undefined>): string[] {
  const values = [env.BETTER_AUTH_URL, ...(env.BETTER_AUTH_TRUSTED_ORIGINS ?? "").split(",")];
  return [...new Set(values.flatMap(value => {
    if (!value?.trim()) return [];
    try {
      const url = new URL(value.trim());
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || /[*?]/.test(url.hostname) || url.pathname !== "/" || url.search || url.hash) return [];
      return [url.origin];
    } catch { return []; }
  }))];
}
