import { useState } from 'react';
import { showAdThen } from '../lib/ads';
import type { Match } from '../lib/types';
import { teamById } from '../data/catalog';
import { MatchThumb } from '../components/MatchThumb';
import { SpoilerFreePlayer } from '../components/SpoilerFreePlayer';
import type { WatchedMap } from '../App';

interface Props {
  match: Match;
  watched: WatchedMap;
  positions: Record<string, number>;
  autoStart: boolean;
  adAvailable: boolean;
  onAdShown: () => void;
  onBack: () => void;
  onSetWatched: (matchId: string, setNo: number, matchDone: boolean) => void;
  onPosition: (key: string, seconds: number) => void;
}

type View =
  | { kind: 'pick' }
  | { kind: 'ad' }
  | { kind: 'playing' }
  | { kind: 'noSet' }
  | { kind: 'done' }
  | { kind: 'error' };

/**
 * 처음엔 세트 버튼만 보인다.
 * 세트를 누르면 유튜브 플레이어가 그대로(손대지 않고) 위에 나타나 바로 재생된다.
 */
export function MatchDetail(props: Props) {
  const { match, watched, positions, adAvailable, onAdShown, onSetWatched, onPosition } = props;
  const w = watched[match.matchId] ?? { sets: [], done: false };
  const TAB_COUNT = match.bestOf === 1 ? 1 : Math.max(5, match.bestOf);
  const UNIT = match.leagueId === 'kbo' ? '차전' : '세트';
  const OBJ = UNIT === '차전' ? '을' : '를'; // 조사
  const TOP = UNIT === '차전' ? '은' : '는';
  const [setNo, setSetNo] = useState(1);
  const [view, setView] = useState<View>({ kind: 'pick' });

  const videoOf = (n: number) => match.sets.find((s) => s.setNo === n)?.videoId ?? null;
  const posKey = `${match.matchId}:${setNo}`;
  const a = teamById(match.teamA).name;
  const b = teamById(match.teamB).name;
  const setLabel = (n: number) => (TAB_COUNT === 1 ? '하이라이트 보기' : `${n}${UNIT}`);

  const tapSet = (n: number) => {
    setSetNo(n);
    if (!videoOf(n)) return setView({ kind: 'noSet' }); // 영상 없는 세트는 누른 뒤에야 안내
    if (adAvailable) {
      onAdShown();
      setView({ kind: 'ad' });
      showAdThen(() => setView({ kind: 'playing' }));
    } else {
      setView({ kind: 'playing' });
    }
  };

  const handleFinished = () => {
    onSetWatched(match.matchId, setNo, !videoOf(setNo + 1));
    setView({ kind: 'done' });
  };

  return (
    <div className="page">
      <h1 className="title small">
        [{match.date.slice(5).replace('-', '.')}] {a} vs {b} 하이라이트
      </h1>

      {view.kind === 'playing' && videoOf(setNo) ? (
        <SpoilerFreePlayer
          key={posKey}
          videoId={videoOf(setNo)!}
          startAt={positions[posKey] ?? 0}
          playSignal={1}
          pauseSignal={0}
          onIframe={() => undefined}
          onFinished={handleFinished}
          onPosition={(s) => onPosition(posKey, s)}
          onEmbedError={() => setView({ kind: 'error' })}
          fullscreen={false}
        />
      ) : (
        <MatchThumb teamA={match.teamA} teamB={match.teamB} />
      )}

      {view.kind === 'ad' && <p className="notice">광고가 끝나면 바로 재생돼요.</p>}
      {view.kind === 'noSet' && <p className="notice">{setNo}{UNIT}{TOP} 아직 없어요. 이전 {UNIT}에서 끝났거나 아직 열리지 않았어요.</p>}
      {view.kind === 'done' && (
        <p className="notice">{TAB_COUNT === 1 ? '하이라이트를 다 봤어요.' : `${setNo}${UNIT}${OBJ} 다 봤어요.`}</p>
      )}
      {view.kind === 'error' && <p className="notice">이 영상은 앱에서 재생할 수 없어요.</p>}

      <p className="hint center pick">
        {TAB_COUNT === 1 ? '누르면' : `보고 싶은 ${UNIT}${OBJ} 누르면`} 유튜브 영상이 바로 재생돼요
        {adAvailable ? ' (처음 한 번 짧은 광고 후)' : ''}
      </p>
      <div className={`set-grid ${TAB_COUNT === 1 ? 'single' : ''}`}>
        {Array.from({ length: TAB_COUNT }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`set-big ${view.kind !== 'pick' && n === setNo ? 'on' : ''}`}
            onClick={() => tapSet(n)}
          >
            {setLabel(n)}
            {w.sets.includes(n) && <span className="seen"> ✓</span>}
          </button>
        ))}
      </div>

      {TAB_COUNT > 1 && (
        <div className="set-note">
          <strong>{UNIT} 버튼은 항상 {TAB_COUNT}개예요</strong>
          <span>
            실제로 몇 세트까지 했는지와 상관없이 5개를 모두 열어 뒀어요. 영상이 없는 세트를 누르면 그 전 세트에서
            경기가 끝났다는 뜻이니, 결과를 모르고 보려면 1세트부터 순서대로 보세요.
          </span>
        </div>
      )}
    </div>
  );
}
