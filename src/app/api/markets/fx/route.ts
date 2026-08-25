import { NextResponse } from "next/server";
import { fetchFxSnapshot, convertFx } from "@/lib/providers/frankfurter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get("base") ?? "USD";
  const amount = searchParams.get("amount");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (amount && from && to) {
    const result = await convertFx(Number(amount), from, to);
    return NextResponse.json(result);
  }

  const snapshot = await fetchFxSnapshot(base);
  return NextResponse.json(snapshot);
}
