import { useEffect, useState } from 'react';
import { leagueById, leagueToken, splitSelection } from '../../src/data/catalog';
import { fetchAllMatches } from '../../src/lib/api';
import { KEYS, loadJSON, saveJSON } from '../../src/lib/storage';
import type { Match } from '../../src/lib/types';
import { TeamMark } from '../../src/components/MatchThumb';
import { LEAGUE_PAGES } from '../leaguePages';
import { INFO } from './Leagues';
import { Link } from '../Link';
import { navigate } from '../nav';

const fmt = (d: string) => `${Number(d.slice(5, 7))}월 ${Number(d.slice(8))}일`;

/** 리그별 소개 페이지: 검색으로 들어온 사람이 바로 그 리그 하이라이트로 갈 수 있게 */
export function LeaguePage({ slug }: { slug: string }) {
  const page = LEAGUE_PAGES[slug];
  const league = leagueById(page.leagueId);
  const info = INFO[page.leagueId];
  const [recent, setRecent] = useState<Match[]>([]);
  useEffect(() => {
    fetchAllMatches()
      .then((all) => setRecent(all.filter((m) => (m.leagueId ?? 'lol') === page.leagueId && m.ready).slice(0, 6)))
      .catch(() => undefined);
  }, [page.leagueId]);

  // 이 리그를 내 선택에 더하고 하이라이트 목록으로
  const go = async () => {
    const fav = await loadJSON<string[]>(KEYS.favorites, []);
    const { leagues } = splitSelection(fav);
    const next = leagues.includes(page.leagueId) ? fav : [...fav, leagueToken(page.leagueId)];
    await saveJSON(KEYS.favorites, next);
    navigate('/');
  };

  return (
    <div className="page article">
      <section className="hero lp-hero">
        <i className="hero-c1" />
        <h1>{page.h1}</h1>
        <p>{page.desc}</p>
        <button className="lp-cta" onClick={go}>
          {page.name} 하이라이트 바로 보기 ›
        </button>
      </section>

      {recent.length > 0 && (
        <section className="art-section">
          <h2>최근 올라온 {page.name} 하이라이트</h2>
          <ul className="lp-recent">
            {recent.map((m) => (
              <li key={m.matchId}>
                <button onClick={go}>
                  <span className="pair">
                    <TeamMark teamId={m.teamA} size={30} />
                    <TeamMark teamId={m.teamB} size={30} />
                  </span>
                  <span className="lp-tx">
                    <b>{m.league}</b>
                    <small>{fmt(m.date)}</small>
                  </span>
                  <span className="go">›</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="hint small">결과·점수는 표시하지 않아요. 누르면 하이라이트 목록으로 가요.</p>
        </section>
      )}

      {info && (
        <section className="art-section">
          <h2>{league?.name ?? page.name}는 어떤 리그인가요?</h2>
          <p>{info.what}</p>
          <p><b>경기 방식</b> {info.format}</p>
          <p><b>노스포 요령</b> {info.tip}</p>
        </section>
      )}

      <section className="art-section">
        <h2>노스포스포츠에서 보는 법</h2>
        <ol>
          <li>위의 "하이라이트 바로 보기"를 누르면 {page.name} 경기 목록이 나와요.</li>
          <li>목록에는 날짜와 팀 이름만 있어요. 점수·승패·썸네일은 보여주지 않아요.</li>
          <li>경기를 열고 세트(차전) 버튼을 누르면 공식 하이라이트가 바로 재생돼요.</li>
        </ol>
        <p className="lp-kw">{page.keywords.join(' · ')}</p>
      </section>

      <section className="art-section">
        <h2>다른 리그도 결과 모르고 보기</h2>
        <div className="lp-links">
          {Object.entries(LEAGUE_PAGES)
            .filter(([s]) => s !== slug)
            .map(([s, p]) => (
              <Link key={s} to={`/${s}`} className="lp-link">
                {p.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
