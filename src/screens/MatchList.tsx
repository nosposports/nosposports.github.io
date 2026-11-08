import { Badge, Button } from '@toss/tds-mobile';
import type { Match } from '../lib/types';
import { MatchThumb } from '../components/MatchThumb';
import type { WatchedMap } from '../App';
import { leagueById } from '../data/catalog';
import { Fragment } from 'react';
import { BannerSlot } from '../components/BannerSlot';
import { AdFreeCard } from '../components/AdFreeCard';
import { isAdFree } from '../lib/adfree';

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

const fmtDate = (d: string) => {
  const [, m, day] = d.split('-');
  const w = ['일', '월', '화', '수', '목', '금', '토'][new Date(`${d}T00:00:00+09:00`).getDay()];
  return `${Number(m)}월 ${Number(day)}일 (${w})`;
};

export function MatchList({ matches, leagues, error, watched, adFor, onOpen, onEditTeams, onRetry }: Props) {
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

      <AdFreeCard />

      <ul className="cards">
        {matches?.map((m, idx) => {
          const done = watched[m.matchId]?.done;
          return (
            <Fragment key={m.matchId}>
            {/* 카드 3개마다 배너 1개 (첫 화면 맨 위에는 넣지 않음) */}
            {idx > 0 && idx % 3 === 0 && !isAdFree() && <BannerSlot />}
            <li className="card">
              <div className="card-meta">
                <span>{fmtDate(m.date)}</span>
                <span className="dot">·</span>
                <span>{m.league}</span>
                {done && (
                  <Badge size="xsmall" variant="weak" color="green" className="badge">
                    시청 완료
                  </Badge>
                )}
              </div>
              <MatchThumb teamA={m.teamA} teamB={m.teamB} />
              {m.ready ? (
                <>
                  <Button display="block" size="large" variant={done ? 'weak' : 'fill'} onClick={() => onOpen(m)}>
                    {(adFor(m.matchId) ? '광고 보고 ' : '') + (done ? '다시 보기' : '하이라이트 보기')}
                  </Button>
                  <p className="hint center">
                    누르면 바로 골라서 볼 수 있어요
                  </p>
                </>
              ) : (
                <div className="pending">하이라이트 준비 중 · 보통 경기 다음 날 올라와요</div>
              )}
            </li>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}
