"use client";
import { initialDream } from "@/lib/dreamio";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";
import type {
  MutationResult,
  Player,
  PlayerSnapshot,
  Redemption,
} from "@/lib/player-contract";

type Wallet = {
  user: Player | null;
  tickets: number | null;
  shelf: Redemption[];
  status: "loading" | "guest" | "ready" | "unavailable";
  error: string | null;
  pending: boolean;
  refresh: () => Promise<void>;
  clearAccount: () => void;
  earnTickets: (resultId: string) => Promise<MutationResult>;
  redeemPrize: (prizeId: string, requestId: string) => Promise<MutationResult>;
};
const TicketContext = createContext<Wallet | null>(null);
const unavailable = async (): Promise<never> => {
  throw new Error("Sign in after player services are connected.");
};

export function TicketWalletProvider({
  children,
  setupMessage,
}: {
  children: ReactNode;
  setupMessage: string | null;
}) {
  if (setupMessage)
    return (
      <TicketContext.Provider
        value={{
          user: null,
          tickets: null,
          shelf: [],
          status: "unavailable",
          error: setupMessage,
          pending: false,
          refresh: async () => {},
          clearAccount: () => {},
          earnTickets: unavailable,
          redeemPrize: unavailable,
        }}
      >
        {children}
      </TicketContext.Provider>
    );
  return <SessionWallet>{children}</SessionWallet>;
}
function SessionWallet({ children }: { children: ReactNode }) {
  const {
    data: session,
    isPending,
    isRefetching,
    error,
    refetch,
  } = authClient.useSession();
  // Remount all account-scoped client state when identity changes, including shop retry keys.
  return (
    <PlayerWalletScope
      key={session?.user.id ?? "guest"}
      user={session ? { id: session.user.id, name: session.user.name } : null}
      authPending={isPending || isRefetching}
      authFailed={!!error}
      refetchSession={refetch}
    >
      {children}
    </PlayerWalletScope>
  );
}
function PlayerWalletScope({
  children,
  user,
  authPending,
  authFailed,
  refetchSession,
}: {
  children: ReactNode;
  user: Player | null;
  authPending: boolean;
  authFailed: boolean;
  refetchSession: () => Promise<void>;
}) {
  const [snapshot, setSnapshot] = useState<PlayerSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [cleared, setCleared] = useState(false);
  const active = useRef(true);
  const generation = useRef(0);
  const busy = useRef(false);
  const blocked = useRef(false);
  const userId = user?.id;
  const refresh = useCallback(async () => {
    if (blocked.current) return;
    if (!userId) {
      setSnapshot(null);
      setLoading(false);
      return;
    }
    const version = ++generation.current;
    try {
      const response = await fetch("/api/player", { cache: "no-store" });
      const body = await response.json();
      if (!active.current || version !== generation.current) return;
      if (!response.ok)
        throw new Error(body.message || "Unable to load your wallet.");
      if (body.user.id !== userId) {
        setSnapshot(null);
        setError("Your account changed. Reloading player details…");
        await refetchSession();
        return;
      }
      setSnapshot(body);
      setError(null);
      setCleared(false);
    } catch (failure) {
      if (active.current && version === generation.current) {
        setSnapshot(null);
        setError(
          failure instanceof Error
            ? failure.message
            : "Unable to load your wallet.",
        );
      }
    } finally {
      if (active.current && version === generation.current) setLoading(false);
    }
  }, [userId, refetchSession]);
  useEffect(() => {
    active.current = true;
    void refresh();
    const onFocus = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const interval = window.setInterval(onFocus, 30000);
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel("arcade-wallet");
    if (channel) channel.onmessage = () => void refresh();
    return () => {
      active.current = false;
      generation.current++;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.clearInterval(interval);
      channel?.close();
    };
  }, [refresh]);
  function clearAccount() {
    blocked.current = true;
    generation.current++;
    setSnapshot(null);
    setError(null);
    setCleared(true);
  }
  async function mutate(path: string, body: object): Promise<MutationResult> {
    if (!userId || blocked.current || cleared || authFailed || authPending)
      throw new Error("Sign in before using tickets.");
    if (busy.current)
      throw new Error("Please wait for your current ticket transaction.");
    busy.current = true;
    setPending(true);
    try {
      const response = await fetch(`/api/player/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.message || "The transaction could not be completed.",
        );
      if (!active.current || blocked.current || result.userId !== userId)
        throw new Error("Your account changed. Refresh before continuing.");
      await refresh();
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("arcade-wallet");
        channel.postMessage("refresh");
        channel.close();
      }
      return result;
    } finally {
      busy.current = false;
      if (active.current) setPending(false);
    }
  }
  const ready =
    !authFailed &&
    !authPending &&
    !cleared &&
    snapshot?.user.id === userId &&
    !!userId;
  const status = authFailed
    ? "unavailable"
    : authPending
      ? "loading"
      : !user
        ? "guest"
        : ready
          ? "ready"
          : error
            ? "unavailable"
            : "loading";
  return (
    <TicketContext.Provider
      value={{
        user: authFailed || authPending || cleared ? null : user,
        tickets: ready ? snapshot!.tickets : null,
        shelf: ready ? snapshot!.shelf : [],
        status: loading && user && !error && !authFailed ? "loading" : status,
        error: authFailed
          ? "Player services are unavailable. Please try again shortly."
          : error,
        pending,
        refresh: async () => {
          blocked.current = false;
          setCleared(false);
          await refresh();
        },
        clearAccount,
        earnTickets: (resultId) => mutate("rewards", { resultId }),
        redeemPrize: (prizeId, requestId) =>
          mutate("redemptions", { prizeId, requestId }),
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}
export function useTicketWallet() {
  const wallet = useContext(TicketContext);
  if (!wallet)
    throw new Error("useTicketWallet must be used inside TicketWalletProvider");
  // Compatibility for the merged Dreamio UI. Client-reported rewards stay disabled.
  const defaults = initialDream();
  return { ...defaults, ...wallet, tickets: wallet.tickets ?? 0,
    nickname: wallet.user?.name ?? "", ready: wallet.status === "ready",
    storageAvailable: true,
    login: (_name: string) => { window.location.assign("/sign-in"); return false; },
    logout: wallet.clearAccount,
    addTickets: (_amount: number) => false,
    spendTickets: (_amount: number) => false,
    completeGame: (_slug: string, _score: number) => 0,
    checkIn: () => 0,
    purchase: (_id: string) => false,
    equip: (_id: string) => false,
    appearance: (_kind: "hair" | "skin", _value: number) => {},
  };
}
