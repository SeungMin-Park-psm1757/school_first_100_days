# START HERE

이 ZIP은 **코덱스로 바로 붙여넣어 구현**할 수 있게 정리한 패키지입니다.

## 추천 사용 순서
1. `prompts/codex_initial_prompt.md` 내용을 코덱스에 먼저 넣습니다.
2. 코덱스가 프로젝트 뼈대를 만들면, 이 ZIP의 `data/`, `lib/`, `app/api/` 내용을 프로젝트에 반영합니다.
3. UI가 1차 완성되면 `prompts/codex_refine_prompt.md`로 한 번 더 다듬습니다.
4. 최종 화면을 캡처해 PPT에 넣습니다.

## 포함 파일
- `README.md` : 프로젝트 개요
- `docs/ppt_15_slides.md` : 발표용 15장 슬라이드 문안
- `docs/screen_text_and_mock_data.md` : 화면 문구와 더미 데이터 설계
- `docs/codex_package_spec.md` : 전체 구현 구조와 폴더 설계
- `prompts/` : 코덱스용 프롬프트
- `data/` : 바로 쓸 수 있는 JSON 더미 데이터
- `lib/types.ts` : 타입 정의
- `app/api/` : 데모용 API 응답 예시

## MVP 범위
- 로그인/회원가입 없음
- DB 없음
- 실제 학교 신청 자동화 없음
- 더미 데이터 기반 시연용 MVP
