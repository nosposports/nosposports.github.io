import { useState } from 'react';
import { Button } from '@toss/tds-mobile';
import { SPORTS, leagueToken, splitSelection } from '../data/catalog';

interface Props {
  initial: string[];
  onDone: (selection: string[]) => void;
}

/**
 * 1) 종목 탭 → 2) 리그 선택(여러 개) → 3) 응원 팀(선택 사항)
 * 팀을 고르지 않은 리그는 리그 전체 경기를 보여준다.
 */
export function Onboarding({ initial, onDone }: Props) {
  const init = splitSelection(initial);
  // 이전에 고른 리그가 있으면 그 종목 탭부터
  const [sportId, setSportId] = useState(
    SPORTS.find((s) => s.leagues.some((l) => init.leagues.includes(l.id)))?.id ?? SPORTS[0].id,
  );
  const [leagues, setLeagues] = useState<string[]>(init.leagues);
  const [teams, setTeams] = useState<string[]>(init.teams);

  const sport = SPORTS.find((s) => s.id === sportId)!;
  const toggleLeague = (id: string) => {
    const leagueTeams = sport.leagues.find((l) => l.id === id)?.teams ?? [];
    if (leagues.includes(id)) {
      setLeagues(leagues.filter((x) => x !== id));
      setTeams(teams.filter((t) => !leagueTeams.some((lt) => lt.id === t))); // 리그를 빼면 그 리그 팀도 해제
    } else {
      setLeagues([...leagues, id]);
    }
  };
  const toggleTeam = (id: string) => setTeams(teams.includes(id) ? teams.filter((x) => x !== id) : [...teams, id]);
  const countIn = (sId: string) =>
    SPORTS.find((s) => s.id === sId)!.leagues.filter((l) => leagues.includes(l.id)).length;

  return (
    <div className="page">
      <h1 className="title">어떤 경기를 볼까요?</h1>
      <p className="sub">종목과 리그를 고르고, 원하면 응원 팀도 골라주세요. 결과는 절대 보여드리지 않아요.</p>

      <div className="sport-tabs" role="tablist">
        {SPORTS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={s.id === sportId}
            className={`sport-tab ${s.id === sportId ? 'on' : ''}`}
            onClick={() => setSportId(s.id)}
          >
            {s.name}
            {countIn(s.id) > 0 && <span className="count">{countIn(s.id)}</span>}
          </button>
        ))}
      </div>

      <section className="team-group">
        <h2 className="group-title">리그</h2>
        <div className="chips" role="group" aria-label="리그">
          {sport.leagues.map((l) => {
            const on = leagues.includes(l.id);
            return (
              <button key={l.id} className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleLeague(l.id)}>
                {l.name}
                {!l.live && <span className="soon"> 준비 중</span>}
              </button>
            );
          })}
        </div>
        {sport.leagues.some((l) => !l.live) && (
          <p className="hint small">'준비 중' 리그는 미리 골라 두면 하이라이트가 연결되는 대로 목록에 나와요.</p>
        )}
      </section>

      {sport.leagues
        .filter((l) => leagues.includes(l.id) && l.teams?.length)
        .map((l) => (
          <section key={l.id} className="team-group">
            <h2 className="group-title">{l.name} 응원 팀 (선택 안 하면 리그 전체)</h2>
            <div className="chips" role="group" aria-label={`${l.name} 팀`}>
              {l.teams!.map((tm) => {
                const on = teams.includes(tm.id);
                return (
                  <button key={tm.id} className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleTeam(tm.id)}>
                    {tm.name}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

      <div className="bottom-cta">
        <Button
          display="full"
          size="xlarge"
          disabled={leagues.length === 0}
          onClick={() => onDone([...leagues.map(leagueToken), ...teams])}
        >
          {leagues.length ? (initial.length ? `${leagues.length}개 리그 하이라이트 보기` : `${leagues.length}개 리그로 시작하기`) : '리그를 골라주세요'}
        </Button>
      </div>
    </div>
  );
}
