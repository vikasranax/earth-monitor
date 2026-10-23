"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { countries, type Country } from "@/lib/countries";
import { disputedTerritories } from "@/lib/disputed-territories";
import { LAYER_COLORS as C } from "@/lib/map-colors";
import type { UnrestMarker } from "@/lib/providers/unrest-acled";
import type { CountryLocation } from "@/lib/providers/country-locations";
import type { ArchitectureSite } from "@/lib/architecture-wonders";
import type { WebcamMarker } from "@/lib/providers/webcams";
import { DayNightLayer } from "@/components/map/DayNightLayer";
import type { MilitaryAircraft } from "@/lib/providers/military-aircraft";

const EDGE = "rgba(255,255,255,0.4)";

// Translucent fill from a theme colour. The plain declaration is the fallback
// for browsers without color-mix(); they simply drop the second line.
const translucent = (color: string, pct: number) =>
  `background:${color};background:color-mix(in srgb, ${color} ${pct}%, transparent);`;

const countryIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:${C.country};box-shadow:0 0 8px ${C.country};border:1px solid ${EDGE};"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const disputedIcon = L.divIcon({
  className: "",
  html: `<div style="width:11px;height:11px;background:${C.disputed};transform:rotate(45deg);box-shadow:0 0 8px ${C.disputed};border:1px solid ${EDGE};"></div>`,
  iconSize: [11, 11],
  iconAnchor: [5.5, 5.5],
});

const unrestIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:${C.unrest};box-shadow:0 0 8px ${C.unrest};border:1px solid ${EDGE};" class="animate-pulse"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const quakeMajorIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;${translucent(C.quake, 60)}box-shadow:0 0 12px ${C.quake};border:2px solid ${C.quakeMajor};"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const quakeModerateIcon = L.divIcon({
  className: "",
  html: `<div style="width:12px;height:12px;border-radius:50%;${translucent(C.quake, 50)}box-shadow:0 0 8px ${C.quake};border:1.5px solid ${C.quake};"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const cableIcon = L.divIcon({
  className: "",
  html: `<div style="width:8px;height:8px;border-radius:50%;background:${C.cable};box-shadow:0 0 6px ${C.cable};border:1px solid rgba(255,255,255,0.3);"></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

const placeIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;background:${C.place};transform:rotate(45deg);box-shadow:0 0 8px ${C.place};border:1px solid ${EDGE};"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const architectureIcon = L.divIcon({
  className: "",
  html: `<div style="width:12px;height:12px;background:${C.architecture};clip-path:polygon(50% 0%, 100% 100%, 0% 100%);box-shadow:0 0 8px ${C.architecture};"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 10],
});

const webcamIcon = L.divIcon({
  className: "",
  html: `<div style="width:12px;height:12px;background:${C.webcam};border-radius:2px;box-shadow:0 0 8px ${C.webcam};border:1px solid rgba(255,255,255,0.5);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const wildfireIcon = L.divIcon({
  className: "",
  html: `<div style="width:12px;height:12px;border-radius:50%;background:${C.wildfire};box-shadow:0 0 10px ${C.wildfire}, 0 0 4px ${C.unrest};border:1px solid ${EDGE};" class="animate-pulse"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const militaryIcon = L.divIcon({
  className: "",
  html: `<div style="width:11px;height:11px;background:${C.military};clip-path:polygon(50% 0%, 0% 100%, 100% 100%);box-shadow:0 0 8px ${C.military};border:1px solid ${EDGE};"></div>`,
  iconSize: [11, 11],
  iconAnchor: [5.5, 5.5],
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

interface CableLanding {
  id: string;
  name: string;
  lat: number;
  lng: number;
  cables: string[];
}

interface PlaceToVisit {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
  description?: string;
}

interface WildfireMarker {
  id: string;
  lat: number;
  lng: number;
  brightness: number;
  confidence: string;
  satellite: string;
  acquiredDate: string;
}

interface WorldMapProps {
  onSelectCountry: (country: Country) => void;
  baseLayer?: "dark" | "satellite";
  showDisputed?: boolean;
  showUnrest?: boolean;
  unrestMarkers?: UnrestMarker[];
  showQuakes?: boolean;
  quakes?: QuakeEvent[];
  showCables?: boolean;
  cableLandings?: CableLanding[];
  center?: [number, number];
  zoom?: number;
  showAllCountries?: boolean;
  allCountries?: CountryLocation[];
  showPlaces?: boolean;
  placesToVisit?: PlaceToVisit[];
  showDayNight?: boolean;
  showArchitecture?: boolean;
  architectureSites?: ArchitectureSite[];
  showWebcams?: boolean;
  webcams?: WebcamMarker[];
  showWildfires?: boolean;
  wildfires?: WildfireMarker[];
  showMilitary?: boolean;
  militaryAircraft?: MilitaryAircraft[];
}

// Module-level defaults. A fresh `[20, 0]` literal as a default parameter is a
// new array on every render, which made the controller below re-run setView
// and snap the map back to the world view whenever the parent re-rendered.
const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;

function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  const lat = center?.[0];
  const lng = center?.[1];
  useEffect(() => {
    if (lat === undefined || lng === undefined || zoom === undefined) return;
    map.setView([lat, lng], zoom, { animate: true, duration: 1 });
  }, [lat, lng, zoom, map]);
  return null;
}

// Leaflet only measures its container once. If the container is resized later
// (device rotation, address-bar collapse, late layout) it keeps the stale size
// and draws grey or partial tiles. This keeps it in sync.
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export function WorldMap({
  onSelectCountry,
  showDisputed = true,
  baseLayer = "dark",
  showUnrest = false,
  unrestMarkers = [],
  showQuakes = false,
  quakes = [],
  showCables = false,
  cableLandings = [],
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  showAllCountries = false,
  allCountries = [],
  showPlaces = false,
  placesToVisit = [],
  showDayNight = false,
  showArchitecture = false,
  architectureSites = [],
  showWebcams = false,
  webcams = [],
  showWildfires = false,
  wildfires = [],
  showMilitary = false,
  militaryAircraft = [],
}: WorldMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={2}
      style={{ height: "100%", width: "100%", background: "var(--bg-1)" }}
      worldCopyJump
    >
      <MapController center={center} zoom={zoom} />
      <MapResizer />
      {showDayNight && <DayNightLayer />}
      {baseLayer === "dark" ? (
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
      ) : (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
        />
      )}

      {countries.map((c) => (
        <Marker
          key={c.code}
          position={[c.lat, c.lng]}
          icon={countryIcon}
          eventHandlers={{ click: () => onSelectCountry(c) }}
        >
          <Popup>
            <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
              <strong>{c.name}</strong>
            </div>
          </Popup>
        </Marker>
      ))}

      {showDisputed &&
        disputedTerritories.map((t) => (
          <Marker key={t.id} position={[t.lat, t.lng]} icon={disputedIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "200px" }}>
                <strong>{t.name}</strong>
                <div
                  style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}
                >
                  {t.claims.map((claim, i) => (
                    <div key={i}>
                      <strong>{claim.claimant}:</strong> {claim.status}
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {showUnrest &&
        unrestMarkers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={unrestIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "220px" }}>
                <strong style={{ color: C.unrest }}>{m.locationName}</strong>
                <div style={{ marginTop: "4px", color: "var(--fg-2)" }}>
                  {m.count} event{m.count === 1 ? "" : "s"} recorded
                </div>
                {m.details.length > 0 && (
                  <div
                    style={{
                      marginTop: "6px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {m.details.map((d, i) => (
                      <a
                        key={i}
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "var(--accent)",
                          textDecoration: "underline",
                          fontSize: "11px",
                        }}
                      >
                        {d.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

      {showQuakes &&
        quakes.map((q) => (
          <Marker
            key={q.id}
            position={[q.lat, q.lng]}
            icon={q.magnitude >= 6 ? quakeMajorIcon : quakeModerateIcon}
          >
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "180px" }}>
                <strong style={{ color: q.magnitude >= 6 ? C.quakeMajor : C.quake }}>
                  M{q.magnitude.toFixed(1)} — {q.place}
                </strong>
                <div style={{ marginTop: "4px" }}>Depth: {q.depth.toFixed(1)} km</div>
                <div style={{ marginTop: "2px", color: "var(--fg-2)" }}>
                  {new Date(q.time).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {showCables &&
        cableLandings.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={cableIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "160px" }}>
                <strong>{c.name}</strong>
                <div style={{ marginTop: "4px", color: "var(--fg-2)" }}>
                  Cables: {c.cables.join(", ")}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {showAllCountries &&
        allCountries.map((c) => (
          <Marker key={c.code} position={[c.lat, c.lng]} icon={countryIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px" }}>{c.name}</div>
            </Popup>
          </Marker>
        ))}

      {showPlaces &&
        placesToVisit.map((p) => (
          <Marker key={p.id ?? p.name} position={[p.lat, p.lng]} icon={placeIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "160px" }}>
                <strong style={{ color: C.place }}>{p.name}</strong>
                {p.country && (
                  <div style={{ marginTop: "2px", color: "var(--fg-2)" }}>{p.country}</div>
                )}
                {p.description && (
                  <div style={{ marginTop: "4px", color: "var(--fg-1)" }}>{p.description}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

      {showArchitecture &&
        architectureSites.map((s) => (
          <Marker key={s.name} position={[s.lat, s.lng]} icon={architectureIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "180px" }}>
                <strong style={{ color: C.architecture }}>{s.name}</strong>
                <div style={{ marginTop: "2px", color: "var(--fg-2)" }}>
                  {s.location}, {s.country}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {showWebcams &&
        webcams.map((w) => (
          <Marker key={w.id} position={[w.lat, w.lng]} icon={webcamIcon}>
            <Popup minWidth={240} maxWidth={340}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  width: "min(320px, 70vw)",
                }}
              >
                <strong style={{ color: C.webcam }}>{w.title}</strong>
                <div
                  style={{
                    marginTop: "8px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}
                >
                  <iframe
                    src={w.playerUrl}
                    width="100%"
                    height="180"
                    loading="lazy"
                    allowFullScreen
                    style={{ display: "block", border: 0 }}
                    title={w.title}
                  ></iframe>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {showWildfires &&
        wildfires.map((w: WildfireMarker) => (
          <Marker key={w.id} position={[w.lat, w.lng]} icon={wildfireIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "180px" }}>
                <strong style={{ color: C.wildfire }}>Active Fire</strong>
                <div style={{ marginTop: "4px" }}>Brightness: {w.brightness}K</div>
                <div style={{ marginTop: "2px", color: "var(--fg-2)" }}>
                  Satellite: {w.satellite}
                </div>
                <div style={{ marginTop: "2px", color: "var(--fg-2)" }}>{w.acquiredDate}</div>
                <div style={{ marginTop: "4px", color: "var(--fg-muted)", fontSize: "10px" }}>
                  Source: NASA FIRMS
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {showMilitary &&
        militaryAircraft.map((a: MilitaryAircraft) => (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={militaryIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "180px" }}>
                <strong style={{ color: C.military }}>{a.callsign}</strong>
                <div style={{ marginTop: "2px", color: "var(--fg-2)" }}>
                  {a.aircraftType} · {a.registration}
                </div>
                {a.altitude !== null && (
                  <div style={{ marginTop: "2px", color: "var(--fg-1)" }}>
                    Alt: {a.altitude.toLocaleString()} ft
                    {a.speed !== null ? " · " + a.speed + " kn" : ""}
                  </div>
                )}
                <div style={{ marginTop: "6px", color: "var(--fg-muted)", fontSize: "10px" }}>
                  Source: OpenSky · callsign-matched (partial)
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
