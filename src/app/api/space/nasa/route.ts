import { NextResponse } from "next/server";
import { fetchNasaSnapshot } from "@/lib/providers/nasa";
import { serverEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await fetchNasaSnapshot(serverEnv.NASA_API_KEY ?? "DEMO_KEY");
  return NextResponse.json(snapshot);
}
