"use client";

import { useEffect, useRef, useState } from "react";
import { publicEnv } from "@/lib/env.public";
import { straits } from "@/lib/straits";

export interface VesselPing {
  mmsi: string;
  name: string;
  lat: number;
  lon: number;
  speed: number;
  straitId: string;
  receivedAt: string;
}

export type AisConnectionStatus = "idle" | "connecting" | "live" | "error" | "not_armed";

function isWithinBox(lat: number, lon: number, box: [[number, number], [number, number]]): boolean {
  const [[lat1, lon1], [lat2, lon2]] = box;
  const minLat = Math.min(lat1, lat2);
  const maxLat = Math.max(lat1, lat2);
  const minLon = Math.min(lon1, lon2);
  const maxLon = Math.max(lon1, lon2);
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

export function useAisStream() {
  const [status, setStatus] = useState<AisConnectionStatus>("idle");
  const [vessels, setVessels] = useState<VesselPing[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const apiKey = publicEnv.NEXT_PUBLIC_AISSTREAM_API_KEY;
    if (!apiKey) {
      setStatus("not_armed");
      return;
    }

    setStatus("connecting");
    const ws = new WebSocket("wss://stream.aisstream.io/v0/stream");
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("live");
      ws.send(
        JSON.stringify({
          APIKey: apiKey,
          BoundingBoxes: straits.map((s) => s.boundingBox),
          FilterMessageTypes: ["PositionReport"],
        }),
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const report = msg?.Message?.PositionReport;
        const meta = msg?.MetaData;
        if (!report || !meta) return;

        const lat = report.Latitude;
        const lon = report.Longitude;
        const strait = straits.find((s) => isWithinBox(lat, lon, s.boundingBox));

        setVessels((prev) => {
          const next: VesselPing = {
            mmsi: String(meta.MMSI),
            name: meta.ShipName?.trim() || "Unknown vessel",
            lat,
            lon,
            speed: report.Sog ?? 0,
            straitId: strait?.id ?? "unknown",
            receivedAt: new Date().toISOString(),
          };
          const filtered = prev.filter((v) => v.mmsi !== next.mmsi);
          return [next, ...filtered].slice(0, 50);
        });
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus((s) => (s === "error" ? s : "idle"));

    return () => {
      ws.close();
    };
  }, []);

  return { status, vessels };
}
