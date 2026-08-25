import { NextResponse } from "next/server";
import { fetchAllCountryDossiers, fetchCountryByCode } from "@/lib/providers/rest-countries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const country = await fetchCountryByCode(code);
    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }
    return NextResponse.json({ country, cached: false });
  }

  const snapshot = await fetchAllCountryDossiers();
  return NextResponse.json(snapshot);
}
