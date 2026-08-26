import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchCountryGovernanceProfile } from "@/lib/providers/world-bank";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Country code parameter 'code' is required" }, { status: 400 });
  }

  const profile = await fetchCountryGovernanceProfile(code.toUpperCase());
  
  if (profile.error) {
    return NextResponse.json({ error: profile.error }, { status: 503 });
  }

  return NextResponse.json(profile);
}
