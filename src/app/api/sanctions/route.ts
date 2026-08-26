import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { searchSanctions } from "@/lib/providers/opensanctions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const country = searchParams.get("country");

  // If country parameter is provided, search for that country
  const searchQuery = country || query;

  if (!searchQuery) {
    return NextResponse.json({ error: "Query parameter 'q' or 'country' is required" }, { status: 400 });
  }

  const result = await searchSanctions(searchQuery);
  
  if (result.error) {
    return NextResponse.json({ error: result.error, entities: [] }, { status: 503 });
  }

  return NextResponse.json(result);
}
