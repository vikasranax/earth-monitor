import { NextResponse } from "next/server";
import { fetchEarthquakes } from "@/lib/providers/usgs";

export async function GET() {
  const result = await fetchEarthquakes("week");
  return NextResponse.json(result);
}
