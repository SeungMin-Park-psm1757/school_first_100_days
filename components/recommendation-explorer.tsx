"use client";

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";

import { SourceBadge } from "@/components/data-badges";
import { RevealBlock } from "@/components/reveal-block";
import type {
  CommunitySummaryResponse,
  Recommendation,
  UserProfile,
  WorkType
} from "@/lib/types";

type RecommendationExplorerProps = {
  childTraitOptions: string[];
  initialPanel: CommunitySummaryResponse;
  recommendations: Recommendation[];
  timeNeededOptions: string[];
  userProfile: UserProfile;
  weekdayNeedOptions: string[];
  workTypeOptions: WorkType[];
};

type ParentFilter = WorkType | "전체";

type Filters = {
  childTrait: string;
  parentType: ParentFilter;
  timeNeeded: string;
  weekdayNeed: string;
};

export function RecommendationExplorer({
  childTraitOptions,
  initialPanel,
  recommendations,
  timeNeededOptions,
  userProfile,
  weekdayNeedOptions,
  workTypeOptions
}: RecommendationExplorerProps) {
  const [filters, setFilters] = useState<Filters>({
    weekdayNeed: "전체",
    timeNeeded: "전체",
    parentType: userProfile.guardianWorkType,
    childTrait: userProfile.childTraits[0] ?? "전체"
  });
  const [panel, setPanel] = useState<CommunitySummaryResponse>(initialPanel);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  const deferredWeekdayNeed = useDeferredValue(filters.weekdayNeed);
  const deferredTimeNeeded = useDeferredValue(filters.timeNeeded);
  const deferredParentType = useDeferredValue(filters.parentType);
  const deferredChildTrait = useDeferredValue(filters.childTrait);

  const strictMatches = useMemo(
    () =>
      recommendations.filter((recommendation) => {
        const weekdayMatch =
          deferredWeekdayNeed === "전체" ||
          recommendation.weekdayNeeds.includes(deferredWeekdayNeed);
        const timeMatch =
          deferredTimeNeeded === "전체" || recommendation.timeNeeded === deferredTimeNeeded;
        const parentMatch =
          deferredParentType === "전체" ||
          recommendation.parentTypes.includes(deferredParentType);
        const traitMatch =
          deferredChildTrait === "전체" ||
          recommendation.childTraits.includes(deferredChildTrait);

        return weekdayMatch && timeMatch && parentMatch && traitMatch;
      }),
    [
      deferredChildTrait,
      deferredParentType,
      deferredTimeNeeded,
      deferredWeekdayNeed,
      recommendations
    ]
  );

  const visibleRecommendations = useMemo(() => {
    if (strictMatches.length > 0) {
      return strictMatches.slice(0, 3);
    }

    return recommendations
      .filter((recommendation) =>
        recommendation.parentTypes.includes(
          deferredParentType === "전체"
            ? userProfile.guardianWorkType
            : deferredParentType
        )
      )
      .slice(0, 3);
  }, [deferredParentType, recommendations, strictMatches, userProfile.guardianWorkType]);

  const isFallback = strictMatches.length === 0;
  const visibleIds = visibleRecommendations.map((recommendation) => recommendation.id).join("|");

  useEffect(() => {
    let cancelled = false;

    async function syncPanel() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate-community-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            filters: {
              weekdayNeed: deferredWeekdayNeed,
              timeNeeded: deferredTimeNeeded,
              parentType: deferredParentType,
              childTrait: deferredChildTrait
            },
            profile: userProfile,
            recommendationIds: visibleRecommendations.map((recommendation) => recommendation.id)
          })
        });

        if (!response.ok) {
          throw new Error("요약 생성 실패");
        }

        const data = (await response.json()) as CommunitySummaryResponse;

        if (!cancelled) {
          startTransition(() => {
            setPanel(data);
          });
        }
      } catch {
        if (!cancelled) {
          setError(
            "부모 경험 요약을 업데이트하지 못했어요. 추천 카드는 그대로 확인할 수 있습니다."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void syncPanel();

    return () => {
      cancelled = true;
    };
  }, [
    deferredChildTrait,
    deferredParentType,
    deferredTimeNeeded,
    deferredWeekdayNeed,
    startTransition,
    userProfile,
    visibleIds,
    visibleRecommendations
  ]);

  return (
    <section className="space-y-6">
      <RevealBlock>
        <div className="surface-card-strong hero-glow overflow-hidden p-6 sm:p-7 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="section-label">Recommendation Explorer</p>
            <h1 className="mt-3 panel-title">돌봄·방과후 추천 결과</h1>
            <p className="mt-3 panel-copy">
              우리 가정 상황에 맞는 선택지를 비교해보세요. 좋은 선택을 많이 보여주는 것이
              아니라 지금 우리 집이 실제로 선택할 수 있는 조합을 먼저 보여주는 화면입니다.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2.5 text-sm font-medium text-slate-700">
                <span>주중 필요</span>
                <select
                  className="field-shell"
                  value={filters.weekdayNeed}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      weekdayNeed: event.target.value
                    }))
                  }
                >
                  {weekdayNeedOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2.5 text-sm font-medium text-slate-700">
                <span>시간 투입</span>
                <select
                  className="field-shell"
                  value={filters.timeNeeded}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      timeNeeded: event.target.value
                    }))
                  }
                >
                  {timeNeededOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2.5 text-sm font-medium text-slate-700">
                <span>보호자 유형</span>
                <select
                  className="field-shell"
                  value={filters.parentType}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      parentType: event.target.value as ParentFilter
                    }))
                  }
                >
                  <option value="전체">전체</option>
                  {workTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2.5 text-sm font-medium text-slate-700">
                <span>자녀 특성</span>
                <select
                  className="field-shell"
                  value={filters.childTrait}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      childTrait: event.target.value
                    }))
                  }
                >
                  <option value="전체">전체</option>
                  {childTraitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(47,111,228,0.12),rgba(255,255,255,0.96))] p-5 shadow-[0_24px_70px_-40px_rgba(47,111,228,0.45)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Product Framing
            </p>
            <h2 className="mt-3 font-heading text-[1.9rem] font-extrabold tracking-tight text-slate-950">
              비교는 쉽게,
              <br />
              선택은 더 현실적으로
            </h2>
            <div className="subtle-divider my-5" />
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  기준
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                  주중 공백, 보호자 유형, 자녀 특성, 실행 시간
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  추천 수
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                  넓게 퍼뜨리지 않고 2~3개의 현실적인 조합만 먼저 제안합니다.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  확인 포인트
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                  좋은 카드보다 먼저 체크해야 할 위험요소를 같이 보여줍니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </RevealBlock>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          {isFallback ? (
            <RevealBlock delay={40}>
              <div className="surface-card p-5 text-sm leading-7 text-[color:var(--text-soft)]">
                정확히 일치하는 카드가 없어 가장 가까운 조합을 먼저 보여드리고 있습니다.
              </div>
            </RevealBlock>
          ) : null}

          {visibleRecommendations.map((recommendation, index) => (
            <RevealBlock key={recommendation.id} delay={80 + index * 50}>
              <article className="surface-card-strong hover-lift overflow-hidden border-white/80 p-5 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="pill-badge bg-slate-100 text-slate-500">
                        Option {index + 1}
                      </span>
                      <SourceBadge source={recommendation.sourceType} />
                      <span className="pill-badge bg-white text-slate-600 ring-1 ring-slate-200">
                        {recommendation.tag}
                      </span>
                    </div>

                    <h2 className="mt-4 font-heading text-[1.75rem] font-extrabold tracking-tight text-slate-950">
                      {recommendation.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)] sm:text-base">
                      {recommendation.description}
                    </p>
                  </div>

                  <div className="rounded-[26px] bg-[linear-gradient(135deg,rgba(47,111,228,0.1),rgba(255,255,255,0.95))] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      빠른 비교
                    </p>
                    <p className="mt-3 text-sm font-semibold text-slate-950">
                      {recommendation.timeNeeded}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                      {recommendation.weekdayNeeds.join(" · ")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] bg-slate-50/92 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      추천 이유
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {recommendation.fitReasons.map((reason) => (
                        <li key={reason} className="flex gap-3">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <p className="text-sm leading-6 text-[color:var(--text-soft)]">
                            {reason}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[24px] bg-community/78 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#996226]">
                      확인 필요
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {recommendation.needsCheck.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#d58c2f]" />
                          <p className="text-sm leading-6 text-[color:var(--text-soft)]">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    다음 체크
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                    {recommendation.nextStep}
                  </p>
                </div>
              </article>
            </RevealBlock>
          ))}
        </div>

        <aside className="xl:sticky xl:top-4 xl:self-start">
          <RevealBlock delay={140}>
            <div className="surface-card-strong p-6 sm:p-7">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="section-label">AI Panel</p>
                <h2 className="mt-3 font-heading text-[1.85rem] font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-[2rem]">
                  선택 이유 요약
                </h2>
              </div>
              <span className="pill-badge bg-slate-100 text-slate-500">
                {isLoading ? "업데이트 중" : "최신 상태"}
              </span>
            </div>

            <div className="mt-6 rounded-[30px] bg-[linear-gradient(135deg,rgba(47,111,228,0.14),rgba(141,184,255,0.14),rgba(255,255,255,0.96))] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                상황 요약
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                {panel.summary}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <section className="rounded-[28px] border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  추천 이유 3가지
                </p>
                <ul className="mt-4 space-y-3">
                  {panel.reasons.map((reason) => (
                    <li key={reason} className="flex gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                      <p className="text-sm leading-6 text-[color:var(--text-soft)]">{reason}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[28px] border border-amber-200 bg-community/78 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#996226]">
                  놓치기 쉬운 점
                </p>
                <ul className="mt-4 space-y-3">
                  {panel.cautions.map((caution) => (
                    <li key={caution} className="flex gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d58c2f]" />
                      <p className="text-sm leading-6 text-[color:var(--text-soft)]">{caution}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-slate-50/92 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  부모 팁 요약
                </p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                  {panel.parentTipSummary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {panel.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="pill-badge bg-white text-slate-500 ring-1 ring-slate-200"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {error ? (
              <p className="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {error}
              </p>
            ) : null}
            </div>
          </RevealBlock>
        </aside>
      </div>
    </section>
  );
}
