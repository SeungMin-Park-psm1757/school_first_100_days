import type { Metadata } from "next";
import { Manrope, Noto_Sans_KR } from "next/font/google";

import { PrimaryNav } from "@/components/primary-nav";
import { createAbsoluteUrl, getSiteUrl, siteConfig } from "@/lib/site";

import "./globals.css";

const headingFont = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"]
});

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.shortName,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: createAbsoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} 대표 이미지`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [createAbsoluteUrl("/twitter-image")]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} bg-background font-sans text-foreground antialiased`}
      >
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 pb-12 pt-4 sm:px-6 sm:pb-16 lg:px-8">
          <header className="mb-7">
            <div className="surface-card-strong relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(141,184,255,0.22),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.2),transparent_55%)]" />
              <div className="relative flex flex-col gap-7 p-5 sm:p-6 lg:p-7">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#2f6fe4,#8db8ff)] font-heading text-xl font-extrabold text-white shadow-[0_20px_50px_-24px_rgba(47,111,228,0.7)]">
                      100
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="section-label">Contest MVP</span>
                        <span className="pill-badge bg-official text-primary">
                          공공 데이터 중심
                        </span>
                        <span className="pill-badge bg-community text-[#996226]">
                          부모 팁 별도 구분
                        </span>
                      </div>
                      <div>
                        <p className="font-heading text-[1.85rem] font-extrabold tracking-tight text-slate-950 sm:text-[2.35rem]">
                          우리 아이 첫 100일
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-[color:var(--text-soft)] sm:text-base">
                          초등 1학년 학부모 지원 네비게이터
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:items-end">
                    <PrimaryNav />
                    <p className="text-sm text-[color:var(--text-muted)]">
                      지금 할 일과 다음 선택을 바로 봅니다.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-3">
                  <div className="metric-card bg-[linear-gradient(135deg,rgba(47,111,228,0.12),rgba(255,255,255,0.86))]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      지금 할 일
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                      이번 주 할 일 3개만 봅니다.
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      왜 중요한가
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                      공공 기준과 부모 팁을 나눠 보여줍니다.
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      다음 선택
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                      타임라인과 추천으로 바로 이어집니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
