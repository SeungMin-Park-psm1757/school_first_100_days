# Codex 실행용 패키지 스펙

## 목표
초등 1학년 학부모가 입학 전후 100일 동안 겪는 정보 탐색과 의사결정 부담을 줄이기 위한 웹 MVP를 구현합니다.

## 구현 원칙
- 모바일 퍼스트
- 한국어 UI
- Next.js + TypeScript + Tailwind CSS
- 클릭 가능한 작동형 데모
- 공공데이터 정보와 선배 학부모 팁을 시각적으로 구분
- 로그인/DB/실시간 신청 연동 제외

## 권장 폴더 구조
```bash
first-100-days-mvp/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ timeline/page.tsx
│  ├─ recommendations/page.tsx
│  └─ api/
│     ├─ generate-plan/route.ts
│     └─ generate-community-summary/route.ts
├─ components/
├─ data/
├─ lib/
├─ prompts/
└─ README.md
```

## 페이지별 구현 목표

### 홈(`/`)
- 사용자 입력 폼
- AI 요약 카드
- 데이터 출처 배지

### 타임라인(`/timeline`)
- 단계 탭
- 카드 리스트
- 진행 상태 및 보기 옵션

### 추천 결과(`/recommendations`)
- 추천 카드 2~3개
- AI 설명 패널
- 간단한 필터 바

## 구현 우선순위
1. 페이지 3개 생성
2. 더미 데이터 연결
3. 카드 UI 완성
4. API 응답 연결
5. 모바일 다듬기
6. 발표용 캡처 생성
