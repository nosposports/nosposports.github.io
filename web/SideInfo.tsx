import { useEffect, useState } from 'react';
import { fetchAllMatches, withinDays } from '../src/lib/api';
import type { Match } from '../src/lib/types';
import { TeamMark } from '../src/components/MatchThumb';
import { Link } from './Link';

/** 오른쪽 칸: 이용 방법 + 방금 올라온 하이라이트(결과 없이 대진만) */
export function SideInfo() {
  const [recent, setRecent] = useState<Match[]>([]);
  useEffect(() => {
    fetchAllMatches()
      .then((all) => setRecent(all.filter((m) => m.ready).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)))
      .catch(() => undefined);
  }, []);
  return (
    <>
      <div className="side-card">
        <strong>이렇게 봐요</strong>
        <ol className="steps">
          <li><i>1</i>종목·리그·응원 팀을 골라요</li>
          <li><i>2</i>날짜와 팀 이름만 보고 경기를 골라요</li>
          <li><i>3</i>세트 버튼을 누르면 바로 재생돼요</li>
        </ol>
        <Link to="/guide">스포 피하는 방법 보기 ›</Link>
      </div>
      {recent.length > 0 && (
        <div className="side-card">
          <strong>방금 올라온 하이라이트</strong>
          <ul className="recent">
            {recent.map((m) => (
              <li key={m.matchId}>
                <span className="pair">
                  <TeamMark teamId={m.teamA} size={28} />
                  <TeamMark teamId={m.teamB} size={28} />
                </span>
                <span className="rl">{m.league}</span>
                {withinDays(m.date, 2) && <span className="new">NEW</span>}
              </li>
            ))}
          </ul>
          <p className="fine">결과는 표시하지 않아요</p>
        </div>
      )}
    </>
  );
}
