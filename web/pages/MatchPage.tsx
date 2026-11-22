import { useEffect, useState } from 'react';
import { fetchAllMatches } from '../../src/lib/api';
import { KEYS, loadJSON, saveJSON } from '../../src/lib/storage';
import type { Match } from '../../src/lib/types';
import type { WatchedMap } from '../../src/App';
import { MatchDetail } from '../../src/screens/MatchDetail';
import { TeamMark } from '../../src/components/MatchThumb';
import { LEAGUE_PAGES } from '../leaguePages';
import { INFO } from './Leagues';
import { Link } from '../Link';
import { findByPath, fmtDate, leagueSlug, matchPath, stageText, teamInfo, teamName } from '../matchPages';

/** 경기별 페이지: 경기 소개 + 세트 버튼 + 두 팀 소개 + 관련 경기 (결과 정보 없음) */
export function MatchPage({ route }: { route: string }) {
  const [all, setAll] = useState<Match[] | null>(null);
  const [watched, setWatched] = useState<WatchedMap>({});
  const [positions, setPositions] = useState<Record<string, number>>({});
  useEffect(() => {
    fetchAllMatches().then(setAll).catch(() => setAll([]));
    loadJSON<WatchedMap>(KEYS.watched, {}).then(setWatched);
    loadJSON<Record<string, number>>(KEYS.positions, {}).then(setPositions);
  }, []);

  const m = all ? findByPath(all, route) : undefined;

  useEffect(() => {
    if (!m) return;
    const a = teamName(m.teamA);
    const b = teamName(m.teamB);
    const md = `${Number(m.date.slice(5, 7))}월 ${Number(m.date.slice(8))}일`;
    const title = `${a} vs ${b} ${m.league} 하이라이트 (${md}) 결과 모르고 보기 · 노스포스포츠`;
    const desc = `${md} ${m.league} ${a} 대 ${b} 공식 하이라이트를 점수·승패 없이 보세요. 경기 소개와 두 팀 소개도 함께 있어요.`;
    const url = `https://nospo.kr${encodeURI(matchPath(m))}`;
    document.title = title;
    const set = (sel: string, attr: string, val: string) => document.head.querySelector(sel)?.setAttribute(attr, val);
    set('meta[name="description"]', 'content', desc);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', desc);
    set('meta[property="og:url"]', 'content', url);
    set('link[rel="canonical"]', 'href', url);
  }, [m]);

  if (!all) return <div className="page empty">불러오는 중…</div>;
  if (!m)
    return (
      <div className="page article">
        <section className="art-section">
          <h2>경기를 찾지 못했어요</h2>
          <p>오래된 경기는 목록에서 빠졌을 수 있어요. <Link to="/">하이라이트 목록</Link>에서 찾아보세요.</p>
        </section>
      </div>
    );

  const lid = m.leagueId ?? 'lol';
  const slug = leagueSlug(lid);
  const lp = LEAGUE_PAGES[slug];
  const a = teamName(m.teamA);
  const b = teamName(m.teamB);
  // 관련 경기는 이 경기보다 '먼저' 열린 경기만 — 나중 경기가 보이면 누가 다음 단계에 올라갔는지 드러난다
  const plays = (x: Match, id: string) => x.teamA === id || x.teamB === id;
  // 같은 경기가 데이터에 두 번 들어 있는 경우가 있어 주소 기준으로 한 번만
  const seen = new Set([matchPath(m)]);
  const uniq = (x: Match) => !seen.has(matchPath(x)) && !!seen.add(matchPath(x));
  const earlier = all.filter((x) => x.ready && x.date < m.date).filter(uniq);
  const sameTeams = earlier.filter((x) => plays(x, m.teamA) || plays(x, m.teamB)).slice(0, 5);
  const sameDay = all.filter((x) => x.ready && x.date === m.date && x.league === m.league).filter(uniq);
  const sameEvent = [...sameDay, ...earlier.filter((x) => x.league === m.league)]
    .filter((x, i, arr) => !sameTeams.includes(x) && arr.indexOf(x) === i)
    .slice(0, 5);

  const markWatched = (matchId: string, setNo: number, matchDone: boolean) =>
    setWatched((prev) => {
      const cur = prev[matchId] ?? { sets: [], done: false };
      const next = { ...prev, [matchId]: { sets: cur.sets.includes(setNo) ? cur.sets : [...cur.sets, setNo], done: cur.done || matchDone } };
      saveJSON(KEYS.watched, next);
      return next;
    });
  const savePosition = (key: string, s: number) =>
    setPositions((prev) => {
      const next = { ...prev };
      if (s > 3) next[key] = Math.floor(s);
      else delete next[key];
      saveJSON(KEYS.positions, next);
      return next;
    });

  return (
    <div className="page article">
      <nav className="crumb" aria-label="현재 위치">
        <Link to="/">하이라이트</Link> › {lp ? <Link to={`/${slug}`}>{lp.name}</Link> : m.league} › <span>{m.league}</span>
      </nav>

      <section className="hero mp-hero">
        <i className="hero-c1" />
        <div className="mp-chips">
          <span>{fmtDate(m.date)}</span>
          <span>{m.league}</span>
        </div>
        <h1>
          {a} vs {b} 하이라이트
        </h1>
        <p>점수·승패·썸네일 없이, 결과를 모르는 채로 공식 하이라이트를 볼 수 있어요.</p>
      </section>

      <section className="art-section mp-watch">
        {m.ready ? (
          <MatchDetail
            match={m}
            watched={watched}
            positions={positions}
            autoStart={false}
            adAvailable={false}
            onAdShown={() => undefined}
            onBack={() => undefined}
            onSetWatched={markWatched}
            onPosition={savePosition}
            hideTitle
          />
        ) : (
          <p className="notice">하이라이트를 준비하고 있어요. 영상이 모두 올라오면 여기서 바로 볼 수 있어요.</p>
        )}
      </section>

      <section className="art-section">
        <h2>어떤 경기인가요?</h2>
        {stageText(m).map((t) => (
          <p key={t}>{t}</p>
        ))}
      </section>

      <section className="art-section">
        <h2>두 팀 소개</h2>
        <ul className="mp-teams">
          {[m.teamA, m.teamB].map((id) => (
            <li key={id}>
              <TeamMark teamId={id} size={44} />
              <div>
                <b>{teamName(id)}</b>
                {teamInfo(id) && <p>{teamInfo(id)}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {INFO[lid] && (
        <section className="art-section">
          <h2>결과 모르고 보는 요령</h2>
          <p>{INFO[lid].tip}</p>
        </section>
      )}

      {(sameTeams.length > 0 || sameEvent.length > 0) && (
        <section className="art-section">
          {sameTeams.length > 0 && (
            <>
              <h2>
                {a}·{b}의 다른 경기
              </h2>
              <MatchLinks list={sameTeams} />
            </>
          )}
          {sameEvent.length > 0 && (
            <>
              <h2 className="mp-h2-gap">{m.league} 다른 경기</h2>
              <MatchLinks list={sameEvent} />
            </>
          )}
          <p className="hint small">결과·점수는 표시하지 않아요.</p>
        </section>
      )}
    </div>
  );
}

function MatchLinks({ list }: { list: Match[] }) {
  return (
    <ul className="lp-recent">
      {list.map((x) => (
        <li key={x.matchId}>
          <Link to={matchPath(x)} className="mp-link">
            <span className="pair">
              <TeamMark teamId={x.teamA} size={30} />
              <TeamMark teamId={x.teamB} size={30} />
            </span>
            <span className="lp-tx">
              <b>
                {teamName(x.teamA)} vs {teamName(x.teamB)}
              </b>
              <small>
                {Number(x.date.slice(5, 7))}월 {Number(x.date.slice(8))}일 · {x.league}
              </small>
            </span>
            <span className="go">›</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
