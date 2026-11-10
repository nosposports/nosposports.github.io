import { Fragment, useState } from 'react';
import { Badge, Button } from '@toss/tds-mobile';
import type { Match } from '../lib/types';
import { RECENT_ROUND } from '../lib/api';
import { MatchThumb } from '../components/MatchThumb';
import { DatePicker } from '../components/DatePicker';
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
  /** 대회·라운드 전체 보기 중이면 그 이름 */
  round?: string | null;
  onClearRound?: () => void;
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

const DOW = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const kstToday = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
function dateHead(d: string) {
  const [, m, day] = d.split('-');
  const diff = Math.round((Date.parse(kstToday()) - Date.parse(d)) / 864e5);
  const rel = diff === 0 ? '오늘' : diff === 1 ? '어제' : diff === 2 ? '그저께' : diff > 0 && diff < 7 ? `${diff}일 전` : '';
  return { md: `${Number(m)}월 ${Number(day)}일`, dow: DOW[new Date(`${d}T00:00:00+09:00`).getDay()], rel, today: diff === 0 };
}

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

export function MatchList({ matches, leagues, error, watched, adFor, onOpen, onEditTeams, onRetry, round, onClearRound }: Props) {
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
  const [day, setDay] = useState<string | null>(null);
  const counts = (matches ?? []).reduce<Record<string, number>>((acc, m) => ((acc[m.date] = (acc[m.date] ?? 0) + 1), acc), {});
  const shown = day ? (matches ?? []).filter((m) => m.date === day) : matches;
  // 목록 사이 광고: 카드 N개마다 1개 (영상 보는 화면에는 넣지 않음)
  let cardNo = 0;

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

      {round && (
        <div className="round-banner">
          <span>
            <small>{round === RECENT_ROUND ? '모든 리그 · 어제와 오늘' : '이 대회·라운드 전체 경기'}</small>
            <b>{round === RECENT_ROUND ? '최근 이틀 경기' : round}</b>
          </span>
          <button onClick={onClearRound}>{leagues.length ? '내 리그로 돌아가기' : '리그 고르기'}</button>
        </div>
      )}

      {!round && leagues
        .map((id) => leagueById(id))
        .filter((l) => l && !l.live)
        .map((l) => (
          <div key={l!.id} className="soon-card">
            <strong>{l!.name}</strong> 하이라이트는 준비 중이에요{l!.note ? ` (${l!.note})` : ''}. 연결되면 여기에 자동으로 나와요.
          </div>
        ))}

      {!!matches?.length && <DatePicker counts={counts} value={day} onChange={setDay} />}

      {!!matches?.length && (
        <div className="list-tools">
          <span>{day ? `${Number(day.slice(5, 7))}월 ${Number(day.slice(8))}일 · ` : '전체 · '}{shown?.length ?? 0}경기</span>
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
        {shown
          ?.reduce<{ date: string; items: Match[] }[]>((acc, m) => {
            const last = acc[acc.length - 1];
            if (last && last.date === m.date) last.items.push(m);
            else acc.push({ date: m.date, items: [m] });
            return acc;
          }, [])
          .map((g) => {
            const h = dateHead(g.date);
            return (
              <Fragment key={g.date}>
                <li className={`date-head ${h.today ? 'today' : ''}`}>
                  <span className="dh-md">{h.md}</span>
                  <span className="dh-dow">{h.dow}</span>
                  {h.rel && <span className="dh-rel">{h.rel}</span>}
                  <span className="dh-cnt">{g.items.length}경기</span>
                </li>
                {g.items.map((m) => {
          const done = watched[m.matchId]?.done;
          cardNo += 1;
          return (
            <Fragment key={m.matchId}>
            <li className={`card ${grid ? 'compact' : ''}`}>
              <div className="card-meta">
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
            </Fragment>
          );
                })}
              </Fragment>
            );
          })}
      </ul>
    </div>
  );
}
