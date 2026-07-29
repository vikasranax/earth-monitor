import type { ReactNode } from "react";
import { StatusBar, CommandPalette } from "@/components/terminal";
import { ThemeProvider } from "@/components/theme-provider";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4">{children}</main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}