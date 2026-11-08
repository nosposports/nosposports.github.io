import { useCallback, useEffect, useRef, useState } from 'react';
import { closeView, graniteEvent } from '@apps-in-toss/web-framework';
import type { Match } from './lib/types';
import { fetchMatches } from './lib/api';
import { splitSelection } from './data/catalog';
import { KEYS, loadJSON, saveJSON } from './lib/storage';
import { runBackHandler } from './lib/back';
import { isAdReady, preloadAd } from './lib/ads';
import { initAdFree } from './lib/adfree';
import { IS_WEB } from './lib/env';
import { Onboarding } from './screens/Onboarding';
import { MatchList } from './screens/MatchList';
import { MatchDetail } from './screens/MatchDetail';

export type WatchedMap = Record<string, { sets: number[]; done: boolean }>;

type Screen = { name: 'loading' } | { name: 'onboarding'; fromList?: boolean } | { name: 'list' } | { name: 'detail'; match: Match };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'loading' });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watched, setWatched] = useState<WatchedMap>({});
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState(false);

  // 저장된 상태 불러오기
  useEffect(() => {
    (async () => {
      const [fav, w, pos] = await Promise.all([
        loadJSON<string[]>(KEYS.favorites, []),
        loadJSON<WatchedMap>(KEYS.watched, {}),
        loadJSON<Record<string, number>>(KEYS.positions, {}),
      ]);
      setFavorites(fav);
      setWatched(w);
      setPositions(pos);
      // 토스 앱: 열면 항상 종목·리그 선택 화면부터. 웹사이트: 이미 골랐으면 바로 목록
      setScreen(IS_WEB && fav.length ? { name: 'list' } : { name: 'onboarding' });
    })();
  }, []);

  const load = useCallback(async (teams: string[]) => {
    setError(false);
    setMatches(null);
    try {
      setMatches(await fetchMatches(teams));
    } catch (e) {
      console.error('[nospo] fetchMatches', e);
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (screen.name === 'list') load(favorites);
  }, [screen.name, favorites, load]);

  const markWatched = (matchId: string, setNo: number, matchDone: boolean) => {
    setWatched((prev) => {
      const cur = prev[matchId] ?? { sets: [], done: false };
      const next: WatchedMap = {
        ...prev,
        [matchId]: {
          sets: cur.sets.includes(setNo) ? cur.sets : [...cur.sets, setNo],
          done: cur.done || matchDone,
        },
      };
      saveJSON(KEYS.watched, next);
      return next;
    });
  };

  // 위치 저장은 자주 일어나므로 메모리에 두고 묶어서 저장
  const posRef = useRef(positions);
  posRef.current = positions;
  const savePosition = (key: string, seconds: number) => {
    const next = { ...posRef.current };
    if (seconds > 3) next[key] = Math.floor(seconds);
    else delete next[key];
    posRef.current = next;
    setPositions(next);
    saveJSON(KEYS.positions, next);
  };

  // 인앱 광고: 앱 시작 때 미리 불러오고, 경기마다 첫 재생에 한 번만
  const [adReady, setAdReady] = useState(false);
  const [adShownFor, setAdShownFor] = useState<string[]>([]);
  useEffect(() => {
    initAdFree();
    preloadAd();
    const t = window.setInterval(() => setAdReady(isAdReady()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const adFor = (matchId: string) => adReady && !adShownFor.includes(matchId);

  // 체크리스트 6·14·28: 토스 상단 뒤로가기·안드로이드 백버튼
  // 상세 → 목록, 팀 편집(목록에서 진입) → 목록, 첫 화면 → 미니앱 종료
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const hasFavRef = useRef(favorites.length > 0);
  hasFavRef.current = favorites.length > 0;
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = graniteEvent.addEventListener('backEvent', {
        onEvent: () => {
          if (runBackHandler()) return; // 전체화면 등 화면 안 상태를 먼저 닫기
          const cur = screenRef.current.name;
          const s = screenRef.current;
          if (cur === 'detail' || (s.name === 'onboarding' && s.fromList)) {
            setScreen({ name: 'list' });
          } else {
            closeView().catch(() => undefined);
          }
        },
        onError: (e) => console.warn('[nospo] backEvent', e),
      });
    } catch {
      /* 토스 앱 밖(로컬 브라우저)에서는 지원되지 않음 */
    }
    return () => unsubscribe?.();
  }, []);

  // 웹사이트: 상세·편집 화면에 들어갈 때 브라우저 기록을 하나 쌓아 브라우저 뒤로가기로 목록에 돌아오게 한다
  const canBack = screen.name === 'detail' || (screen.name === 'onboarding' && !!screen.fromList);
  useEffect(() => {
    if (!IS_WEB) return;
    window.scrollTo(0, 0);
    if (canBack) window.history.pushState({ nospo: 1 }, '', window.location.href);
  }, [screen, canBack]);
  const webBack = IS_WEB && canBack && (
    <div className="web-back">
      <button className="text-btn back" onClick={() => window.history.back()}>
        ‹ 목록으로
      </button>
    </div>
  );

  if (screen.name === 'loading') return <div className="page empty">불러오는 중…</div>;

  if (screen.name === 'onboarding')
    return (
      <>
      {webBack}
      <Onboarding
        initial={favorites}
        onDone={(teams) => {
          setFavorites(teams);
          saveJSON(KEYS.favorites, teams);
          if (IS_WEB && screen.fromList) window.history.back();
          else setScreen({ name: 'list' });
        }}
      />
      </>
    );

  if (screen.name === 'detail')
    return (
      <>
      {webBack}
      <MatchDetail
        match={screen.match}
        watched={watched}
        positions={positions}
        autoStart
        adAvailable={adFor(screen.match.matchId)}
        onAdShown={() => setAdShownFor((p) => [...p, screen.match.matchId])}
        onBack={() => setScreen({ name: 'list' })}
        onSetWatched={markWatched}
        onPosition={savePosition}
      />
      </>
    );

  return (
    <MatchList
      matches={matches}
      error={error}
      watched={watched}
      adFor={adFor}
      onOpen={(m) => setScreen({ name: 'detail', match: m })}
      leagues={splitSelection(favorites).leagues}
      onEditTeams={() => setScreen({ name: 'onboarding', fromList: true })}
      onRetry={() => load(favorites)}
    />
  );
}
