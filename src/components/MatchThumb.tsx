import { teamById } from '../data/catalog';

/** 원본 유튜브 썸네일 대신 쓰는 자체 썸네일: 팀 이니셜과 색만 사용 */
export function TeamMark({ teamId, size = 44 }: { teamId: string; size?: number }) {
  const t = teamById(teamId);
  return (
    <span
      className="team-mark"
      style={{ width: size, height: size, background: t.color, fontSize: size * 0.3 }}
      aria-hidden
    >
      {t.short}
    </span>
  );
}

export function MatchThumb({ teamA, teamB }: { teamA: string; teamB: string }) {
  const a = teamById(teamA);
  const b = teamById(teamB);
  return (
    <div className="match-thumb">
      <div className="side">
        <TeamMark teamId={teamA} />
        <span className="team-name">{a.name}</span>
      </div>
      <span className="vs">VS</span>
      <div className="side">
        <TeamMark teamId={teamB} />
        <span className="team-name">{b.name}</span>
      </div>
    </div>
  );
}
