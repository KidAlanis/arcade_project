# Better Auth CLI output — do not apply separately

`001_better_auth.sql` is the unmodified output of the current official Better Auth CLI, generated with:

```sh
npm exec --yes --package=auth@latest -- auth generate --config scripts/auth-schema.config.ts --output db/migrations/generated/001_better_auth.sql --yes
```

The CLI-only configuration uses the same `authConfiguration()` factory, options, model names, public schema and plugins as runtime authentication. Each acquired CLI connection starts a READ ONLY transaction and rolls back on release. The only CLI override skips redundant runtime schema validation; the CLI still inspects the live catalog itself.

The root `../001_better_auth.sql` includes this generated SQL verbatim, then adds the account uniqueness constraint, session-expiry index, RLS, and public Data API privilege revocation. Apply that complete migration through the verified Supabase MCP. Do not apply both files, and do not apply the raw artifact without its security hardening.
