"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { countries, type Country } from "@/lib/countries";
import { disputedTerritories } from "@/lib/disputed-territories";
import { sampleUnrestEvents } from "@/lib/unrest-events";

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
  html: `<div style="width:16px;height:16px;border-radius:50%;background:rgba(255,77,79,0.6);box-shadow:0 0 12px rgba(255,77,79,0.8);border:2px solid var(--danger);"></div>`,
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

interface WorldMapProps {
  onSelectCountry: (country: Country) => void;
  showDisputed?: boolean;
  showUnrest?: boolean;
  showQuakes?: boolean;
  quakes?: QuakeEvent[];
  showCables?: boolean;
  cableLandings?: CableLanding[];
  center?: [number, number];
  zoom?: number;
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
  showUnrest = false,
  showQuakes = false,
  quakes = [],
  showCables = false,
  cableLandings = [],
  center = [20, 0],
  zoom = 2,
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
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

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
        sampleUnrestEvents.map((e) => (
          <Marker key={e.id} position={[e.lat, e.lng]} icon={unrestIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "180px" }}>
                <strong>{e.location}</strong>
                <div style={{ marginTop: "4px" }}>{e.summary}</div>
                <div style={{ marginTop: "6px", color: "#b8860b", fontSize: "10px" }}>
                  ⚠ SAMPLE DATA
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
    </MapContainer>
  );
}
