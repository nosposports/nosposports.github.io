# 노스포스포츠(nospo.kr) 작업 인수인계

새 Claude 세션이 이 파일부터 읽고 이어서 작업한다. 사용자와는 **한국어**로 대화한다.
마지막 갱신: 2026-11-11

## 한 줄 요약
결과 스포일러 없이 공식 유튜브 하이라이트를 보는 웹사이트. 점수·승패·썸네일·영상 길이를 숨기고,
세트 버튼은 항상 같은 개수(LoL 5개)로 보여 몇 세트까지 갔는지도 모르게 한다.

## 저장소 2개
| 저장소 | 하는 일 | 배포 |
| --- | --- | --- |
| `nosposports/nosposports.github.io` (이 저장소) | 사이트 소스 (React 18 + Vite) | push → Actions `deploy-site` → GitHub Pages → nospo.kr |
| `changyongone-star/nospo-data` | 경기 데이터 수집 (`scripts/update.mjs`) | Actions `update-highlights`가 `matches.json` 갱신 |

- 사이트는 `https://raw.githubusercontent.com/changyongone-star/nospo-data/main/matches.json`을 읽는다 (60초 캐시).
- 저장소 루트의 `index-*.js/css` 등은 예전 빌드 잔재 — 무시 (Pages는 Actions 산출물 `dist-web`만 배포).

## 사이트 구조 (이 저장소)
- 빌드: `npm run build` = `vite build -c vite.web.config.ts` + `node scripts-prerender.mjs`
  - root `web/`, 산출 `dist-web/`. 프리렌더는 playwright로 각 경로의 `index.html`·`sitemap.xml`·`404.html` 생성.
  - 페이지 경로를 추가하면 `scripts-prerender.mjs`의 `ROUTES`에도 넣는다.
- `web/` 사이트 껍데기: `Shell.tsx`(머리글·메뉴·바닥글·페이지 메타), `nav.ts`·`Link.tsx`(경로 라우팅),
  `SideInfo.tsx`(오른쪽 '방금 올라온 하이라이트'), `InstallBar.tsx`(홈 화면에 추가), `leaguePages.ts`(리그 소개 페이지),
  `pages/`(리그 안내·팀 소개·가이드·FAQ·소개·문의·개인정보), `AdSlot.tsx`·`adsense.ts`(광고), `public/`(CNAME, ads.txt, robots, 아이콘, manifest, sw.js)
- `src/` 앱 본체: `App.tsx`(화면 전환, `?r=` 라운드 보기, `__recent2` = 모든 리그 최근 이틀), `screens/Onboarding.tsx`(첫 화면: 종목→리그→팀),
  `screens/MatchList.tsx`(목록·날짜·달력), `data/catalog.ts`(종목·리그·팀, `live` 여부), `lib/api.ts`(데이터 읽기)
- 라이브 리그: LCK·월즈(lol), KBO, KBL, NBA, K리그1, 프리미어리그, 라리가. 배구는 채널 못 찾아 '준비 중'.

## 데이터 수집 (nospo-data)
- 채널: LCK, TVING(KBO·KBL), 쿠팡플레이 스포츠(프리미어리그·K리그1·라리가), NBA(풀게임 하이라이트만)
- 제목 파서로 대진·라운드만 뽑고 원본 제목은 저장 안 함. RSS 실패 시 YouTube Data API(Secret `YT_API_KEY`).
- `checkEmbeddable`로 외부 재생 막힌 영상 제외 (NBA는 대부분 막혀 있음).
- 실행 방식: 한 번 돌면 약 40분 동안 10분마다 갱신하고 끝에 다음 실행을 스스로 예약(체인).
  30분 예약(schedule)은 체인이 끊겼을 때 살리는 보조. 체인이 멈췄으면 Actions에서 `Run workflow` 한 번.
- LoL은 시리즈 중에는 `ready:false`(목록에 '준비 중'), 매치 하이라이트가 올라오거나 마지막 영상 후 6시간 지나면 열림.
- 최근 경기가 0건이면 먼저 채널에 실제로 새 영상이 있는지 본다 (A매치 휴식기·시즌 휴식이면 정상).

## 작업 환경과 올리는 방법
- 이 세션 도구에는 GitHub 쓰기 권한이 없다. **사용자 PC의 크롬(Claude in Chrome)에서 GitHub 웹 업로드**로 올린다.
  - 크롬은 GitHub `changyongone-star` 계정에 로그인돼 있어야 함 (조직 `nosposports` 소유자).
  - 업로드: `https://github.com/<저장소>/upload/main/<폴더>` → 파일 입력에 업로드 → `Commit changes` 클릭.
  - 커밋 클릭 뒤 **페이지 이동이 끝날 때까지 기다린 다음** 다음 업로드로 넘어간다 (너무 빨리 넘어가면 커밋이 사라진 적 있음).
  - 같은 폴더 파일은 한 번에, 폴더가 다르면 폴더별로 커밋.
- **올리기 전**: `tools/precheck.sh <바꾼 파일들>` — GitHub 현재본 + 바꾼 파일로 실제 배포와 똑같이 빌드·프리렌더. 실패하면 올리지 않는다.
  (2026-11-09: 로컬에만 있던 코드가 섞여 올라가 배포가 이틀간 연속 실패한 사고가 있었음)
- **올린 후**: 2~3분 뒤 `https://nospo.kr/version.txt?t=<아무 숫자>`(캐시 회피)가 GitHub 최신 커밋 번호와 같은지 확인하고, 바뀐 화면을 실제로 열어 본다.
  파일이 GitHub에 올라간 것만으로 "반영됐다"고 말하지 않는다.
- 샌드박스에서는 youtube.com·nospo.kr 접속이 안 될 수 있다 → 크롬으로 확인. raw.githubusercontent.com은 된다.

## 사용자와 정한 규칙
- 화면을 바꾸는 작업은 **예상 화면(스크린샷)을 먼저 보여주고**, 사용자가 "올려줘/적용해줘"라고 하면 올린다.
- 공식 팀 로고 사용 금지(상표) → 팀 색 이니셜 배지 사용.
- 결과를 암시하는 정보(점수·승패·썸네일·영상 길이·"역전" 같은 문구) 금지.
- 사이트에 사용자 본명·아이디 노출 금지.
- 토스(앱인토스) 관련 내용은 언급하지 않는다 — 이 프로젝트와 무관.
- 영구 삭제·결제·계정 설정 변경은 실행 전에 사용자 확인.

## 외부 서비스 (값은 공개 정보만)
- 도메인: 가비아 nospo.kr (A 레코드 GitHub Pages 4개, www CNAME), HTTPS 강제.
- 애드센스: 게시자 `ca-pub-2882245715696743`, `ads.txt` 등록, **사이트 검토 중**(2026-11-10 접수, 최대 4주).
- 방문 통계: Google 태그 `GTM-MJX72LFL` → GA4. 검색 등록: Google Search Console(HTML 파일), 네이버(메타 태그) 완료.
- 문의 메일: econoscope@gmail.com

## 남은 일
1. 애드센스 승인 후: 좌·우·하단 광고 단위와 인피드 광고 단위를 사용자가 만들고 ID를 주면 켠다
   → 인피드는 `drafts/feed-ad/README.md` 참고.
2. 경기별 페이지(검색 유입용, 예: `/lol/t1-vs-blg-1109`) — **애드센스 승인 후** 공개하기로 함.
   페이지마다 리그·단계·날짜·팀 소개를 넣어 얇은 중복 페이지가 되지 않게.
3. 첫 화면 파란 박스 개편 — 시안 A~E 제시함, 사용자 선택 대기. (빅매치 크게 띄우는 전면 개편안은 사용자가 거절함)
4. 애널리틱스에서 본인 방문 제외 설정 (제안만 함).
