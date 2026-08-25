import { NextResponse } from "next/server";
import { geocode, reverseGeocode } from "@/lib/providers/nominatim";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const polygon = searchParams.get("polygon") === "1";
  const rawLimit = searchParams.get("limit");
  const limit = rawLimit && !Number.isNaN(Number(rawLimit)) ? Number(rawLimit) : 5;

  if (lat && lon) {
    const result = await reverseGeocode(Number(lat), Number(lon));
    if (!result) {
      return NextResponse.json({ error: "Reverse geocode failed" }, { status: 502 });
    }
    return NextResponse.json({ result, cached: false });
  }

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: "Missing query parameter 'q' or lat/lon" }, { status: 400 });
  }

  const snapshot = await geocode(q.trim(), { limit, polygonGeojson: polygon });

  if (snapshot.error) {
    return NextResponse.json(snapshot, { status: 502 });
  }

  return NextResponse.json(snapshot);
}
