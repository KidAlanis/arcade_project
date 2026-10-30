"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { safeReturnPath } from "@/lib/player-contract";

export function AuthForm({
  mode,
  next,
  setupMessage,
}: {
  mode: "sign-in" | "sign-up";
  next: string;
  setupMessage: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signup = mode === "sign-up";
  const destination = safeReturnPath(next);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || setupMessage) return;
    setBusy(true);
    setError(null);
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get("email") ?? "").trim();
    const password = String(fields.get("password") ?? "");
    try {
      const response = signup
        ? await authClient.signUp.email({
            name: String(fields.get("name") ?? "").trim(),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password });
      if (response.error) {
        setError(
          response.error.status === 429
            ? "Too many attempts. Please wait a moment and try again."
            : response.error.message ||
                "Unable to sign in. Please check your details and try again.",
        );
        setBusy(false);
        return;
      }
      // A fresh navigation clears every account-specific component/cache.
      window.location.assign(destination);
    } catch {
      setError("Unable to reach player services. Please try again.");
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">
          {signup ? "NEW CHALLENGER" : "WELCOME BACK, PLAYER"}
        </p>
        <h1>{signup ? "Join the arcade." : "Continue playing."}</h1>
        <p className="auth-description">
          {signup
            ? "Create your player account. Your ticket wallet starts at zero."
            : "Sign in to earn tickets and build your prize shelf."}
        </p>
        {setupMessage ? (
          <p className="auth-message" role="status">
            {setupMessage}
          </p>
        ) : null}
        <form onSubmit={submit} aria-busy={busy}>
          {signup ? (
            <label htmlFor="player-name">
              Player name
              <input
                id="player-name"
                name="name"
                autoComplete="name"
                required
                minLength={1}
                maxLength={80}
                disabled={busy || !!setupMessage}
              />
            </label>
          ) : null}
          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              disabled={busy || !!setupMessage}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              required
              minLength={8}
              maxLength={128}
              disabled={busy || !!setupMessage}
            />
          </label>
          {signup ? <p className="field-hint">Use 8–128 characters.</p> : null}
          {error ? (
            <p className="auth-message" role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="button"
            disabled={busy || !!setupMessage}
            type="submit"
          >
            {busy ? "PLEASE WAIT…" : signup ? "CREATE ACCOUNT" : "SIGN IN"}
          </button>
        </form>
        <p className="auth-switch">
          {signup ? "Already a player? " : "New to the arcade? "}
          <Link
            href={`/${signup ? "sign-in" : "sign-up"}?next=${encodeURIComponent(destination)}`}
          >
            {signup ? "Sign in" : "Create an account"}
          </Link>
        </p>
        <Link className="auth-back" href="/">
          ← Back to the arcade floor
        </Link>
      </section>
    </main>
  );
}
