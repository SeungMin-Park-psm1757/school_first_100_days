import { NextResponse } from "next/server";

import { buildCommunitySummary } from "@/lib/mock-ai";
import type { CommunitySummaryRequest } from "@/lib/types";

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => undefined)) ?? undefined) as
    | CommunitySummaryRequest
    | undefined;

  return NextResponse.json(buildCommunitySummary(body));
}
