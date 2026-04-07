import { communityTips, heroSummary, mergeUserProfile, recommendations } from "@/lib/data";
import type {
  CommunitySummaryRequest,
  CommunitySummaryResponse,
  GeneratedPlanResponse,
  Phase,
  UserProfile
} from "@/lib/types";

const phaseActionMap: Record<Phase, string[]> = {
  "입학 준비": [
    "학교 앱과 안내 채널부터 묶어두세요.",
    "등하교 방식과 준비물 자리를 먼저 정하세요."
  ],
  "첫 2주": [
    "하교 동선을 먼저 고정하세요.",
    "돌봄·방과후 신청 일정을 다시 확인하세요."
  ],
  "1개월 적응": [
    "피로도와 귀가 후 반응을 5일만 적어보세요.",
    "공백 요일부터 먼저 표시하세요."
  ],
  "돌봄 재조정": [
    "대체 귀가 동선을 2안까지 준비하세요.",
    "신청 일정은 가족 캘린더에 모아두세요."
  ],
  "100일 회고": [
    "유지된 루틴만 따로 적어두세요.",
    "다음 학기 체크포인트를 저장하세요."
  ]
};

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function hasConcern(profile: UserProfile, keyword: string) {
  return profile.mainConcern.includes(keyword);
}

function hasTrait(profile: UserProfile, keyword: string) {
  return profile.childTraits.some((trait) => trait.includes(keyword));
}

export function buildPlan(profileInput?: Partial<UserProfile>): GeneratedPlanResponse {
  const profile = mergeUserProfile(profileInput);

  const concernActions = [
    hasConcern(profile, "돌봄")
      ? "돌봄 공백이 큰 요일부터 가능 여부를 확인하세요."
      : "",
    hasConcern(profile, "방과후")
      ? "방과후는 많이 넣기보다 버틸 수 있는 횟수부터 정하세요."
      : "",
    hasConcern(profile, "적응") || hasConcern(profile, "친구")
      ? "짧은 질문으로 아이 반응만 먼저 살펴보세요."
      : ""
  ];

  const traitActions = [
    hasTrait(profile, "낯가림")
      ? "귀가 장소와 시간을 자주 바꾸지 마세요."
      : "",
    hasTrait(profile, "규칙")
      ? "준비물 위치와 저녁 루틴을 같은 순서로 두세요."
      : "",
    hasTrait(profile, "피로")
      ? "활동 수보다 회복 시간을 먼저 확보하세요."
      : ""
  ];

  const cautions = unique([
    profile.guardianWorkType === "맞벌이" || profile.guardianWorkType === "교대근무"
      ? "모집 일정은 학교 공지로 다시 확인하세요."
      : "",
    hasTrait(profile, "낯가림")
      ? "등하교 방식은 자주 바꾸지 않는 편이 좋습니다."
      : "",
    hasConcern(profile, "방과후")
      ? "좋아 보여도 활동을 한 번에 늘리진 마세요."
      : "",
    ...heroSummary.cautions
  ]).slice(0, 2);

  const topActions = unique([
    ...phaseActionMap[profile.currentPhase],
    ...concernActions,
    ...traitActions,
    ...heroSummary.topActions
  ]).slice(0, 3);

  return {
    userSummary: `${profile.currentPhase} 단계의 ${profile.guardianWorkType} 가정입니다. 지금은 "${profile.mainConcern}"보다 동선과 신청 일정부터 먼저 잡는 편이 좋습니다.`,
    topActions,
    cautions
  };
}

export function buildCommunitySummary(
  request?: CommunitySummaryRequest
): CommunitySummaryResponse {
  const profile = mergeUserProfile(request?.profile);
  const filters = request?.filters;
  const selectedRecommendations =
    request?.recommendationIds && request.recommendationIds.length > 0
      ? recommendations.filter((recommendation) =>
          request.recommendationIds?.includes(recommendation.id)
        )
      : recommendations.slice(0, 3);

  const matchedTips = communityTips.filter((tip) => {
    const phaseMatch = tip.phases.includes(profile.currentPhase);
    const parentMatch =
      !filters?.parentType ||
      filters.parentType === "전체" ||
      tip.parentTypes.includes(filters.parentType);
    const traitMatch =
      !filters?.childTrait ||
      filters.childTrait === "전체" ||
      tip.childTraits.includes(filters.childTrait);
    const weekdayMatch =
      !filters?.weekdayNeed ||
      filters.weekdayNeed === "전체" ||
      tip.weekdayNeeds.includes(filters.weekdayNeed);

    return phaseMatch && parentMatch && traitMatch && weekdayMatch;
  });

  const leadRecommendation = selectedRecommendations[0] ?? recommendations[0];
  const leadTip = matchedTips[0] ?? communityTips[0];
  const weekdayNeed =
    filters?.weekdayNeed && filters.weekdayNeed !== "전체"
      ? filters.weekdayNeed
      : "주중 전반";

  return {
    theme: leadTip.theme,
    summary: `${profile.currentPhase} 단계의 ${profile.guardianWorkType} 가정이라면 ${leadRecommendation.title} 조합이 가장 현실적입니다.`,
    reasons: unique([
      ...selectedRecommendations.flatMap((recommendation) => recommendation.fitReasons),
      "첫 100일엔 흔들리지 않는 선택이 더 중요합니다.",
      `${profile.childTraits[0] ?? "자녀 특성"}을 보면 동선이 단순한 조합이 잘 맞습니다.`
    ]).slice(0, 3),
    cautions: unique([
      ...selectedRecommendations.flatMap((recommendation) => recommendation.needsCheck),
      ...matchedTips.flatMap((tip) => tip.cautions)
    ]).slice(0, 2),
    parentTipSummary: unique(matchedTips.map((tip) => tip.summary).concat(leadTip.summary))
      .slice(0, 1)
      .join(" "),
    keywords: unique([
      ...matchedTips.flatMap((tip) => tip.keywords),
      leadRecommendation.tag
    ]).slice(0, 3)
  };
}
