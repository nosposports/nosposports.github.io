import { useState } from 'react';
import { Badge, Button } from '@toss/tds-mobile';
import type { Match } from '../lib/types';
import { MatchThumb } from '../components/MatchThumb';
import type { WatchedMap } from '../App';
import { leagueById } from '../data/catalog';

interface Props {
  matches: Match[] | null;
  /** 고른 리그 id 목록 (준비 중 안내용) */
  leagues: string[];
  error: boolean;
  watched: WatchedMap;
  /** 이 경기를 열면 광고가 먼저 나오는지 (버튼에 미리 표시) */
  adFor: (matchId: string) => boolean;
  onOpen: (m: Match) => void;
  onEditTeams: () => void;
  onRetry: () => void;
}

type View = 'list' | 'grid';
const VIEW_KEY = 'nospo.listView';
const loadView = (): View => {
  try {
    return window.localStorage.getItem(VIEW_KEY) === 'grid' ? 'grid' : 'list';
  } catch {
    return 'list';
  }
};

const fmtDate = (d: string) => {
  const [, m, day] = d.split('-');
  const w = ['일', '월', '화', '수', '목', '금', '토'][new Date(`${d}T00:00:00+09:00`).getDay()];
  return `${Number(m)}월 ${Number(day)}일 (${w})`;
};

function ListIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      <rect x="3" y="4" width="14" height="2.2" rx="1.1" />
      <rect x="3" y="8.9" width="14" height="2.2" rx="1.1" />
      <rect x="3" y="13.8" width="14" height="2.2" rx="1.1" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      <rect x="3" y="3" width="6" height="6" rx="1.6" />
      <rect x="11" y="3" width="6" height="6" rx="1.6" />
      <rect x="3" y="11" width="6" height="6" rx="1.6" />
      <rect x="11" y="11" width="6" height="6" rx="1.6" />
    </svg>
  );
}

export function MatchList({ matches, leagues, error, watched, adFor, onOpen, onEditTeams, onRetry }: Props) {
  const [view, setView] = useState<View>(loadView);
  const choose = (v: View) => {
    setView(v);
    try {
      window.localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* 저장 실패는 무시 */
    }
  };
  const grid = view === 'grid';

  return (
    <div className="page">
      <div className="list-head">
        <h1 className="title">최근 경기</h1>
        <button className="text-btn" onClick={onEditTeams}>
          리그·팀 편집
        </button>
      </div>
      <p className="sub">새 하이라이트가 자동으로 올라와요. 점수와 승패는 숨겨져 있어요.</p>

      {error && (
        <div className="empty">
          <p>경기 목록을 불러오지 못했어요.</p>
          <Button size="medium" variant="weak" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      )}
      {!error && matches === null && <div className="empty">불러오는 중…</div>}
      {!error && matches?.length === 0 && <div className="empty">아직 볼 수 있는 경기가 없어요.</div>}

      {leagues
        .map((id) => leagueById(id))
        .filter((l) => l && !l.live)
        .map((l) => (
          <div key={l!.id} className="soon-card">
            <strong>{l!.name}</strong> 하이라이트는 준비 중이에요{l!.note ? ` (${l!.note})` : ''}. 연결되면 여기에 자동으로 나와요.
          </div>
        ))}

      {!!matches?.length && (
        <div className="list-tools">
          <span>{matches.length}경기</span>
          <div className="view-toggle" role="group" aria-label="보기 방식">
            <button className={!grid ? 'on' : ''} aria-pressed={!grid} aria-label="크게 보기" onClick={() => choose('list')}>
              <ListIcon />
            </button>
            <button className={grid ? 'on' : ''} aria-pressed={grid} aria-label="2칸으로 보기" onClick={() => choose('grid')}>
              <GridIcon />
            </button>
          </div>
        </div>
      )}

      <ul className={`cards ${grid ? 'grid2' : ''}`}>
        {matches?.map((m) => {
          const done = watched[m.matchId]?.done;
          return (
            <li key={m.matchId} className={`card ${grid ? 'compact' : ''}`}>
              <div className="card-meta">
                <span>{fmtDate(m.date)}</span>
                {!grid && <span className="dot">·</span>}
                <span className="lg-name">{m.league}</span>
                {done && (
                  <Badge size="xsmall" variant="weak" color="green" className="badge">
                    {grid ? '봤음' : '시청 완료'}
                  </Badge>
                )}
              </div>
              <MatchThumb teamA={m.teamA} teamB={m.teamB} compact={grid} />
              {m.ready ? (
                <>
                  <Button display="block" size={grid ? 'medium' : 'large'} variant={done ? 'weak' : 'fill'} onClick={() => onOpen(m)}>
                    {(adFor(m.matchId) ? '광고 보고 ' : '') + (done ? '다시 보기' : grid ? '보기' : '하이라이트 보기')}
                  </Button>
                  {!grid && <p className="hint center">누르면 바로 골라서 볼 수 있어요</p>}
                </>
              ) : (
                <div className="pending">{grid ? '준비 중' : '하이라이트 준비 중 · 보통 경기 다음 날 올라와요'}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
