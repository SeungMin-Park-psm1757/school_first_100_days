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
  description: "우리 가정 상황에 맞는 돌봄·방과후 조합을 비교하고 선택 이유를 확인하세요."
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
