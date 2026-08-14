import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AlertRule {
  id: string;
  symbol: string;
  label: string;
  direction: "above" | "below";
  thresholdPercent: number; // e.g. 5 means alert if |%change| >= 5
}

interface WatchlistState {
  savedSymbols: string[];
  alertRules: AlertRule[];
  addSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
  addAlertRule: (rule: Omit<AlertRule, "id">) => void;
  removeAlertRule: (id: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      savedSymbols: [],
      alertRules: [],
      addSymbol: (symbol) =>
        set({ savedSymbols: [...new Set([...get().savedSymbols, symbol])] }),
      removeSymbol: (symbol) =>
        set({ savedSymbols: get().savedSymbols.filter((s) => s !== symbol) }),
      addAlertRule: (rule) =>
        set({
          alertRules: [...get().alertRules, { ...rule, id: crypto.randomUUID() }],
        }),
      removeAlertRule: (id) =>
        set({ alertRules: get().alertRules.filter((r) => r.id !== id) }),
    }),
    { name: "jagat-manthan-watchlist" },
  ),
);
