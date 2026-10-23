"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import dynamic from "next/dynamic";
import { StatusBar, CommandPalette } from "@/components/terminal";
import { ThemeProvider } from "@/components/theme-provider";
import { CountryDossier } from "@/components/map/CountryDossier";
import { cableLandings } from "@/lib/cable-landings";
import { placesToVisit } from "@/lib/places-to-visit";
import { architectureSites } from "@/lib/architecture-wonders";
import { LAYER_COLORS as C } from "@/lib/map-colors";
import { pickArray, useMapLayer } from "@/hooks/useMapLayer";
import type { Country } from "@/lib/countries";
import type { UnrestMarker } from "@/lib/providers/unrest-acled";
import type { WebcamMarker } from "@/lib/providers/webcams";
import type { WildfireMarker } from "@/lib/providers/wildfires";
import type { MilitaryAircraft } from "@/lib/providers/military-aircraft";
import type { GeocodeResult } from "@/lib/providers/nominatim";
import type { CountryDossier as RestCountryDossier } from "@/lib/providers/rest-countries";

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

type SwatchShape = "circle" | "diamond" | "triangle" | "square";

function LayerSwatch({
  shape,
  color,
  pulse = false,
}: {
  shape: SwatchShape;
  color: string;
  pulse?: boolean;
}) {
  if (shape === "triangle") {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderBottom: `8px solid ${color}`,
        }}
      />
    );
  }
  const style: CSSProperties = {
    width: 8,
    height: 8,
    background: color,
    boxShadow: `0 0 4px ${color}`,
  };
  if (shape === "circle") style.borderRadius = "50%";
  if (shape === "diamond") style.transform = "rotate(45deg)";
  if (shape === "square") style.borderRadius = 2;
  return <div style={style} className={pulse ? "animate-pulse" : undefined} />;
}

function LayerToggle({
  label,
  active,
  onToggle,
  markerIcon,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  markerIcon?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-[var(--radius-sm)] border font-mono text-xs transition-colors ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
          : "border-[var(--border)] text-[var(--fg-2)] hover:bg-[var(--bg-2)]"
      }`}
    >
      <div className="flex items-center gap-2">
        {markerIcon && (
          <span className="flex items-center justify-center w-4 h-4 shrink-0">{markerIcon}</span>
        )}
        <span>{label}</span>
      </div>
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: active ? "var(--accent)" : "var(--fg-muted)" }}
      />
    </button>
  );
}

function LayerError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="text-[10px] text-[var(--danger)] font-mono px-1">{message}</p>;
}

const BASE_LAYERS = [
  { id: "dark", label: "Dark" },
  { id: "satellite", label: "Satellite" },
] as const;

function BaseLayerControl({
  baseLayer,
  onChange,
}: {
  baseLayer: "dark" | "satellite";
  onChange: (v: "dark" | "satellite") => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)]">
      {BASE_LAYERS.map((b) => (
        <button
          key={b.id}
          type="button"
          aria-pressed={baseLayer === b.id}
          onClick={() => onChange(b.id)}
          className={`flex-1 px-2 py-1.5 rounded-[var(--radius-sm)] font-mono text-[10px] uppercase tracking-wider transition-colors ${
            baseLayer === b.id
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--fg-2)] hover:bg-[var(--bg-3)]"
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

const withLoading = (label: string, loading: boolean) => (loading ? `${label} (loading…)` : label);

export default function MapPage() {
  const [selected, setSelected] = useState<Country | null>(null);
  const [baseLayer, setBaseLayer] = useState<"dark" | "satellite">("dark");

  // Static layers (data ships with the app).
  const [showDisputed, setShowDisputed] = useState(true);
  const [showCables, setShowCables] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showDayNight, setShowDayNight] = useState(false);

  // Fetched layers (loaded the first time they are switched on).
  const unrest = useMapLayer<UnrestMarker>("/api/unrest/live", pickArray<UnrestMarker>("markers"));
  const quakes = useMapLayer<QuakeEvent>("/api/quakes", pickArray<QuakeEvent>("events"));
  const allCountries = useMapLayer<CountryLocation>(
    "/api/countries/locations",
    pickArray<CountryLocation>("locations"),
  );
  const webcams = useMapLayer<WebcamMarker>("/api/webcams", pickArray<WebcamMarker>("markers"));
  const wildfires = useMapLayer<WildfireMarker>(
    "/api/wildfires",
    pickArray<WildfireMarker>("markers"),
  );
  const military = useMapLayer<MilitaryAircraft>(
    "/api/airspace/military",
    pickArray<MilitaryAircraft>("aircraft"),
  );

  const [geocodeQuery, setGeocodeQuery] = useState("");
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [restDossier, setRestDossier] = useState<RestCountryDossier | null>(null);
  const [restDossierLoading, setRestDossierLoading] = useState(false);
  const [restDossierError, setRestDossierError] = useState<string | null>(null);

  const handleGeocodeSearch = async () => {
    const query = geocodeQuery.trim();
    if (!query) return;
    setGeocodeLoading(true);
    setGeocodeResults([]);
    setGeocodeError(null);
    setRestDossier(null);
    setRestDossierError(null);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) {
        setGeocodeError(data.error);
      } else if (Array.isArray(data.results)) {
        setGeocodeResults(data.results);
        if (data.results.length === 1) {
          handleSelectGeocodeResult(data.results[0]);
        }
      } else {
        setGeocodeError("Invalid response from geocode API");
      }
    } catch (err) {
      setGeocodeError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setGeocodeLoading(false);
    }
  };

  const handleSelectGeocodeResult = async (result: GeocodeResult) => {
    setGeocodeResults([]);
    setGeocodeQuery(result.display_name);
    setRestDossier(null);
    setRestDossierError(null);

    const code = result.address?.country_code;
    if (!code) {
      setRestDossierError("No country code found in geocode result");
      return;
    }

    setRestDossierLoading(true);
    try {
      const res = await fetch(`/api/countries/dossier?code=${code.toUpperCase()}`);
      const data = await res.json();
      if (data.error) {
        setRestDossierError(data.error);
        setRestDossier(null);
      } else if (data.country) {
        setRestDossier(data.country);
      } else {
        setRestDossierError("Empty dossier response");
        setRestDossier(null);
      }
    } catch (err) {
      setRestDossierError(err instanceof Error ? err.message : "Dossier fetch failed");
      setRestDossier(null);
    } finally {
      setRestDossierLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <div className="flex-1 flex flex-col md:flex-row gap-0">
          {/*
            Map. On phones it comes first with an explicit height; flex-1 must
            NOT apply below md (in a column it sets flex-basis:0 and overrides
            the height, collapsing Leaflet's height:100% to 0). The map fills
            an absolutely positioned layer so its size never depends on flex
            maths.
          */}
          <div className="relative order-1 md:order-2 h-[60dvh] min-h-[320px] flex-none md:h-auto md:min-h-[480px] md:min-w-0 md:flex-1">
            <div className="absolute inset-0">
              <WorldMap
                onSelectCountry={setSelected}
                baseLayer={baseLayer}
                showDisputed={showDisputed}
                showUnrest={unrest.active}
                unrestMarkers={unrest.items}
                showQuakes={quakes.active}
                quakes={quakes.items}
                showCables={showCables}
                cableLandings={cableLandings}
                showAllCountries={allCountries.active}
                allCountries={allCountries.items}
                showPlaces={showPlaces}
                placesToVisit={placesToVisit}
                showDayNight={showDayNight}
                showArchitecture={showArchitecture}
                architectureSites={architectureSites}
                showWebcams={webcams.active}
                webcams={webcams.items}
                showWildfires={wildfires.active}
                wildfires={wildfires.items}
                showMilitary={military.active}
                militaryAircraft={military.items}
              />
            </div>
          </div>

          <aside className="order-2 md:order-1 w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-r border-[var(--border)] bg-[var(--bg-1)] p-4 flex flex-col gap-3 md:max-h-screen md:overflow-y-auto">
            {/* Dossier: directly under the map on phones, at the bottom on desktop. */}
            <div className="order-first md:order-last md:mt-auto pb-3 md:pb-0 md:pt-4 border-b md:border-b-0 md:border-t border-[var(--border)]">
              <CountryDossier country={selected} />
            </div>

            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)] mb-1">
              Base Layer
            </div>
            <BaseLayerControl baseLayer={baseLayer} onChange={setBaseLayer} />
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)] mt-2 mb-1">
              Map Layers
            </div>
            <LayerToggle
              label="Disputed Territories"
              active={showDisputed}
              onToggle={() => setShowDisputed((v) => !v)}
              markerIcon={<LayerSwatch shape="diamond" color={C.disputed} />}
            />
            <LayerToggle
              label={withLoading("Civil Unrest", unrest.loading)}
              active={unrest.active}
              onToggle={unrest.toggle}
              markerIcon={<LayerSwatch shape="circle" color={C.unrest} pulse />}
            />
            <LayerError message={unrest.error} />
            <LayerToggle
              label={withLoading("Earthquakes", quakes.loading)}
              active={quakes.active}
              onToggle={quakes.toggle}
              markerIcon={<LayerSwatch shape="circle" color={C.quake} />}
            />
            <LayerError message={quakes.error} />
            <LayerToggle
              label="Submarine Cables"
              active={showCables}
              onToggle={() => setShowCables((v) => !v)}
              markerIcon={<LayerSwatch shape="circle" color={C.cable} />}
            />
            <LayerToggle
              label={withLoading("All Countries", allCountries.loading)}
              active={allCountries.active}
              onToggle={allCountries.toggle}
              markerIcon={<LayerSwatch shape="circle" color={C.country} />}
            />
            <LayerError message={allCountries.error} />
            <LayerToggle
              label="Places to Visit"
              active={showPlaces}
              onToggle={() => setShowPlaces((v) => !v)}
              markerIcon={<LayerSwatch shape="diamond" color={C.place} />}
            />
            <LayerToggle
              label="Architecture & Wonders"
              active={showArchitecture}
              onToggle={() => setShowArchitecture((v) => !v)}
              markerIcon={<LayerSwatch shape="triangle" color={C.architecture} />}
            />
            <LayerToggle
              label={withLoading("Live Webcams", webcams.loading)}
              active={webcams.active}
              onToggle={webcams.toggle}
              markerIcon={<LayerSwatch shape="square" color={C.webcam} />}
            />
            <LayerError message={webcams.error} />
            <LayerToggle
              label={withLoading("Military Aircraft", military.loading)}
              active={military.active}
              onToggle={military.toggle}
              markerIcon={<LayerSwatch shape="triangle" color={C.military} />}
            />
            <LayerError message={military.error} />
            <LayerToggle
              label={withLoading("Wildfire Hotspots", wildfires.loading)}
              active={wildfires.active}
              onToggle={wildfires.toggle}
              markerIcon={<LayerSwatch shape="circle" color={C.wildfire} pulse />}
            />
            <LayerError message={wildfires.error} />
            <LayerToggle
              label="Day/Night"
              active={showDayNight}
              onToggle={() => setShowDayNight((v) => !v)}
              markerIcon={
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "linear-gradient(45deg, var(--bg-3) 50%, var(--accent) 50%)",
                    borderRadius: "2px",
                  }}
                />
              }
            />

            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)] mt-2 mb-1">
              Geocode Search
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={geocodeQuery}
                onChange={(e) => setGeocodeQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGeocodeSearch()}
                placeholder="Search place or country…"
                aria-label="Search place or country"
                className="flex-1 px-2 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)] text-xs text-[var(--fg-0)] font-mono placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={handleGeocodeSearch}
                disabled={geocodeLoading}
                className="px-2 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)] text-[var(--fg-2)] font-mono text-xs hover:bg-[var(--bg-3)] disabled:opacity-50"
              >
                {geocodeLoading ? "…" : "Go"}
              </button>
            </div>

            {geocodeError && (
              <p className="text-[10px] text-[var(--danger)] font-mono px-1 py-1 bg-[var(--danger)]/10 rounded">
                {geocodeError}
              </p>
            )}

            {geocodeResults.length > 0 && (
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border-2 border-[var(--accent)] rounded-[var(--radius-sm)] p-1 bg-[var(--bg-2)]">
                <div className="text-[10px] text-[var(--fg-muted)] font-mono px-1">
                  {geocodeResults.length} result{geocodeResults.length !== 1 ? "s" : ""} — click to
                  select
                </div>
                {geocodeResults.map((r) => (
                  <button
                    key={r.place_id}
                    type="button"
                    onClick={() => handleSelectGeocodeResult(r)}
                    className="text-left px-2 py-1.5 rounded-[var(--radius-sm)] text-[10px] text-[var(--fg-1)] font-mono bg-[var(--bg-3)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)] transition-colors border border-transparent hover:border-[var(--accent)]"
                  >
                    {r.display_name}
                  </button>
                ))}
              </div>
            )}

            {restDossierLoading && (
              <div className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--accent)] bg-[var(--accent)]/10">
                <p className="text-[10px] text-[var(--accent)] font-mono animate-pulse">
                  Loading dossier…
                </p>
              </div>
            )}

            {restDossierError && !restDossierLoading && (
              <div className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--danger)] bg-[var(--danger)]/10">
                <p className="text-[10px] text-[var(--danger)] font-mono">{restDossierError}</p>
              </div>
            )}

            {restDossier && !restDossierLoading && (
              <div className="p-3 rounded-[var(--radius-sm)] border-2 border-[var(--accent)] bg-[var(--bg-2)]">
                <div className="flex items-center gap-2 mb-2">
                  {restDossier.flags?.png ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={restDossier.flags.png}
                        alt={restDossier.name?.common || ""}
                        className="w-8 h-5 object-cover rounded-sm border border-[var(--border)]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </>
                  ) : (
                    <div className="w-8 h-5 rounded-sm bg-[var(--bg-3)] border border-[var(--border)]" />
                  )}
                  <span className="text-sm font-semibold text-[var(--fg-0)]">
                    {restDossier.name?.common || "Unknown"}
                  </span>
                  <span className="text-[10px] text-[var(--fg-muted)] font-mono">
                    {restDossier.cca2}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-mono text-[var(--fg-1)]">
                  {Array.isArray(restDossier.capital) && restDossier.capital.length > 0 && (
                    <div>
                      <span className="text-[var(--fg-muted)]">Capital:</span>{" "}
                      {restDossier.capital[0]}
                    </div>
                  )}
                  <div>
                    <span className="text-[var(--fg-muted)]">Region:</span>{" "}
                    {restDossier.region || "Unknown"}
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)]">Population:</span>{" "}
                    {typeof restDossier.population === "number"
                      ? restDossier.population.toLocaleString()
                      : "—"}
                  </div>
                  {typeof restDossier.area === "number" && (
                    <div>
                      <span className="text-[var(--fg-muted)]">Area:</span>{" "}
                      {restDossier.area.toLocaleString()} km²
                    </div>
                  )}
                  {restDossier.currencies &&
                    typeof restDossier.currencies === "object" &&
                    Object.keys(restDossier.currencies).length > 0 && (
                      <div className="col-span-2">
                        <span className="text-[var(--fg-muted)]">Currency:</span>{" "}
                        {Object.entries(restDossier.currencies)
                          .map(([code, cur]) => `${cur.name} (${code})`)
                          .join(", ")}
                      </div>
                    )}
                  {restDossier.languages &&
                    typeof restDossier.languages === "object" &&
                    Object.keys(restDossier.languages).length > 0 && (
                      <div className="col-span-2">
                        <span className="text-[var(--fg-muted)]">Languages:</span>{" "}
                        {Object.values(restDossier.languages).join(", ")}
                      </div>
                    )}
                  {Array.isArray(restDossier.borders) && restDossier.borders.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-[var(--fg-muted)]">Borders:</span>{" "}
                      {restDossier.borders.join(", ")}
                    </div>
                  )}
                  <div>
                    <span className="text-[var(--fg-muted)]">UN Member:</span>{" "}
                    {restDossier.unMember ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)]">Landlocked:</span>{" "}
                    {restDossier.landlocked ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
