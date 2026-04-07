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
    "학교 앱과 가정통신문 채널을 먼저 하나로 묶어 보세요.",
    "등하교 방식과 준비물 보관 자리를 가족끼리 같은 말로 정리하세요."
  ],
  "첫 2주": [
    "첫 2주 하교 동선을 가능한 한 고정하세요.",
    "방과후와 돌봄 신청 일정을 이번 주 안에 다시 확인하세요."
  ],
  "1개월 적응": [
    "아이의 피로도와 귀가 후 반응을 5일만 짧게 기록해 보세요.",
    "공백이 생기는 요일만 먼저 표시해도 조합 선택이 쉬워집니다."
  ],
  "돌봄 재조정": [
    "대체 귀가 동선을 최소 2안까지 준비해 두세요.",
    "신청 일정과 귀가 시간표를 가족 캘린더 한 곳에 모아두세요."
  ],
  "100일 회고": [
    "지속된 루틴과 힘들었던 루틴을 나눠 적어 2학기 기준을 만들어 두세요.",
    "다음 학기에도 유지할 신청 일정과 체크포인트를 저장해 두세요."
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
      ? "돌봄 공백이 큰 요일부터 운영 시간과 실제 신청 가능 여부를 확인하세요."
      : "",
    hasConcern(profile, "방과후")
      ? "방과후는 많이 넣기보다 첫 달에 버틸 수 있는 횟수부터 정하세요."
      : "",
    hasConcern(profile, "적응") || hasConcern(profile, "친구")
      ? "하교 후 한 번에 묻기보다 짧은 질문으로 아이 반응을 살펴보세요."
      : ""
  ];

  const traitActions = [
    hasTrait(profile, "낯가림")
      ? "낯선 변화가 적도록 귀가 장소와 시간을 자주 바꾸지 마세요."
      : "",
    hasTrait(profile, "규칙")
      ? "준비물 위치와 저녁 루틴을 매일 같은 순서로 반복해 보세요."
      : "",
    hasTrait(profile, "피로")
      ? "활동 수를 늘리기 전 귀가 후 회복 시간을 먼저 확보하세요."
      : ""
  ];

  const cautions = unique([
    profile.guardianWorkType === "맞벌이" || profile.guardianWorkType === "교대근무"
      ? "공개 운영 정보와 실제 모집 일정이 다를 수 있어 학교 공지를 최종 확인해야 합니다."
      : "",
    hasTrait(profile, "낯가림")
      ? "등하교 방식이 자주 바뀌면 아이의 긴장이 커질 수 있습니다."
      : "",
    hasConcern(profile, "방과후")
      ? "좋아 보이는 활동을 한 번에 늘리면 오히려 적응 속도가 늦어질 수 있습니다."
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
    userSummary: `${profile.region} ${profile.schoolName} 기준으로 ${profile.currentPhase} 단계에 있는 ${profile.guardianWorkType} 가정입니다. 현재 고민은 "${profile.mainConcern}"이며, 이번 주에는 정보 탐색보다 하교·돌봄 루틴을 먼저 고정하는 편이 더 중요합니다.`,
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
    summary: `${profile.guardianWorkType} 가정에서 ${weekdayNeed} 대응이 필요하고 ${profile.currentPhase} 단계에 있다면, ${leadRecommendation.title}처럼 ${leadRecommendation.description.replace("입니다.", "")} 흐름이 가장 현실적입니다.`,
    reasons: unique([
      ...selectedRecommendations.flatMap((recommendation) => recommendation.fitReasons),
      "첫 100일에는 좋은 선택보다 흔들리지 않는 선택이 더 오래갑니다.",
      `${profile.childTraits[0] ?? "현재 자녀 특성"}을 고려하면 동선이 단순한 조합이 유리합니다.`
    ]).slice(0, 3),
    cautions: unique([
      ...selectedRecommendations.flatMap((recommendation) => recommendation.needsCheck),
      ...matchedTips.flatMap((tip) => tip.cautions)
    ]).slice(0, 2),
    parentTipSummary: unique(
      matchedTips.map((tip) => tip.summary).concat(leadTip.summary)
    )
      .slice(0, 2)
      .join(" "),
    keywords: unique([
      ...matchedTips.flatMap((tip) => tip.keywords),
      leadRecommendation.tag
    ]).slice(0, 4)
  };
}
