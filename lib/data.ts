import communityTipsData from "@/data/communityTips.json";
import heroSummaryData from "@/data/heroSummary.json";
import recommendationsData from "@/data/recommendations.json";
import timelineData from "@/data/timeline.json";
import userProfileData from "@/data/userProfile.json";
import type {
  CommunityTip,
  HeroSummary,
  Phase,
  Recommendation,
  TimelineTask,
  UserProfile,
  WorkType
} from "@/lib/types";

export const phaseOrder: Phase[] = [
  "입학 준비",
  "첫 2주",
  "1개월 적응",
  "돌봄 재조정",
  "100일 회고"
];

export const workTypeOptions: WorkType[] = [
  "맞벌이",
  "외벌이",
  "교대근무",
  "재택근무 중심",
  "기타"
];

export const regionOptions = [
  "서울 노원구",
  "서울 성동구",
  "서울 송파구",
  "서울 마포구",
  "경기 성남시",
  "경기 수원시",
  "부산 해운대구"
];

export const concernOptions = [
  "하교 후 돌봄 공백이 걱정돼요",
  "방과후 선택이 어려워요",
  "알림장과 준비물 누락이 걱정돼요",
  "친구 관계와 적응이 걱정돼요",
  "생활 루틴을 안정시키고 싶어요"
];

export const userProfile = userProfileData as UserProfile;
export const heroSummary = heroSummaryData as HeroSummary;
export const timelineTasks = timelineData as TimelineTask[];
export const recommendations = recommendationsData as Recommendation[];
export const communityTips = communityTipsData as CommunityTip[];

export const childTraitOptions = Array.from(
  new Set([
    ...userProfile.childTraits,
    ...recommendations.flatMap((recommendation) => recommendation.childTraits),
    ...communityTips.flatMap((tip) => tip.childTraits)
  ])
);

export const weekdayNeedOptions = [
  "전체",
  ...Array.from(
    new Set(recommendations.flatMap((recommendation) => recommendation.weekdayNeeds))
  )
];

export const timeNeededOptions = [
  "전체",
  ...Array.from(
    new Set(recommendations.map((recommendation) => recommendation.timeNeeded))
  )
];

export function mergeUserProfile(partial?: Partial<UserProfile>): UserProfile {
  return {
    ...userProfile,
    ...partial,
    childTraits: Array.isArray(partial?.childTraits)
      ? partial.childTraits
      : userProfile.childTraits,
    dayCount:
      typeof partial?.dayCount === "number" ? partial.dayCount : userProfile.dayCount
  };
}
