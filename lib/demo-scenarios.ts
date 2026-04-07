import { buildPlan } from "@/lib/mock-ai";
import type { DemoScenario } from "@/lib/types";

const scenarios: Array<Omit<DemoScenario, "plan">> = [
  {
    id: "dual-income-care-gap",
    label: "시나리오 A",
    title: "맞벌이 + 하교 후 돌봄 공백",
    summary: "가장 기본적인 심사 데모 흐름입니다. 하교 직후 공백과 학교 적응을 함께 보여줍니다.",
    profile: {
      schoolName: "서울가람초등학교",
      region: "서울 성동구",
      guardianWorkType: "맞벌이",
      childTraits: ["낯가림이 심한 편", "규칙이 정해지면 안정적임"],
      mainConcern: "하교 후 돌봄 공백이 걱정돼요",
      currentPhase: "첫 2주",
      dayCount: 5
    }
  },
  {
    id: "routine-first-home",
    label: "시나리오 B",
    title: "재택 중심 + 생활 루틴 정착",
    summary: "방과후를 무조건 늘리기보다 생활 리듬과 피로도를 먼저 보는 케이스를 보여줍니다.",
    profile: {
      schoolName: "성남푸른초등학교",
      region: "경기 성남시",
      guardianWorkType: "재택근무 중심",
      childTraits: ["피로 누적이 빠른 편", "규칙이 정해지면 안정적임"],
      mainConcern: "방과후를 얼마나 넣어야 할지 고민돼요",
      currentPhase: "1개월 적응",
      dayCount: 28
    }
  },
  {
    id: "shift-work-flex",
    label: "시나리오 C",
    title: "교대근무 + 비상 동선 준비",
    summary: "가족 일정이 일정하지 않은 상황에서 공백 대응과 대체 귀가 동선을 강조하는 데모입니다.",
    profile: {
      schoolName: "부산해오름초등학교",
      region: "부산 해운대구",
      guardianWorkType: "교대근무",
      childTraits: ["처음엔 표현이 적은 편", "낯가림이 심한 편"],
      mainConcern: "보호자 일정이 자주 바뀌어 하교 동선이 불안해요",
      currentPhase: "돌봄 재조정",
      dayCount: 47
    }
  }
];

export const demoScenarios: DemoScenario[] = scenarios.map((scenario) => ({
  ...scenario,
  plan: buildPlan(scenario.profile)
}));
