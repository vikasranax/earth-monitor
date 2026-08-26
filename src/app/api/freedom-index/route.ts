import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchVoidlyScores, getCountryFreedomStatus } from "@/lib/providers/voidly";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("code");

  if (countryCode) {
    const status = await getCountryFreedomStatus(countryCode);
    if (!status) {
      return NextResponse.json({ error: "Country not found or data unavailable" }, { status: 404 });
    }
    return NextResponse.json({ country: status });
  }

  const snapshot = await fetchVoidlyScores();
  if (snapshot.error) {
    return NextResponse.json({ error: snapshot.error, scores: [] }, { status: 503 });
  }

  return NextResponse.json(snapshot);
}
