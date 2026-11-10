# 목록 사이 광고(인피드) 초안 — 보관용, 사이트 빌드에 포함되지 않음

- 2026-11-08 디자인 확정, 사용자 결정: **"우선 저장만"** → 애드센스 승인 전까지 올리지 않는다.
- 이 폴더의 파일은 어디서도 import하지 않으므로 빌드·배포에 영향 없음.

## 켜는 법 (애드센스 승인 후, 사용자가 인피드 광고 단위를 만들어 준 다음)
1. `adsense.ts`의 `slots.feed`(광고 단위 ID)와 `feedLayoutKey`를 채운다. 좌·우·하단 슬롯도 함께.
2. 파일 3개를 제자리에 넣는다: `AdSlot.tsx`·`adsense.ts` → `web/`, `MatchList.tsx` → `src/screens/`
   - 넣기 전에 지금 올라가 있는 파일과 diff 해서, 그 사이 생긴 다른 변경을 잃지 않게 합친다.
   - `.feed-ad` CSS는 이미 `web/web.css`에 있다.
3. `tools/precheck.sh web/AdSlot.tsx web/adsense.ts src/screens/MatchList.tsx` 통과 후 업로드.
4. 미리보기: 주소 뒤에 `?adpreview` (광고 ID 없이도 자리 표시).
- 동작: 경기 카드 5개(`feedEvery`)마다 경기 카드와 같은 틀의 광고 1개, '광고' 표시는 항상.
