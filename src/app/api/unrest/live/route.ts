import { NextResponse } from "next/server";
import { fetchLiveUnrest } from "@/lib/providers/unrest-live";

export async function GET() {
  const result = await fetchLiveUnrest();
  return NextResponse.json(result);
}
