"use client";

import { useMemo, useState } from "react";

import { PriorityBadge, SourceBadge } from "@/components/data-badges";
import { RevealBlock } from "@/components/reveal-block";
import type { DataSource, Phase, TimelineTask, UserProfile } from "@/lib/types";

type TimelineBoardProps = {
  phaseOrder: Phase[];
  profile: UserProfile;
  tasks: TimelineTask[];
};

const statusMeta = {
  done: "완료",
  locked: "예정",
  todo: "이번 주"
} as const;

const priorityOrder: Record<TimelineTask["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2
};

type FilterState = Record<DataSource | "completed", boolean>;

export function TimelineBoard({
  phaseOrder,
  profile,
  tasks
}: TimelineBoardProps) {
  const initialPhase = phaseOrder.includes(profile.currentPhase)
    ? profile.currentPhase
    : phaseOrder[0];

  const [activePhase, setActivePhase] = useState<Phase>(initialPhase);
  const [filters, setFilters] = useState<FilterState>({
    official: true,
    community: true,
    both: true,
    completed: false
  });

  const visibleTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.phase === activePhase)
        .filter((task) => {
          if (task.status === "done" && !filters.completed) {
            return false;
          }

          return filters[task.sourceType];
        }),
    [activePhase, filters, tasks]
  );

  const weeklyPriorities = [...visibleTasks]
    .filter((task) => task.status !== "done")
    .sort((left, right) => priorityOrder[left.priority] - priorityOrder[right.priority])
    .slice(0, 3);

  const completedCount = tasks.filter((task) => task.status === "done").length;
  const currentCount = tasks.filter((task) => task.status === "todo").length;
  const upcomingCount = tasks.filter((task) => task.status === "locked").length;
  const currentPhaseIndex = phaseOrder.indexOf(activePhase) + 1;
  const visibleHighPriorityCount = visibleTasks.filter((task) => task.priority === "high").length;

  function toggleFilter(key: keyof FilterState) {
    setFilters((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <RevealBlock>
          <div className="surface-card-strong overflow-hidden p-6 sm:p-7 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="section-label">100일 진행판</p>
              <h1 className="mt-3 panel-title">우리 아이 첫 100일 타임라인</h1>
              <p className="mt-3 panel-copy">지금 단계 카드만 먼저 보면 됩니다.</p>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#2f6fe4,#8db8ff)]"
                  style={{ width: `${profile.dayCount}%` }}
                />
              </div>

              <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                {phaseOrder.map((phase, index) => {
                  const active = phase === activePhase;

                  return (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => setActivePhase(phase)}
                      className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "border-primary bg-primary text-white shadow-[0_16px_36px_-24px_rgba(47,111,228,0.95)]"
                          : "border-transparent bg-slate-100 text-slate-600 hover:bg-white hover:text-slate-950"
                      }`}
                    >
                      {index + 1}. {phase}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(47,111,228,0.12),rgba(255,255,255,0.96))] p-5 shadow-[0_24px_70px_-40px_rgba(47,111,228,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                현재 단계
              </p>
              <p className="mt-3 font-heading text-[2rem] font-extrabold tracking-tight text-slate-950">
                D+{profile.dayCount} / 100
              </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                  현재 단계는{" "}
                  <span className="font-semibold text-slate-950">{profile.currentPhase}</span>
                  입니다. 먼저 볼 카드만 추렸습니다.
                </p>
              <div className="subtle-divider my-5" />
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-[22px] bg-white/85 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    현재 단계 위치
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-950">
                    {currentPhaseIndex} / {phaseOrder.length}
                  </p>
                </div>
                <div className="rounded-[22px] bg-white/85 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    높은 우선도
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-950">
                    {visibleHighPriorityCount}
                  </p>
                </div>
                <div className="rounded-[22px] bg-white/85 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    이번 단계 카드
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-950">
                    {visibleTasks.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </RevealBlock>

        <div className="grid gap-4">
          {visibleTasks.map((task, index) => (
            <RevealBlock key={task.id} delay={60 + index * 50}>
              <article className="surface-card hover-lift relative overflow-hidden border-white/80 p-5 sm:p-6">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(180deg,#2f6fe4,#8db8ff)]" />
                <div className="pl-2">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                          Step {index + 1}
                        </span>
                        <PriorityBadge priority={task.priority} />
                        <SourceBadge source={task.sourceType} />
                      </div>

                      <div>
                        <h2 className="font-heading text-[1.6rem] font-extrabold tracking-tight text-slate-950">
                          {task.title}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)] sm:text-base">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                        task.status === "done"
                          ? "bg-emerald-50 text-emerald-600"
                          : task.status === "todo"
                            ? "bg-primary/10 text-primary"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {statusMeta[task.status]}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {(task.sourceType === "official" || task.sourceType === "both") && (
                      <div className="rounded-[24px] bg-official p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          공공 기준
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                          {task.sourceLabel}
                        </p>
                      </div>
                    )}

                    {(task.sourceType === "community" || task.sourceType === "both") &&
                    task.communityTip ? (
                      <div className="rounded-[24px] bg-community p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#996226]">
                          부모 팁
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                          {task.communityTip}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            </RevealBlock>
          ))}

          {visibleTasks.length === 0 ? (
            <div className="surface-card p-6 text-sm leading-7 text-[color:var(--text-soft)]">
              맞는 카드가 없습니다. 필터를 바꿔보세요.
            </div>
          ) : null}
        </div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
        <RevealBlock delay={80}>
          <div className="surface-card-strong p-5">
          <p className="section-label">이번 주 우선순위</p>
          <div className="mt-4 space-y-3">
            {weeklyPriorities.length > 0 ? (
              weeklyPriorities.map((task, index) => (
                <div
                  key={task.id}
                  className="rounded-[24px] bg-[linear-gradient(135deg,rgba(47,111,228,0.08),rgba(255,255,255,0.95))] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Priority {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{task.title}</p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-[color:var(--text-soft)]">
                이 단계 우선 작업이 정리되었습니다.
              </p>
            )}
          </div>
          </div>
        </RevealBlock>

        <RevealBlock delay={120}>
          <div className="surface-card p-5">
          <p className="section-label">필터</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["official", "공공 데이터"],
              ["community", "부모 경험"],
              ["both", "혼합 근거"],
              ["completed", "완료 항목"]
            ].map(([key, label]) => {
              const enabled = filters[key as keyof FilterState];

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFilter(key as keyof FilterState)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    enabled
                      ? "bg-primary text-white shadow-[0_16px_34px_-24px_rgba(47,111,228,0.95)]"
                      : "bg-slate-100 text-slate-500 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          </div>
        </RevealBlock>

        <RevealBlock delay={160}>
          <div className="surface-card p-5">
          <p className="section-label">요약</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[24px] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                완료
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">{completedCount}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  진행 중
                </p>
                <p className="mt-2 text-xl font-extrabold text-slate-950">{currentCount}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  이후 예정
                </p>
                <p className="mt-2 text-xl font-extrabold text-slate-950">{upcomingCount}</p>
              </div>
            </div>
          </div>
          </div>
        </RevealBlock>
      </aside>
    </section>
  );
}
