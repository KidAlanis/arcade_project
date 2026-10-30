"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { updateBalance } from "@/lib/wallet";

type Wallet = {
  tickets: number;
  addTickets: (amount: number) => boolean;
  spendTickets: (amount: number) => boolean;
};
const TicketContext = createContext<Wallet | null>(null);

// Mounted once in the root layout. The ref makes consecutive transactions atomic
// even when React batches renders. This foundation keeps tickets for this session.
export function TicketWalletProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState(0);
  const balance = useRef(0);
  function transact(amount: number, operation: "add" | "spend") {
    const next = updateBalance(balance.current, amount, operation);
    if (next === null) return false;
    balance.current = next;
    setTickets(next);
    return true;
  }
  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTickets: (amount) => transact(amount, "add"),
        spendTickets: (amount) => transact(amount, "spend"),
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
  return wallet;
}
