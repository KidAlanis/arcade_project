"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { updateBalance } from "@/lib/wallet";
import {
  buyItem,
  claimDaily,
  equipItem,
  finishGame,
  initialDream,
  restoreDream,
  type DreamState,
} from "@/lib/dreamio";

const KEY = "dreamio-world-v1";
type Wallet = DreamState & {
  ready: boolean;
  storageAvailable: boolean;
  login: (name: string) => boolean;
  logout: () => void;
  addTickets: (amount: number) => boolean;
  spendTickets: (amount: number) => boolean;
  checkIn: () => number;
  purchase: (id: string) => boolean;
  equip: (id: string) => boolean;
  appearance: (kind: "hair" | "skin", value: number) => void;
  completeGame: (slug: string, score: number) => number;
};
const Context = createContext<Wallet | null>(null);
export function TicketWalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DreamState>(initialDream);
  const current = useRef(state);
  const hydrated = useRef(false);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) current.current = restoreDream(raw);
      localStorage.setItem(KEY, JSON.stringify(current.current));
    } catch {
      setStorageAvailable(false);
    }
    setState(current.current);
    hydrated.current = true;
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== KEY) return;
      current.current = event.newValue
        ? restoreDream(event.newValue)
        : initialDream();
      setState(current.current);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function commit(next: DreamState | null) {
    if (!hydrated.current || !next) return false;
    current.current = next;
    setState(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      setStorageAvailable(false);
    }
    return true;
  }
  function transact(amount: number, operation: "add" | "spend") {
    const tickets = updateBalance(current.current.tickets, amount, operation);
    return tickets !== null && commit({ ...current.current, tickets });
  }
  return (
    <Context.Provider
      value={{
        ...state,
        ready,
        storageAvailable,
        login: (name) =>
          !!name.trim() &&
          commit({ ...current.current, nickname: name.trim().slice(0, 16) }),
        logout: () => {
          commit({ ...current.current, nickname: "" });
        },
        addTickets: (amount) => transact(amount, "add"),
        spendTickets: (amount) => transact(amount, "spend"),
        checkIn: () => {
          const next = claimDaily(current.current);
          const reward = next ? next.tickets - current.current.tickets : 0;
          return commit(next) ? reward : 0;
        },
        purchase: (id) => commit(buyItem(current.current, id)),
        equip: (id) => commit(equipItem(current.current, id)),
        appearance: (kind, value) => {
          if ([0, 1, 2].includes(value))
            commit({ ...current.current, [kind]: value });
        },
        completeGame: (slug, score) => {
          const next = finishGame(current.current, slug, score);
          const reward = next ? next.tickets - current.current.tickets : 0;
          return commit(next) ? reward : 0;
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useTicketWallet() {
  const wallet = useContext(Context);
  if (!wallet) throw new Error("Wallet provider missing");
  return wallet;
}
