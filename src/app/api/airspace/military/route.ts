import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Use a CORS proxy or fetch via allorigins
    const res = await fetch(
      "https://api.allorigins.win/raw?url=https://api.airplanes.live/v2/mil",
      {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        next: { revalidate: 0 },
      },
    );

    if (!res.ok) throw new Error("Proxy returned " + res.status);

    const data = await res.json();
    return NextResponse.json({
      aircraft: data.ac ?? [],
      cached: false,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      aircraft: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "Failed to fetch military aircraft",
    });
  }
}
