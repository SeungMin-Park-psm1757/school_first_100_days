import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl py-12 sm:py-20">
      <div className="surface-card-strong p-8 sm:p-10">
        <p className="section-label">404</p>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          찾으시는 화면이 없습니다
        </h1>
        <p className="mt-4 text-base leading-8 text-[color:var(--text-soft)]">
          링크가 바뀌었거나 잘못된 주소일 수 있습니다. 홈으로 돌아가면 첫 100일 플랜,
          타임라인, 추천 결과를 다시 확인할 수 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#2f6fe4,#4d86ee)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_-24px_rgba(47,111,228,0.82)]"
          >
            홈으로 가기
          </Link>
          <Link
            href="/timeline"
            className="pill-badge border border-slate-200 bg-white text-slate-700"
          >
            타임라인 보기
          </Link>
          <Link
            href="/recommendations"
            className="pill-badge border border-slate-200 bg-white text-slate-700"
          >
            추천 결과 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
