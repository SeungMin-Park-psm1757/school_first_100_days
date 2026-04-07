"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { RevealBlock } from "@/components/reveal-block";
import type {
  DemoScenario,
  GeneratedPlanResponse,
  Phase,
  UserProfile,
  WorkType
} from "@/lib/types";

type HomePlannerProps = {
  concernOptions: string[];
  demoScenarios: DemoScenario[];
  headline: string;
  initialPlan: GeneratedPlanResponse;
  initialProfile: UserProfile;
  phaseOptions: Phase[];
  regionOptions: string[];
  traitOptions: string[];
  workTypeOptions: WorkType[];
};

export function HomePlanner({
  concernOptions,
  demoScenarios,
  headline,
  initialPlan,
  initialProfile,
  phaseOptions,
  regionOptions,
  traitOptions,
  workTypeOptions
}: HomePlannerProps) {
  const [form, setForm] = useState<UserProfile>(initialProfile);
  const [plan, setPlan] = useState<GeneratedPlanResponse>(initialPlan);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(demoScenarios[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("플랜 생성 실패");
      }

      const data = (await response.json()) as GeneratedPlanResponse;

      startTransition(() => {
        setPlan(data);
      });
    } catch {
      setError("플랜을 다시 계산하지 못했어요. 잠시 후 한 번 더 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleTrait(trait: string) {
    setActiveScenarioId("");
    setForm((current) => {
      const nextTraits = current.childTraits.includes(trait)
        ? current.childTraits.filter((item) => item !== trait)
        : [...current.childTraits, trait];

      return {
        ...current,
        childTraits: nextTraits
      };
    });
  }

  function applyScenario(scenario: DemoScenario) {
    setActiveScenarioId(scenario.id);
    setForm(scenario.profile);
    setPlan(scenario.plan);
    setError(null);
  }

  function resetDemoData() {
    setForm(initialProfile);
    setPlan(initialPlan);
    setActiveScenarioId(demoScenarios[0]?.id ?? "");
    setError(null);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_444px]">
      <div className="space-y-6">
        <RevealBlock>
          <div className="surface-card-strong hero-glow relative overflow-hidden p-6 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(141,184,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0),rgba(47,111,228,0.04),rgba(255,255,255,0))]" />

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_292px]">
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <span className="section-label">판단 지원</span>
                  <span className="pill-badge bg-white text-slate-600 ring-1 ring-slate-200/70">
                    입학 100일 전용
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="font-heading text-[2.4rem] font-extrabold tracking-tight text-slate-950 sm:text-[3.4rem]">
                    우리 집 첫 100일
                    <br />
                    지금 할 일
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-[color:var(--text-soft)] sm:text-[1.05rem]">
                    {headline} 이번 주 행동, 주의점, 다음 선택만 바로 봅니다.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="metric-card bg-[linear-gradient(135deg,rgba(47,111,228,0.12),rgba(255,255,255,0.92))]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      할 일
                    </p>
                    <p className="mt-3 font-heading text-3xl font-extrabold text-slate-950">3</p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                      이번 주 3개
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      주의
                    </p>
                    <p className="mt-3 font-heading text-3xl font-extrabold text-slate-950">2</p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                      핵심 2개
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      단계
                    </p>
                    <p className="mt-3 font-heading text-3xl font-extrabold text-slate-950">
                      D+{form.dayCount}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                      현재 위치
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/90 bg-[linear-gradient(180deg,rgba(47,111,228,0.1),rgba(255,255,255,0.95))] p-5 shadow-[0_26px_70px_-42px_rgba(47,111,228,0.48)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  오늘 한눈에
                </p>
                <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-slate-950">
                  입력은 짧게
                  <br />
                  결과는 바로
                </h2>
                <div className="subtle-divider my-5" />
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      입력
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                      학교·지역·자녀 특성
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      결과
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                      행동 3개, 주의 2개
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      다음
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                      타임라인·추천 연결
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>

        <RevealBlock delay={40}>
          <div className="surface-card p-6 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">데모 시나리오</p>
                <h2 className="mt-3 panel-title">클릭 한 번으로 전환</h2>
                <p className="mt-2 panel-copy">상황별 흐름을 바로 시연합니다.</p>
              </div>
              <span className="pill-badge bg-slate-100 text-slate-600">3종</span>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {demoScenarios.map((scenario) => {
                const active = activeScenarioId === scenario.id;

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => applyScenario(scenario)}
                    className={`text-left rounded-[26px] border p-5 transition ${
                      active
                        ? "border-primary bg-[linear-gradient(135deg,rgba(47,111,228,0.12),rgba(255,255,255,0.96))] shadow-[0_24px_60px_-34px_rgba(47,111,228,0.45)]"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="pill-badge bg-slate-100 text-slate-600">
                        {scenario.label}
                      </span>
                      {active ? (
                        <span className="pill-badge bg-primary text-white">적용됨</span>
                      ) : null}
                    </div>
                    <p className="mt-4 text-base font-semibold text-slate-950">{scenario.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                      {scenario.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </RevealBlock>

        <RevealBlock delay={80}>
          <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="section-label">우리 집 상황 입력</p>
                <h2 className="mt-3 panel-title">100일 플랜</h2>
                <p className="mt-2 panel-copy">핵심 정보만 입력합니다.</p>
              </div>

              <button
                type="button"
                onClick={resetDemoData}
                className="pill-badge justify-center border border-slate-200 bg-white text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                기본값 불러오기
              </button>
            </div>

            <div className="mt-7 grid gap-6">
              <section className="soft-panel">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    기본 정보
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2.5 text-sm font-medium text-slate-700">
                    <span>학교명</span>
                    <input
                      className="field-shell"
                      value={form.schoolName}
                      onChange={(event) => {
                        setActiveScenarioId("");
                        setForm((current) => ({
                          ...current,
                          schoolName: event.target.value
                        }));
                      }}
                      placeholder="예: 서울가람초등학교"
                      required
                    />
                  </label>

                  <label className="space-y-2.5 text-sm font-medium text-slate-700">
                    <span>지역</span>
                    <input
                      list="region-options"
                      className="field-shell"
                      value={form.region}
                      onChange={(event) => {
                        setActiveScenarioId("");
                        setForm((current) => ({
                          ...current,
                          region: event.target.value
                        }));
                      }}
                      placeholder="예: 서울 성동구"
                      required
                    />
                    <datalist id="region-options">
                      {regionOptions.map((region) => (
                        <option key={region} value={region} />
                      ))}
                    </datalist>
                  </label>

                  <label className="space-y-2.5 text-sm font-medium text-slate-700">
                    <span>보호자 근무 형태</span>
                    <select
                      className="field-shell"
                      value={form.guardianWorkType}
                      onChange={(event) => {
                        setActiveScenarioId("");
                        setForm((current) => ({
                          ...current,
                          guardianWorkType: event.target.value as WorkType
                        }));
                      }}
                    >
                      {workTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2.5 text-sm font-medium text-slate-700">
                    <span>현재 단계</span>
                    <select
                      className="field-shell"
                      value={form.currentPhase}
                      onChange={(event) => {
                        setActiveScenarioId("");
                        setForm((current) => ({
                          ...current,
                          currentPhase: event.target.value as Phase
                        }));
                      }}
                    >
                      {phaseOptions.map((phase) => (
                        <option key={phase} value={phase}>
                          {phase}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="soft-panel">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    자녀 특성
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--text-soft)]">
                    해당되는 특성만 고르세요.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {traitOptions.map((trait) => {
                    const selected = form.childTraits.includes(trait);

                    return (
                      <button
                        key={trait}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleTrait(trait)}
                        className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                          selected
                            ? "border-primary bg-primary text-white shadow-[0_14px_34px_-22px_rgba(47,111,228,0.95)]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {trait}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="soft-panel">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    현재 가장 큰 고민
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--text-soft)]">
                    짧을수록 추천이 선명해집니다.
                  </p>
                </div>
                <label className="block space-y-2.5 text-sm font-medium text-slate-700">
                  <textarea
                    className="field-shell min-h-[132px] resize-none"
                    value={form.mainConcern}
                    onChange={(event) => {
                      setActiveScenarioId("");
                      setForm((current) => ({
                        ...current,
                        mainConcern: event.target.value
                      }));
                    }}
                    placeholder="예: 하교 후 돌봄 공백이 걱정돼요"
                    required
                  />
                </label>
                <div className="mt-4 flex flex-wrap gap-2">
                  {concernOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setActiveScenarioId("");
                        setForm((current) => ({
                          ...current,
                          mainConcern: option
                        }));
                      }}
                      className="pill-badge bg-white text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-800"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {error ? (
              <p className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {error}
              </p>
            ) : null}

            <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <button
                  type="submit"
                  disabled={isLoading || isPending}
                  className="inline-flex items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#2f6fe4,#4d86ee)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_50px_-24px_rgba(47,111,228,0.82)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading || isPending ? "플랜 계산 중..." : "100일 플랜 만들기"}
                </button>
                <p className="mt-3 text-sm text-[color:var(--text-muted)]">
                  오른쪽 카드에 바로 반영됩니다.
                </p>
              </div>

              <div className="rounded-[24px] bg-slate-50 px-4 py-3 text-sm text-[color:var(--text-soft)]">
                지금 단계: <span className="font-semibold text-slate-950">{form.currentPhase}</span>
              </div>
            </div>
          </form>
        </RevealBlock>
      </div>

      <aside className="xl:sticky xl:top-4 xl:self-start">
        <RevealBlock delay={140}>
          <div className="surface-card-strong overflow-hidden p-6 sm:p-7">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="section-label">AI 요약</p>
                <h2 className="mt-3 font-heading text-[1.85rem] font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-[2rem]">
                  지금 할 일
                </h2>
              </div>
              <span className="pill-badge bg-slate-100 text-slate-600">바로 실행</span>
            </div>

            <div className="mt-6 rounded-[30px] bg-[linear-gradient(135deg,rgba(47,111,228,0.14),rgba(141,184,255,0.14),rgba(255,255,255,0.96))] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                상황
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                {plan.userSummary}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5">
                <div className="flex flex-wrap items-start gap-3">
                  <h3 className="min-w-0 flex-1 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    이번 주 3가지
                  </h3>
                  <span className="pill-badge bg-official text-primary">공식 정보 기준</span>
                </div>
                <ol className="mt-5 space-y-4">
                  {plan.topActions.map((action, index) => (
                    <li key={action} className="flex gap-3.5">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-[0_14px_28px_-18px_rgba(47,111,228,0.9)]">
                        {index + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-6 text-[color:var(--text-soft)]">
                        {action}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-[28px] border border-amber-200 bg-community/78 p-5">
                <div className="flex flex-wrap items-start gap-3">
                  <h3 className="min-w-0 flex-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#9a6322]">
                    주의 2가지
                  </h3>
                  <span className="pill-badge bg-white text-[#9a6322]">부모 경험 참고</span>
                </div>
                <ul className="mt-5 space-y-4">
                  {plan.cautions.map((caution) => (
                    <li key={caution} className="flex gap-3.5">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d58c2f]" />
                      <p className="text-sm leading-6 text-[color:var(--text-soft)]">{caution}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                href="/timeline"
                className="hover-lift rounded-[24px] border border-slate-200 bg-white px-5 py-4"
              >
                <p className="text-sm font-semibold text-slate-950">타임라인으로 이어보기</p>
                <p className="mt-1.5 text-sm text-[color:var(--text-soft)]">
                  현재 단계 체크 순서를 봅니다.
                </p>
              </Link>
              <Link
                href="/recommendations"
                className="hover-lift rounded-[24px] border border-slate-200 bg-white px-5 py-4"
              >
                <p className="text-sm font-semibold text-slate-950">추천 조합 비교하기</p>
                <p className="mt-1.5 text-sm text-[color:var(--text-soft)]">
                  우리 집에 맞는 조합을 비교합니다.
                </p>
              </Link>
            </div>
          </div>
        </RevealBlock>
      </aside>
    </section>
  );
}
