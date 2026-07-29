import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light";

interface SettingsState {
  theme: Theme;
  commandPaletteOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      commandPaletteOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleCommandPalette: () => set({ commandPaletteOpen: !get().commandPaletteOpen }),
    }),
    { name: "jagat-manthan-settings" },
  ),
);