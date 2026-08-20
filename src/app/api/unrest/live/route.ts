import { NextResponse } from "next/server";
import { fetchLiveUnrestAcled } from "@/lib/providers/unrest-acled";
import { fetchLiveUnrestGuardian } from "@/lib/providers/unrest-guardian";

export async function GET() {
  const acled = await fetchLiveUnrestAcled();

  if (acled.armed && !acled.error && acled.markers.length > 0) {
    return NextResponse.json(acled);
  }

  const guardian = await fetchLiveUnrestGuardian();
  return NextResponse.json({
    ...guardian,
    source: guardian.armed ? "guardian" : "none",
  });
}
