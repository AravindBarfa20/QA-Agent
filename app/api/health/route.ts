import { NextResponse } from "next/server";
import { getSetupStatus } from "../../../lib/setup-status";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ service: "watcher-qa", setup: getSetupStatus(process.env) }, { headers: { "Cache-Control": "no-store" } });
}
