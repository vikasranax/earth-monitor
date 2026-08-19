"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StatusBar, CommandPalette } from "@/components/terminal";
import { ThemeProvider } from "@/components/theme-provider";
import { CountryDossier } from "@/components/map/CountryDossier";
import { cableLandings } from "@/lib/cable-landings";
import { placesToVisit } from "@/lib/places-to-visit";
import { architectureSites } from "@/lib/architecture-wonders";
import type { Country } from "@/lib/countries";
import type { UnrestMarker } from "@/lib/providers/unrest-live";

const WorldMap = dynamic(() => import("@/components/map/WorldMap").then((mod) => mod.WorldMap), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[var(--bg-1)]" />,
});

interface QuakeEvent {
  id: string;
  place: string;
  magnitude: number;
  lat: number;
  lng: number;
  depth: number;
  time: string;
}

interface CountryLocation {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

function LayerToggle({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-[var(--radius-sm)] border font-mono text-xs transition-colors ${active ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--border)] text-[var(--fg-2)] hover:bg-[var(--bg-2)]"}`}
    >
      <span>{label}</span>
      <span className="w-2 h-2 rounded-full" style={{ background: active ? "var(--accent)" : "var(--fg-muted)" }} />
    </button>
  );
}

function BaseLayerControl({ baseLayer, onChange }: { baseLayer: "dark" | "satellite"; onChange: (v: "dark" | "satellite") => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)]">
      <button
        onClick={() => onChange("dark")}
        className={`flex-1 px-2 py-1.5 rounded-[var(--radius-sm)] font-mono text-[10px] uppercase tracking-wider transition-colors ${baseLayer === "dark" ? "bg-[var(--accent)] text-white" : "text-[var(--fg-2)] hover:bg-[var(--bg-3)]"}`}
      >
        Dark
      </button>
      <button
        onClick={() => onChange("satellite")}
        className={`flex-1 px-2 py-1.5 rounded-[var(--radius-sm)] font-mono text-[10px] uppercase tracking-wider transition-colors ${baseLayer === "satellite" ? "bg-[var(--accent)] text-white" : "text-[var(--fg-2)] hover:bg-[var(--bg-3)]"}`}
      >
        Satellite
      </button>
    </div>
  );
}

export default function MapPage() {
  const [selected, setSelected] = useState<Country | null>(null);
  const [baseLayer, setBaseLayer] = useState<"dark" | "satellite">("dark");
  const [showDisputed, setShowDisputed] = useState(true);
  const [showUnrest, setShowUnrest] = useState(false);
  const [showQuakes, setShowQuakes] = useState(false);
  const [showCables, setShowCables] = useState(false);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [allCountries, setAllCountries] = useState<CountryLocation[]>([]);
  const [quakes, setQuakes] = useState<QuakeEvent[]>([]);
  const [unrestMarkers, setUnrestMarkers] = useState<UnrestMarker[]>([]);
  const [unrestError, setUnrestError] = useState<string | null>(null);
  const [loadingQuakes, setLoadingQuakes] = useState(false);
  const [loadingUnrest, setLoadingUnrest] = useState(false);
  const [showDayNight, setShowDayNight] = useState(false);

  useEffect(() => {
    if (showAllCountries && allCountries.length === 0) {
      fetch("/api/countries/locations")
        .then((res) => res.json())
        .then((data) => setAllCountries(data.locations || []))
        .catch(() => setAllCountries([]));
    }
  }, [showAllCountries, allCountries.length]);

  const handleToggleQuakes = async () => {
    const next = !showQuakes;
    setShowQuakes(next);
    if (next && quakes.length === 0) {
      setLoadingQuakes(true);
      try {
        const res = await fetch("/api/quakes");
        if (res.ok) {
          const data = await res.json();
          setQuakes(data.events || []);
        }
      } catch {
      } finally {
        setLoadingQuakes(false);
      }
    }
  };

  const handleToggleUnrest = async () => {
    const next = !showUnrest;
    setShowUnrest(next);
    if (next && unrestMarkers.length === 0) {
      setLoadingUnrest(true);
      setUnrestError(null);
      try {
        const res = await fetch("/api/unrest/live");
        const data = await res.json();
        if (data.error) setUnrestError(data.error);
        setUnrestMarkers(data.markers || []);
        // eslint-disable-next-line no-console
        console.log("[unrest debug]", data.debug);
      } catch (err) {
        setUnrestError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoadingUnrest(false);
      }
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <div className="flex-1 flex flex-col md:flex-row gap-0">
          <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--bg-1)] p-4 flex flex-col gap-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)] mb-1">Base Layer</div>
            <BaseLayerControl baseLayer={baseLayer} onChange={setBaseLayer} />

            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)] mt-2 mb-1">Map Layers</div>
            <LayerToggle label="Disputed Territories" active={showDisputed} onToggle={() => setShowDisputed((v) => !v)} />
            <LayerToggle
              label={`Civil Unrest (City-Level) ${loadingUnrest ? "(loading…)" : ""}`}
              active={showUnrest}
              onToggle={handleToggleUnrest}
            />
            {unrestError && (
              <p className="text-[10px] text-[var(--danger)] font-mono px-1">{unrestError}</p>
            )}
            <LayerToggle
              label={`Earthquakes ${loadingQuakes ? "(loading…)" : ""}`}
              active={showQuakes}
              onToggle={handleToggleQuakes}
            />
            <LayerToggle label="Submarine Cables" active={showCables} onToggle={() => setShowCables((v) => !v)} />
            <LayerToggle label="All Countries" active={showAllCountries} onToggle={() => setShowAllCountries((v) => !v)} />
            <LayerToggle label="Places to Visit" active={showPlaces} onToggle={() => setShowPlaces((v) => !v)} />
            <LayerToggle label="Architecture & Wonders" active={showArchitecture} onToggle={() => setShowArchitecture((v) => !v)} />
            <LayerToggle label="Day/Night" active={showDayNight} onToggle={() => setShowDayNight((v) => !v)} />
            <div className="mt-auto pt-4 border-t border-[var(--border)]">
              <CountryDossier country={selected} />
            </div>
          </div>
          <div className="flex-1 h-[500px] md:h-auto relative">
            <WorldMap
              onSelectCountry={setSelected}
              baseLayer={baseLayer}
              showDisputed={showDisputed}
              showUnrest={showUnrest}
              unrestMarkers={unrestMarkers}
              showQuakes={showQuakes}
              quakes={quakes}
              showCables={showCables}
              cableLandings={cableLandings}
              showAllCountries={showAllCountries}
              allCountries={allCountries}
              showPlaces={showPlaces}
              placesToVisit={placesToVisit}
              showDayNight={showDayNight}
              showArchitecture={showArchitecture}
              architectureSites={architectureSites}
            />
          </div>
        </div>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
