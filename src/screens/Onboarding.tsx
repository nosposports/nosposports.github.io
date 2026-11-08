import { useEffect, useMemo, useState } from 'react';
import { SPORTS, leagueToken, splitSelection, teamById } from '../data/catalog';
import { TEAMS as LOL_TEAMS } from '../data/teams';
import { fetchAllMatches, withinDays } from '../lib/api';
import type { Match } from '../lib/types';
import { SportIcon } from '../components/SportIcon';
import { TeamMark } from '../components/MatchThumb';
import { navigate } from '../../web/nav';
import { RECENT_ROUND } from '../lib/api';

interface Props {
  initial: string[];
  onDone: (selection: string[]) => void;
}

const LEAGUE_DESC: Record<string, string> = {
  lol: '세트별 하이라이트',
  kbo: '차전별 하이라이트',
  mlb: '3월 개막',
  kbl: '경기 하이라이트',
  nba: '풀게임 하이라이트',
  vm: '준비 중',
  vw: '준비 중',
  kleague: '풀·2분 하이라이트',
  epl: '풀·2분 하이라이트',
};
const LEAGUE_BADGE: Record<string, [string, string]> = {
  lol: ['LCK', '#191f28'], kbo: ['KBO', '#0b2a5b'], mlb: ['MLB', '#0d2b56'], kbl: ['KBL', '#d6001c'], nba: ['NBA', '#1d428a'],
  vm: ['V', '#e60012'], vw: ['V', '#ff4f8b'], kleague: ['K1', '#00205b'], epl: ['PL', '#3d195b'],
  laliga: ['LL', '#ee8707'], bundesliga: ['BL', '#d20515'], seriea: ['SA', '#008fd7'], ucl: ['UCL', '#0e1e5b'],
};

/** 웹사이트 첫 화면: 종목 → 리그 → 응원 팀(선택) */
export function Onboarding({ initial, onDone }: Props) {
  const init = splitSelection(initial);
  const [sportId, setSportId] = useState(
    SPORTS.find((s) => s.leagues.some((l) => init.leagues.includes(l.id)))?.id ?? SPORTS[0].id,
  );
  const [leagues, setLeagues] = useState<string[]>(init.leagues);
  const [teams, setTeams] = useState<string[]>(init.teams);
  const [all, setAll] = useState<Match[]>([]);
  useEffect(() => {
    fetchAllMatches().then(setAll).catch(() => undefined);
  }, []);

  const recentBy = useMemo(() => {
    const m: Record<string, number> = {};
    for (const x of all) if (x.ready && withinDays(x.date, 2)) m[x.leagueId ?? 'lol'] = (m[x.leagueId ?? 'lol'] ?? 0) + 1;
    return m;
  }, [all]);
  const recentTotal = Object.values(recentBy).reduce((a, b) => a + b, 0);
  const liveLeagues = SPORTS.flatMap((s) => s.leagues).filter((l) => l.live).length;

  const sport = SPORTS.find((s) => s.id === sportId)!;
  const teamsOf = (id: string) => (id === 'lol' ? LOL_TEAMS.filter((t) => t.region === 'LCK') : sport.leagues.find((l) => l.id === id)?.teams ?? []);
  const toggleLeague = (id: string) => {
    if (leagues.includes(id)) {
      const lt = (SPORTS.flatMap((s) => s.leagues).find((l) => l.id === id)?.teams ?? []).map((t) => t.id);
      setLeagues(leagues.filter((x) => x !== id));
      setTeams(teams.filter((t) => !lt.includes(t)));
    } else setLeagues([...leagues, id]);
  };
  const toggleTeam = (id: string) => setTeams(teams.includes(id) ? teams.filter((x) => x !== id) : [...teams, id]);
  const countIn = (sId: string) => SPORTS.find((s) => s.id === sId)!.leagues.filter((l) => leagues.includes(l.id)).length;
  const liveCount = (sId: string) => SPORTS.find((s) => s.id === sId)!.leagues.filter((l) => l.live).length;

  const short = (id: string) => teamById(id).name.replace(/^(서울|창원|수원|울산|원주|안양|부산|고양|대구|LA)\s/, '');
  const ctaText = !leagues.length
    ? '리그를 골라주세요'
    : teams.length
      ? `${teams.slice(0, 2).map(short).join('·')}${teams.length > 2 ? ` 외 ${teams.length - 2}팀` : ''} 경기 하이라이트 보기`
      : `${leagues.length}개 리그 하이라이트 보기`;
  const teamLeagues = sport.leagues.filter((l) => leagues.includes(l.id) && l.live && teamsOf(l.id).length);

  return (
    <div className="page onb">
      <section className="hero">
        <i className="hero-c1" />
        <i className="hero-c2" />
        <h1>
          결과는 모른 채,
          <br />
          하이라이트만 보세요
        </h1>
        <p>점수·승패·썸네일 없이 공식 하이라이트를 골라 보는 곳이에요.</p>
        <div className="hero-stats">
          <button
            className="hero-recent"
            onClick={() => {
              navigate('/?r=' + RECENT_ROUND);
              window.dispatchEvent(new Event('nospo-round'));
              window.scrollTo(0, 0);
            }}
          >
            <i className="live-dot" />
            최근 이틀 새 경기 <b>{recentTotal || '-'}</b>개
            <span className="hero-recent-go">보기 ›</span>
          </button>
          <span>{liveLeagues}개 리그 자동 업데이트</span>
        </div>
      </section>

      <h2 className="onb-h">1. 종목을 골라주세요</h2>
      <div className="sport-cards" role="tablist">
        {SPORTS.map((s) => {
          const n = countIn(s.id);
          return (
            <button key={s.id} role="tab" aria-selected={s.id === sportId} className={`sport-card ${s.id === sportId ? 'on' : ''}`} onClick={() => setSportId(s.id)}>
              {n > 0 && <span className="sel-count">{n}</span>}
              <SportIcon id={s.id} />
              <b>{s.name}</b>
              <small>{liveCount(s.id) ? `${liveCount(s.id)}개 리그` : '준비 중'}</small>
            </button>
          );
        })}
      </div>

      <h2 className="onb-h">2. 리그</h2>
      <div className="league-cards">
        {sport.leagues.map((l) => {
          const on = leagues.includes(l.id);
          const [abbr, color] = LEAGUE_BADGE[l.id] ?? [l.name.slice(0, 2), '#4e5968'];
          const recent = recentBy[l.id];
          const sub = !l.live ? `준비 중${l.note ? ` · ${l.note}` : ''}` : `${LEAGUE_DESC[l.id] ?? '하이라이트'}${recent ? ` · 최근 ${recent}경기` : ''}`;
          return (
            <button key={l.id} className={`league-card ${on ? 'on' : ''} ${l.live ? '' : 'soon'}`} aria-pressed={on} onClick={() => toggleLeague(l.id)}>
              <span className="lg-ic" style={{ background: color }}>{abbr}</span>
              <span className="lg-tx">
                <b>{l.name}</b>
                <small>{sub}</small>
              </span>
              <span className="chk" />
            </button>
          );
        })}
      </div>

      {teamLeagues.map((l) => (
        <section key={l.id}>
          <h2 className="onb-h">
            3. {teamLeagues.length > 1 ? `${l.name} ` : ''}응원 팀 <span className="onb-sub">(선택 안 하면 리그 전체)</span>
          </h2>
          <div className="team-cards">
            {teamsOf(l.id).map((t) => {
              const on = teams.includes(t.id);
              return (
                <button key={t.id} className={`team-card ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleTeam(t.id)}>
                  <TeamMark teamId={t.id} size={50} />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className="onb-cta">
        <button className="w-btn fill xlarge full" disabled={!leagues.length} onClick={() => onDone([...leagues.map(leagueToken), ...teams])}>
          {ctaText}
        </button>
      </div>
    </div>
  );
}
