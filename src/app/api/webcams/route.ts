import { NextResponse } from "next/server";
import { fetchLiveWebcams } from "@/lib/providers/webcams";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await fetchLiveWebcams();
  return NextResponse.json(data);
}
