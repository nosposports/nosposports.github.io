// 빌드 후 각 페이지를 미리 그려 dist-web/<경로>/index.html 로 저장 (검색엔진·애드센스가 글을 바로 읽을 수 있게)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

import { fileURLToPath } from 'node:url';
const DIST = fileURLToPath(new URL('./dist-web/', import.meta.url)); // 윈도우에서도 맞는 경로
const ROUTES = ['', 'lck', 'kbo', 'kbl', 'kleague', 'epl', 'laliga', 'nba', 'leagues', 'teams', 'guide', 'faq', 'about', 'contact', 'privacy'];

// 경기별 페이지: 빌드 때 경기 데이터를 받아 주소 목록을 만든다 (주소 규칙은 web/matchPages.ts의 matchPath와 같게)
const DATA_URL = 'https://raw.githubusercontent.com/changyongone-star/nospo-data/main/matches.json';
const LIVE = new Set(['lol', 'kbo', 'kbl', 'kleague', 'epl', 'laliga']); // catalog.ts에서 live인 리그
const LEAGUE_SLUG = { lol: 'lck' };
const teamSlug = (id) => (id.includes(':') ? id.split(':').slice(1).join(':') : id.replace(/^[a-z]+-/, ''));
const matchRoute = (m) =>
  `${LEAGUE_SLUG[m.leagueId ?? 'lol'] ?? m.leagueId}/${teamSlug(m.teamA)}-vs-${teamSlug(m.teamB)}-${m.date.slice(5).replace('-', '')}`;
let dataText = '[]';
let MATCH_ROUTES = [];
try {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`matches ${res.status}`);
  dataText = await res.text();
  const list = JSON.parse(dataText).filter((m) => m.ready && LIVE.has(m.leagueId ?? 'lol'));
  MATCH_ROUTES = [...new Set(list.map(matchRoute))];
} catch (e) {
  console.warn('경기 데이터를 못 받아 경기별 페이지는 건너뜀:', e.message); // 사이트 배포 자체는 계속
}
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.txt': 'text/plain', '.xml': 'application/xml' };
const shell = await readFile(join(DIST, 'index.html'), 'utf8');

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  try {
    const f = await readFile(join(DIST, path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(f);
  } catch {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(shell);
  }
}).listen(4199);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.route(/googlesyndication|youtube|doubleclick/, (r) => r.abort());
// 경기 데이터는 위에서 받은 것으로 바로 응답 (일반 페이지는 예전처럼 데이터 없이 그린다)
let serveData = false;
await page.route(/githubusercontent/, (r) =>
  serveData ? r.fulfill({ status: 200, contentType: 'application/json', body: dataText }) : r.abort(),
);
for (const r of [...ROUTES, ...MATCH_ROUTES]) {
  serveData = r.includes('/');
  await page.goto(`http://localhost:4199/${encodeURI(r)}`);
  if (serveData) {
    // 경기 페이지가 안 그려지면 그 페이지만 건너뛴다 (배포 전체를 멈추지 않게)
    const ok = await page.waitForSelector('.mp-hero h1', { timeout: 10000 }).then(() => true, () => false);
    if (!ok) {
      console.warn('경기 페이지 건너뜀 /' + r);
      MATCH_ROUTES = MATCH_ROUTES.filter((x) => x !== r);
      continue;
    }
  } else await page.waitForTimeout(600);
  const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
  const dir = r ? join(DIST, r) : DIST;
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
  console.log('prerendered /' + r, html.length);
}
await browser.close();
server.close();

const today = new Date().toISOString().slice(0, 10);
const urls = [...ROUTES, ...MATCH_ROUTES].map((r) => `  <url><loc>https://nospo.kr/${encodeURI(r)}</loc><lastmod>${today}</lastmod></url>`).join('\n');
await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
// 없는 주소로 들어와도 앱이 뜨도록
await writeFile(join(DIST, '404.html'), shell);
console.log('sitemap + 404 done');
