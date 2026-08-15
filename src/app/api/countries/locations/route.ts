import { NextResponse } from "next/server";
import { fetchAllCountryLocations } from "@/lib/providers/country-locations";

export async function GET() {
  const locations = await fetchAllCountryLocations();
  return NextResponse.json({ locations });
}
