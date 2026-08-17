"use client";

import { useState, useEffect } from "react";
import { Polygon } from "react-leaflet";
import { computeTerminatorPolygon } from "@/lib/terminator";

const UPDATE_INTERVAL_MS = 60_000; // recompute every minute — the terminator moves slowly

export function DayNightLayer() {
  const [positions, setPositions] = useState<[number, number][]>(() =>
    computeTerminatorPolygon(new Date()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setPositions(computeTerminatorPolygon(new Date()));
    }, UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: "transparent",
        fillColor: "#000000",
        fillOpacity: 0.35,
        stroke: false,
      }}
    />
  );
}
