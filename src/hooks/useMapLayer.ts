"use client";

import { useState } from "react";

export interface MapLayer<T> {
  active: boolean;
  items: T[];
  loading: boolean;
  error: string | null;
  toggle: () => void;
}

/** Build a picker that pulls an array out of an API payload, tolerating bad shapes. */
export function pickArray<T>(key: string): (data: unknown) => T[] {
  return (data) => {
    if (data === null || typeof data !== "object") return [];
    const value = (data as Record<string, unknown>)[key];
    return Array.isArray(value) ? (value as T[]) : [];
  };
}

function apiError(data: unknown): string | null {
  if (data === null || typeof data !== "object") return null;
  const e = (data as Record<string, unknown>).error;
  if (!e) return null;
  return typeof e === "string" ? e : "Layer request failed";
}

/**
 * A lazily-loaded map layer: the data is fetched the first time the layer is
 * switched on, and fetched again on a later switch-on only if nothing was
 * loaded (so an empty or failed result can be retried). Errors are surfaced
 * rather than swallowed, and any items the API returned alongside an error
 * are still kept.
 */
export function useMapLayer<T>(url: string, pick: (data: unknown) => T[]): MapLayer<T> {
  const [active, setActive] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const data: unknown = await res.json().catch(() => null);
      setError(apiError(data) ?? (res.ok ? null : `Request failed (${res.status})`));
      setItems(pick(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    const next = !active;
    setActive(next);
    if (next && items.length === 0 && !loading) void load();
  }

  return { active, items, loading, error, toggle };
}
