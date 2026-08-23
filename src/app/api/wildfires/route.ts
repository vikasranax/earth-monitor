import { NextResponse } from "next/server";
import { fetchLiveWildfires } from "@/lib/providers/wildfires";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await fetchLiveWildfires();
  return NextResponse.json(data);
}
