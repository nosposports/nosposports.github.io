# 보류 중인 변경 (2026-11-16, 사용자가 '하지마' — 다시 요청하기 전엔 올리지 않음)

- 영상 하나인 경기(축구·농구 등)는 목록에서 '하이라이트 보기' 한 번에 바로 재생 (`MatchDetail.tsx`의 autoStart 사용)
- 첫 화면 숫자: 불러오는 중엔 "새 경기 확인 중…", 이틀간 0개면 "최근 7일 경기 N개 보기"(`?r=__recent7`), 실패 시 "경기 목록"
  (`Onboarding.tsx`, `api.ts`의 RECENT_WEEK·recentDays, `App.tsx`·`MatchList.tsx`의 `__recentN` 처리, `web.css`의 .hero-wait·.hero-recent-go)

파일 이름의 `_`는 원래 경로의 `/` (예: `src_screens_Onboarding.tsx` → `src/screens/Onboarding.tsx`).
2026-11-16 시점 main 기준 전체 파일이라, 쓰려면 지금 main과 diff 해서 변경분만 옮길 것.
