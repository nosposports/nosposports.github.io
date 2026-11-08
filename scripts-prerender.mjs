// 빌드 후 각 페이지를 미리 그려 dist-web/<경로>/index.html 로 저장 (검색엔진·애드센스가 글을 바로 읽을 수 있게)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const DIST = new URL('./dist-web/', import.meta.url).pathname;
const ROUTES = ['', 'leagues', 'teams', 'guide', 'faq', 'about', 'contact', 'privacy'];
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
await page.route(/googlesyndication|youtube|githubusercontent|doubleclick/, (r) => r.abort());
for (const r of ROUTES) {
  await page.goto(`http://localhost:4199/${r}`);
  await page.waitForTimeout(600);
  const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
  const dir = r ? join(DIST, r) : DIST;
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
  console.log('prerendered /' + r, html.length);
}
await browser.close();
server.close();

const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.map((r) => `  <url><loc>https://nospo.kr/${r}</loc><lastmod>${today}</lastmod></url>`).join('\n');
await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
// 없는 주소로 들어와도 앱이 뜨도록
await writeFile(join(DIST, '404.html'), shell);
console.log('sitemap + 404 done');
