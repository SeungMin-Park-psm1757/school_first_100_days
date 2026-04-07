import type { DataSource, PriorityLevel } from "@/lib/types";

const sourceMeta: Record<
  DataSource,
  { className: string; dotClassName: string; label: string }
> = {
  official: {
    className: "border-sky-200 bg-official text-[#1d5cc6]",
    dotClassName: "bg-[#4d8cf6]",
    label: "공공 데이터"
  },
  community: {
    className: "border-amber-200 bg-community text-[#a0641d]",
    dotClassName: "bg-[#df9b38]",
    label: "부모 경험"
  },
  both: {
    className: "border-indigo-200 bg-both text-[#5856be]",
    dotClassName: "bg-[#7c7cec]",
    label: "혼합 근거"
  }
};

const priorityMeta: Record<
  PriorityLevel,
  { className: string; label: string }
> = {
  high: {
    className: "border-rose-200 bg-rose-50 text-rose-600",
    label: "높음"
  },
  medium: {
    className: "border-amber-200 bg-amber-50 text-amber-600",
    label: "보통"
  },
  low: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-600",
    label: "낮음"
  }
};

export function SourceBadge({ source }: { source: DataSource }) {
  const meta = sourceMeta[source];

  return (
    <span
      className={`pill-badge border ${meta.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClassName}`} />
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  const meta = priorityMeta[priority];

  return (
    <span
      className={`pill-badge border ${meta.className}`}
    >
      우선도 {meta.label}
    </span>
  );
}
