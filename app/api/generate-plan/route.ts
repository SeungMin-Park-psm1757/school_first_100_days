import { NextResponse } from "next/server";

import { buildPlan } from "@/lib/mock-ai";
import type { UserProfile } from "@/lib/types";

export async function POST(request: Request) {
  const profile = ((await request.json().catch(() => undefined)) ?? undefined) as
    | Partial<UserProfile>
    | undefined;

  return NextResponse.json(buildPlan(profile));
}
