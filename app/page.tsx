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
  description: "가정 상황을 입력하고 입학 후 첫 100일 행동 우선순위를 바로 확인하세요."
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
