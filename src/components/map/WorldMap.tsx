"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { countries, type Country } from "@/lib/countries";
import { disputedTerritories } from "@/lib/disputed-territories";
import type { UnrestMarker } from "@/lib/providers/unrest-acled";
import type { CountryLocation } from "@/lib/providers/country-locations";
import type { ArchitectureSite } from "@/lib/architecture-wonders";
import { DayNightLayer } from "@/components/map/DayNightLayer";
import type { MilitaryAircraft } from "@/lib/providers/military-aircraft";

const countryIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);border:1px solid rgba(255,255,255,0.4);"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const disputedIcon = L.divIcon({
  className: "",
  html: `<div style="width:11px;height:11px;background:var(--warn);transform:rotate(45deg);box-shadow:0 0 8px var(--warn);border:1px solid rgba(255,255,255,0.4);"></div>`,
  iconSize: [11, 11],
  iconAnchor: [5.5, 5.5],
});

const unrestIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:var(--danger);box-shadow:0 0 8px var(--danger);border:1px solid rgba(255,255,255,0.4);" class="animate-pulse"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const quakeMajorIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:rgba(245,197,66,0.6);box-shadow:0 0 12px rgba(245,197,66,0.8);border:2px solid var(--danger);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const quakeModerateIcon = L.divIcon({
  className: "",
  html: `<div style="width:12px;height:12px;border-radius:50%;background:rgba(245,197,66,0.5);box-shadow:0 0 8px rgba(245,197,66,0.6);border:1.5px solid var(--warn);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const cableIcon = L.divIcon({
  className: "",
  html: `<div style="width:8px;height:8px;border-radius:50%;background:#8b7cf6;box-shadow:0 0 6px #8b7cf6;border:1px solid rgba(255,255,255,0.3);"></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

const placeIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;background:var(--ok);transform:rotate(45deg);box-shadow:0 0 8px var(--ok);border:1px solid rgba(255,255,255,0.4);"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const architectureIcon = L.divIcon({
  className: "",
  html: `<div style="width:12px;height:12px;background:#f5c542;clip-path:polygon(50% 0%, 100% 100%, 0% 100%);box-shadow:0 0 8px #f5c542;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 10],
});

const militaryIcon = L.divIcon({
  className: "",
  html: `<div style="width:11px;height:11px;background:#3ba7ff;clip-path:polygon(50% 0%, 0% 100%, 100% 100%);box-shadow:0 0 8px #3ba7ff;border:1px solid rgba(255,255,255,0.4);"></div>`,
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
  showMilitary?: boolean;
  militaryAircraft?: MilitaryAircraft[];
}

function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
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
  center = [20, 0],
  zoom = 2,
  showAllCountries = false,
  allCountries = [],
  showPlaces = false,
  placesToVisit = [],
  showDayNight = false,
  showArchitecture = false,
  architectureSites = [],
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
                <strong style={{ color: "var(--danger)" }}>{m.locationName}</strong>
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
                    {m.details.map((d, i) =>
                      d.url ? (
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
                      ) : (
                        <span key={i} style={{ color: "var(--fg-2)", fontSize: "11px" }}>
                          {d.label}
                        </span>
                      ),
                    )}
                  </div>
                )}
                <div style={{ marginTop: "6px", color: "var(--fg-muted)", fontSize: "10px" }}>
                  Source: ACLED / Guardian
                </div>
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
                <strong style={{ color: q.magnitude >= 6 ? "#ff4d4f" : "#f5c542" }}>
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
                <strong style={{ color: "var(--ok)" }}>{p.name}</strong>
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
                <strong style={{ color: "#f5c542" }}>{s.name}</strong>
                <div style={{ marginTop: "2px", color: "var(--fg-2)" }}>
                  {s.location}, {s.country}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      {showMilitary &&
        militaryAircraft.map((a) => (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={militaryIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "180px" }}>
                <strong style={{ color: "#3ba7ff" }}>{a.callsign}</strong>
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
                  Source: airplanes.live · unfiltered
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
