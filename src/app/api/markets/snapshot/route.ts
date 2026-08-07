import { NextResponse } from "next/server";
import { fetchMarketQuotes } from "@/lib/providers/twelvedata";

export async function GET() {
  const result = await fetchMarketQuotes();
  return NextResponse.json(result);
}
