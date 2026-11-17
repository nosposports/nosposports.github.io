# 노스포스포츠 (nospo.kr)

**작업 전에 `HANDOFF.md`를 먼저 끝까지 읽는다.** 구조·운영 방식·사용자와 정한 규칙·최근 결정·남은 일이 모두 거기 있다.

## 꼭 지킬 것
- 사용자와는 한국어로 대화한다.
- 화면이 바뀌는 변경은 **예상 화면(스크린샷)을 먼저 보여주고**, 사용자가 "올려줘/적용해줘"라고 한 뒤에 push한다.
- 결과 스포일러 금지(점수·승패·썸네일·영상 제목·영상 길이·세트 수). 공식 팀 로고 금지(이니셜 배지).
- 유튜브 플레이어 위에 오버레이를 올리거나 썸네일·제목을 가리지 않는다 (유튜브 API 정책 위반).
- 쓴 만큼 결제되는 유료 서비스는 쓰지 않는다. 필요하면 먼저 사용자에게 묻는다.
- `drafts/`는 보관용 — 사용자가 요청하기 전에는 사이트 코드에 합치지 않는다.

## 올리는 순서
1. `npm ci` → `npm run build`(빌드+프리렌더)가 끝까지 통과하는지 확인 (`npx playwright install chromium` 필요할 수 있음)
2. main에 commit/push → GitHub Actions `deploy-site`가 GitHub Pages로 배포
3. 2~3분 뒤 `curl -s "https://nospo.kr/version.txt?t=$(date +%s)"` == `git rev-parse HEAD` 확인 후 실제 화면 확인
   — 이 확인 전에는 "반영됐다"고 말하지 않는다.

경기 데이터 수집은 별도 저장소 `changyongone-star/nospo-data` (그쪽 CLAUDE.md 참고).
