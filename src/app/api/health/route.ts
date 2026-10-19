import { NextResponse } from "next/server";
import { readiness } from "@/lib/env";
import { isRedisArmed } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  const r = readiness();
  return NextResponse.json(
    {
      status: "ok",
      time: new Date().toISOString(),
      providers: {
        armed: r.armedCount,
        total: r.totalCount,
        // Group-level only: shows what is degraded without naming secret keys.
        groups: r.groups.map((g) => {
          const wired = g.items.filter((i) => i.wired !== false);
          return {
            id: g.id,
            armed: wired.filter((i) => i.armed).length,
            total: wired.length,
          };
        }),
      },
      cache: { redis: isRedisArmed() },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
