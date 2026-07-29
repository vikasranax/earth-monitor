import { NextResponse } from "next/server";
import { readiness } from "@/lib/env";
import { isRedisArmed } from "@/lib/redis";

export async function GET() {
  const r = readiness();
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    providers: { armed: r.armedCount, total: r.totalCount },
    cache: { redis: isRedisArmed() },
  });
}
