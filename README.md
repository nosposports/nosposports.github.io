# 노스포스포츠 웹사이트 (https://nospo.kr)

결과 스포일러 없이 공식 하이라이트를 보는 사이트의 소스예요.

- `main` 브랜치에 파일을 올리면 GitHub Actions(`deploy-site`)가 자동으로 빌드해서 nospo.kr에 배포해요.
- 경기 목록 데이터는 별도 저장소(nospo-data)에서 자동 갱신돼요. 사이트를 다시 배포할 필요가 없어요.
- 구조: `web/` 사이트 화면·글 페이지, `src/` 하이라이트 목록·재생 화면, `web/public/` 로고·ads.txt·검색 인증 파일.
- `web/public/google528c33110592f5c9.html`, `ads.txt`, `CNAME`은 지우면 안 돼요 (검색 등록·광고·도메인).

루트에 있는 `index-*.js`, `about/` 같은 예전 빌드 파일은 더 이상 쓰지 않아요 (Actions 배포로 바뀜).
