export type WorkType =
  | "맞벌이"
  | "외벌이"
  | "교대근무"
  | "재택근무 중심"
  | "기타";

export type Phase =
  | "입학 준비"
  | "첫 2주"
  | "1개월 적응"
  | "돌봄 재조정"
  | "100일 회고";

export type DataSource = "official" | "community" | "both";

export type PriorityLevel = "high" | "medium" | "low";

export type UserProfile = {
  schoolName: string;
  region: string;
  guardianWorkType: WorkType;
  childTraits: string[];
  mainConcern: string;
  currentPhase: Phase;
  dayCount: number;
};

export type HeroSummary = {
  headline: string;
  topActions: string[];
  cautions: string[];
};

export type TimelineTask = {
  id: number;
  phase: Phase;
  title: string;
  priority: PriorityLevel;
  description: string;
  sourceType: DataSource;
  sourceLabel: string;
  communityTip?: string;
  status: "done" | "todo" | "locked";
};

export type Recommendation = {
  id: string;
  title: string;
  tag: string;
  description: string;
  fitReasons: string[];
  needsCheck: string[];
  weekdayNeeds: string[];
  timeNeeded: string;
  parentTypes: WorkType[];
  childTraits: string[];
  sourceType: DataSource;
  nextStep: string;
};

export type CommunityTip = {
  id: string;
  theme: string;
  summary: string;
  keywords: string[];
  parentTypes: WorkType[];
  childTraits: string[];
  weekdayNeeds: string[];
  phases: Phase[];
  cautions: string[];
};

export type GeneratedPlanResponse = {
  userSummary: string;
  topActions: string[];
  cautions: string[];
};

export type CommunitySummaryResponse = {
  theme: string;
  summary: string;
  reasons: string[];
  cautions: string[];
  parentTipSummary: string;
  keywords: string[];
};

export type CommunitySummaryRequest = {
  profile?: Partial<UserProfile>;
  recommendationIds?: string[];
  filters?: {
    weekdayNeed?: string;
    timeNeeded?: string;
    parentType?: WorkType | "전체";
    childTrait?: string;
  };
};

export type DemoScenario = {
  id: string;
  label: string;
  title: string;
  summary: string;
  profile: UserProfile;
  plan: GeneratedPlanResponse;
};
