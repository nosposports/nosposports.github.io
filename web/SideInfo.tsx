import { useEffect, useState } from 'react';
import { fetchAllMatches, withinDays } from '../src/lib/api';
import type { Match } from '../src/lib/types';
import { TeamMark } from '../src/components/MatchThumb';
import { Link } from './Link';
import { navigate } from './nav';

/** 오른쪽 칸: 이용 방법 + 방금 올라온 하이라이트(결과 없이 대진만) */
export function SideInfo() {
  // 같은 대회·라운드는 한 줄로 묶는다 (최근 순 5개)
  const [recent, setRecent] = useState<{ m: Match; n: number }[]>([]);
  useEffect(() => {
    fetchAllMatches()
      .then((all) => {
        const groups = new Map<string, { m: Match; n: number }>();
        for (const m of all.filter((x) => x.ready).sort((a, b) => b.date.localeCompare(a.date))) {
          const g = groups.get(m.league);
          if (g) g.n += 1;
          else groups.set(m.league, { m, n: 1 });
        }
        setRecent([...groups.values()].slice(0, 5));
      })
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
            {recent.map(({ m, n }) => (
              <li key={m.matchId}>
                <button
                  className="recent-btn"
                  onClick={() => {
                    navigate(`/?r=${encodeURIComponent(m.league)}`);
                    window.dispatchEvent(new Event('nospo-round'));
                    window.scrollTo(0, 0);
                  }}
                  aria-label={`${m.league} 전체 경기 보기`}
                >
                <span className="pair">
                  <TeamMark teamId={m.teamA} size={28} />
                  <TeamMark teamId={m.teamB} size={28} />
                </span>
                <span className="rl">
                  {m.league}
                  <small>{n}경기</small>
                </span>
                {withinDays(m.date, 2) && <span className="new">NEW</span>}
                <span className="go">›</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="fine">누르면 그 대회·라운드 경기를 모두 볼 수 있어요. 결과는 표시하지 않아요.</p>
        </div>
      )}
    </>
  );
}
