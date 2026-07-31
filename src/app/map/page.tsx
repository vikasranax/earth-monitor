"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { StatusBar, CommandPalette } from "@/components/terminal";
import { ThemeProvider } from "@/components/theme-provider";
import { CountryDossier } from "@/components/map/CountryDossier";
import { LayerToggle } from "@/components/map/LayerToggle";
import type { Country } from "@/lib/countries";

const WorldMap = dynamic(() => import("@/components/map/WorldMap").then((mod) => mod.WorldMap), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[var(--bg-1)]" />,
});

export default function MapPage() {
  const [selected, setSelected] = useState<Country | null>(null);
  const [showDisputed, setShowDisputed] = useState(true);
  const [showUnrest, setShowUnrest] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <LayerToggle
          showDisputed={showDisputed}
          showUnrest={showUnrest}
          onToggleDisputed={() => setShowDisputed((v) => !v)}
          onToggleUnrest={() => setShowUnrest((v) => !v)}
        />
        <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 max-w-7xl mx-auto w-full">
          <div className="flex-1 h-[600px] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)]">
            <WorldMap
              onSelectCountry={setSelected}
              showDisputed={showDisputed}
              showUnrest={showUnrest}
            />
          </div>
          <div className="w-full md:w-80 shrink-0">
            <CountryDossier country={selected} />
          </div>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
