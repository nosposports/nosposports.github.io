import { useEffect, useRef } from 'react';
import { ADSENSE } from './adsense';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

let scriptAdded = false;
function ensureScript() {
  if (scriptAdded || !ADSENSE.client || document.querySelector('script[src*="adsbygoogle"]')) return;
  scriptAdded = true;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.client}`;
  document.head.appendChild(s);
}

type Where = 'left' | 'right' | 'bottom' | 'feed';
const preview = () => typeof window !== 'undefined' && window.location.search.includes('adpreview');
/** 이 자리에 광고(또는 미리보기)가 실제로 그려지는지 */
export const adOn = (where: Where) => (!!ADSENSE.client && !!ADSENSE.slots[where]) || preview();

/** 목록 사이 광고: 경기 카드와 같은 둥근 카드 틀 + '광고' 표시 (경기 카드처럼 보이게 꾸미지 않음) */
export function FeedAd() {
  const slot = ADSENSE.slots.feed;
  useEffect(() => {
    if (!ADSENSE.client || !slot) return;
    ensureScript();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* 광고 실패는 무시 */
    }
  }, [slot]);
  return (
    <li className="feed-ad" aria-label="광고">
      <span className="feed-ad-label">광고</span>
      {ADSENSE.client && slot ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE.client}
          data-ad-slot={slot}
          data-ad-format="fluid"
          data-ad-layout-key={ADSENSE.feedLayoutKey || undefined}
        />
      ) : (
        <div className="feed-ad-sample" aria-hidden>
          <div className="fas-img" />
          <div className="fas-tx">
            <b>광고 제목이 이 자리에 나와요</b>
            <span>광고 설명 문구 한두 줄 · 광고주 이름</span>
          </div>
        </div>
      )}
    </li>
  );
}

/** 사이드·하단 광고 자리. 유튜브 플레이어와 겹치지 않는 별도 영역에만 놓는다 */
export function AdSlot({ where }: { where: 'left' | 'right' | 'bottom' }) {
  const ref = useRef<HTMLModElement>(null);
  const slot = ADSENSE.slots[where];
  useEffect(() => {
    if (!ADSENSE.client || !slot) return;
    ensureScript();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* 광고 실패는 무시 */
    }
  }, [slot]);

  if (!ADSENSE.client || !slot) {
    // 광고 단위가 아직 없으면 자리 표시 없이 비워 둔다 (심사 때 '공사 중'처럼 보이지 않게)
    // ?adpreview 를 붙이면 광고가 들어갈 자리를 미리 보여준다
    if (typeof window !== 'undefined' && window.location.search.includes('adpreview'))
      return <div className={`ad-box ${where} placeholder`} aria-hidden="true">광고</div>;
    return null;
  }
  return (
    <div className={`ad-box ${where}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE.client}
        data-ad-slot={slot}
        data-ad-format={where === 'bottom' ? 'horizontal' : 'vertical'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
