import { useEffect, useState } from 'react';
import { AD_FREE_HOURS, adsSupported, isRewardedReady, preloadRewarded, showRewarded } from '../lib/ads';
import { adFreeUntil, isAdFree, onAdFreeChange } from '../lib/adfree';

const fmtLeft = (ms: number) => {
  const h = Math.floor(ms / 3600e3);
  const m = Math.floor((ms % 3600e3) / 60e3);
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};

/** 목록 상단: 리워드 광고 1번 보고 24시간 앱 광고 없이 보기 (사용자가 직접 눌러야만 광고 시작) */
export function AdFreeCard() {
  const [, force] = useState(0);
  const [ready, setReady] = useState(isRewardedReady());
  const [msg, setMsg] = useState('');

  useEffect(() => {
    preloadRewarded();
    const off = onAdFreeChange(() => force((x) => x + 1));
    const t = window.setInterval(() => {
      setReady(isRewardedReady());
      force((x) => x + 1); // 남은 시간 갱신
    }, 30000);
    const quick = window.setInterval(() => setReady(isRewardedReady()), 1000);
    window.setTimeout(() => window.clearInterval(quick), 15000);
    return () => {
      off();
      window.clearInterval(t);
      window.clearInterval(quick);
    };
  }, []);

  if (!adsSupported() && !isAdFree()) return null; // 광고 미지원(구버전 토스 앱 등)이면 숨김

  if (isAdFree()) {
    return (
      <div className="adfree-card on">
        <strong>광고 없이 보는 중</strong>
        <span>{fmtLeft(adFreeUntil() - Date.now())} 남았어요 · 유튜브 영상 속 광고는 제외</span>
      </div>
    );
  }

  return (
    <button
      className="adfree-card"
      disabled={!ready}
      onClick={() =>
        showRewarded((earned) =>
          setMsg(earned ? '' : '광고를 끝까지 봐야 광고 없이 볼 수 있어요.'),
        )
      }
    >
      <strong>광고 1번 보고 {AD_FREE_HOURS}시간 광고 없이 보기 ›</strong>
      <span>
        {ready ? '목록 배너와 재생 전 광고가 사라져요 · 유튜브 영상 속 광고는 제외' : '광고를 준비하고 있어요…'}
      </span>
      {msg && <em>{msg}</em>}
    </button>
  );
}
