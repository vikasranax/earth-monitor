"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
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

interface WorldMapProps {
  onSelectCountry: (country: Country) => void;
  showDisputed: boolean;
  showUnrest: boolean;
}

export function WorldMap({ onSelectCountry, showDisputed, showUnrest }: WorldMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      style={{ height: "500px", width: "100%", background: "var(--bg-1)" }}
      worldCopyJump
    >
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
          <Popup>{c.name}</Popup>
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
                  ⚠ SAMPLE DATA — not a live event
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
