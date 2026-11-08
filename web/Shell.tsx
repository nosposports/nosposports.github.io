import { useEffect, useState } from 'react';
import App from '../src/App';
import { AdSlot } from './AdSlot';
import { Link } from './Link';
import { currentPath, migrateHash, onRoute } from './nav';
import { Guide } from './pages/Guide';
import { Leagues } from './pages/Leagues';
import { Teams } from './pages/Teams';
import { Faq } from './pages/Faq';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';

const NAV = [
  { path: '/', label: '하이라이트' },
  { path: '/leagues', label: '리그 안내' },
  { path: '/teams', label: '팀 소개' },
  { path: '/guide', label: '노스포 가이드' },
  { path: '/faq', label: '자주 묻는 질문' },
];

export const PAGES: Record<string, { title: string; desc: string }> = {
  '': {
    title: '노스포스포츠 — 결과 스포일러 없이 보는 스포츠 하이라이트',
    desc: 'LCK·KBO·KBL·NBA·K리그·프리미어리그 공식 하이라이트를 점수와 승패를 숨긴 채 볼 수 있는 무스포일러 하이라이트 사이트.',
  },
  leagues: { title: '리그 안내 · 노스포스포츠', desc: '노스포스포츠에서 볼 수 있는 리그와 리그별 경기 방식, 결과 모르고 보는 요령.' },
  teams: { title: '팀 소개 · 노스포스포츠', desc: 'LCK·KBO·KBL 팀과 연고지. 응원 팀을 골라 그 팀 경기만 스포 없이 보세요.' },
  guide: { title: '노스포 가이드 · 노스포스포츠', desc: '경기를 놓쳤을 때 결과를 모른 채 하이라이트를 즐기는 방법.' },
  faq: { title: '자주 묻는 질문 · 노스포스포츠', desc: '노스포스포츠 이용 방법과 하이라이트 업데이트, 광고에 대한 질문과 답.' },
  about: { title: '소개 · 노스포스포츠', desc: '"결과 모르고 보고 싶다"는 마음으로 만든 무스포일러 하이라이트 모음.' },
  contact: { title: '문의 · 노스포스포츠', desc: '오류 제보, 리그 추가 요청, 저작권 관련 요청은 이메일로 보내 주세요.' },
  privacy: { title: '개인정보처리방침 · 노스포스포츠', desc: '노스포스포츠 개인정보처리방침.' },
};

function setMeta(route: string) {
  const p = PAGES[route] ?? PAGES[''];
  document.title = p.title;
  const set = (sel: string, attr: string, val: string) => {
    let el = document.head.querySelector(sel) as HTMLMetaElement | HTMLLinkElement | null;
    if (!el) {
      const [tag, rest] = sel.split('[');
      el = document.createElement(tag) as HTMLMetaElement;
      const [k, v] = rest.replace(']', '').split('=');
      el.setAttribute(k, v.replace(/"/g, ''));
      document.head.appendChild(el);
    }
    el.setAttribute(attr, val);
  };
  const url = `https://nospo.kr/${route}`;
  set('meta[name="description"]', 'content', p.desc);
  set('meta[property="og:title"]', 'content', p.title);
  set('meta[property="og:description"]', 'content', p.desc);
  set('meta[property="og:url"]', 'content', url);
  set('link[rel="canonical"]', 'href', url);
}

export function Shell() {
  const [route, setRoute] = useState(() => {
    migrateHash();
    return currentPath();
  });
  useEffect(() => onRoute(() => setRoute(currentPath())), []);
  useEffect(() => {
    setMeta(route);
    if (route) window.scrollTo(0, 0);
  }, [route]);

  const page =
    route === 'leagues' ? <Leagues /> :
    route === 'teams' ? <Teams /> :
    route === 'guide' ? <Guide /> :
    route === 'faq' ? <Faq /> :
    route === 'about' ? <About /> :
    route === 'contact' ? <Contact /> :
    route === 'privacy' ? <Privacy /> : <App />;

  return (
    <div className="site">
      <header className="site-head">
        <Link className="brand" to="/">
          <img src="/logo.png" alt="" width={32} height={32} />
          <span>노스포스포츠</span>
        </Link>
        <nav className="site-nav" aria-label="메뉴">
          {NAV.map((r) => (
            <Link key={r.path} to={r.path} className={`/${route}` === r.path ? 'on' : ''}>
              {r.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="site-body">
        <aside className="side left">
          <AdSlot where="left" />
        </aside>

        <main className="site-main">{page}</main>

        <aside className="side right">
          <AdSlot where="right" />
          <div className="side-card">
            <strong>결과는 절대 안 보여드려요</strong>
            <p>점수·승패·썸네일을 가리고, 몇 세트까지 갔는지도 알 수 없게 세트 버튼을 항상 같은 개수로 보여줘요.</p>
            <Link to="/guide">스포 피하는 방법 보기 ›</Link>
          </div>
        </aside>
      </div>

      <div className="bottom-ad">
        <AdSlot where="bottom" />
      </div>

      <footer className="site-foot">
        <p>
          노스포스포츠는 각 리그·중계사의 공식 유튜브 하이라이트를 유튜브 플레이어로 그대로 보여주는 비공식 서비스예요.
          영상의 저작권은 각 권리자에게 있어요.
        </p>
        <p>
          <Link to="/about">소개</Link> · <Link to="/contact">문의</Link> · <Link to="/privacy">개인정보처리방침</Link> ·{' '}
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">YouTube 서비스 약관</a>
        </p>
      </footer>
    </div>
  );
}
