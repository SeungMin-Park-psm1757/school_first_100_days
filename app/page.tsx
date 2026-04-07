import type { Metadata } from "next";

import { HomePlanner } from "@/components/home-planner";
import {
  childTraitOptions,
  concernOptions,
  heroSummary,
  phaseOrder,
  regionOptions,
  userProfile,
  workTypeOptions
} from "@/lib/data";
import { demoScenarios } from "@/lib/demo-scenarios";
import { buildPlan } from "@/lib/mock-ai";

export const metadata: Metadata = {
  title: "홈",
  description: "입력하면 이번 주 할 일 3개를 바로 보여줍니다."
};

export default function HomePage() {
  return (
    <HomePlanner
      concernOptions={concernOptions}
      demoScenarios={demoScenarios}
      headline={heroSummary.headline}
      initialPlan={buildPlan(userProfile)}
      initialProfile={userProfile}
      phaseOptions={phaseOrder}
      regionOptions={regionOptions}
      traitOptions={childTraitOptions}
      workTypeOptions={workTypeOptions}
    />
  );
}
