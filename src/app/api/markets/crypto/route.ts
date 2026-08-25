import { NextResponse } from "next/server";
import { fetchCryptoSnapshot } from "@/lib/providers/coingecko";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await fetchCryptoSnapshot();
  return NextResponse.json(snapshot);
}
