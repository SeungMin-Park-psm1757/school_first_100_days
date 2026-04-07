import type { Metadata } from "next";

import { RecommendationExplorer } from "@/components/recommendation-explorer";
import {
  childTraitOptions,
  recommendations,
  timeNeededOptions,
  userProfile,
  weekdayNeedOptions,
  workTypeOptions
} from "@/lib/data";
import { buildCommunitySummary } from "@/lib/mock-ai";

export const metadata: Metadata = {
  title: "추천 결과",
  description: "지금 가능한 돌봄·방과후 조합 2~3개를 비교합니다."
};

export default function RecommendationsPage() {
  const initialRecommendations = recommendations.slice(0, 3);

  return (
    <RecommendationExplorer
      childTraitOptions={childTraitOptions}
      initialPanel={buildCommunitySummary({
        profile: userProfile,
        recommendationIds: initialRecommendations.map((recommendation) => recommendation.id)
      })}
      recommendations={recommendations}
      timeNeededOptions={timeNeededOptions}
      userProfile={userProfile}
      weekdayNeedOptions={weekdayNeedOptions}
      workTypeOptions={workTypeOptions}
    />
  );
}
