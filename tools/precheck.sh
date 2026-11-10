#!/usr/bin/env bash
# 올리기 전 점검 — GitHub에 지금 올라가 있는 사이트에 '이번에 올릴 파일'만 덮어써서
# 실제 배포(GitHub Actions)와 같은 방식(빌드 + 프리렌더)으로 끝까지 만들어 본다.
# 실패하면 올리지 않는다. (2026-11-09 배포 연속 실패 사고 이후 도입)
#
# 사용: SITE=<수정본이 있는 폴더> tools/precheck.sh src/App.tsx web/web.css ...
#   - 경로는 저장소 루트 기준. SITE 기본값 = 현재 폴더
set -euo pipefail
SITE=${SITE:-$(pwd)}
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
git clone -q --depth 1 https://github.com/nosposports/nosposports.github.io "$WORK/repo"
cd "$WORK/repo"
echo "기준: GitHub $(git log --oneline -1)"
for f in "$@"; do mkdir -p "$(dirname "$f")"; cp "$SITE/$f" "$f"; echo "  덮어씀: $f"; done
if [ -d "$SITE/node_modules" ]; then cp -a "$SITE/node_modules" node_modules; else npm ci --silent; fi
npx vite build -c vite.web.config.ts >"$WORK/build.log" 2>&1 \
  || { echo "빌드 실패:"; grep -iE "error|missing|not exported" "$WORK/build.log" | head -20; exit 1; }
# 프리렌더: 로컬 playwright가 브라우저와 버전이 안 맞으면 전역 playwright 사용
if ! node scripts-prerender.mjs >"$WORK/pre.log" 2>&1; then
  rm -rf node_modules/playwright node_modules/playwright-core
  NODE_PATH=$(npm root -g) node scripts-prerender.mjs >"$WORK/pre.log" 2>&1 \
    || { echo "프리렌더 실패:"; tail -20 "$WORK/pre.log"; exit 1; }
fi
echo "통과: 빌드 OK, 프리렌더 페이지 $(ls -d dist-web/*/index.html | wc -l)개"
