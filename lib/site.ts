function normalizeUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  return envUrl ? normalizeUrl(envUrl) : "http://localhost:3000";
}

export function createAbsoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export const siteConfig = {
  name: "우리 아이 첫 100일",
  shortName: "첫 100일 네비",
  description:
    "초등 1학년 학부모가 입학 후 첫 100일 동안 무엇을 먼저 해야 하는지 판단하도록 돕는 지원 네비게이터",
  keywords: [
    "초등학교 입학",
    "초1 학부모",
    "첫 100일",
    "돌봄",
    "방과후",
    "학부모 지원",
    "교육 데이터"
  ],
  githubUrl: "https://github.com/SeungMin-Park-psm1757/school_first_100_days"
};
