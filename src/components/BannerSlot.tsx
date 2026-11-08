import { useEffect, useRef } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';
import { BANNER_AD_GROUP_ID } from '../lib/ads';

let initialized = false;
function ensureInit() {
  if (initialized) return;
  initialized = true;
  try {
    if (TossAds.initialize.isSupported()) TossAds.initialize({});
  } catch {
    /* 미지원 환경 */
  }
}

/** 경기 목록 카드 사이에 들어가는 배너 (피드형·이미지 강조). 광고 영역은 비워 두고 SDK가 채운다 */
export function BannerSlot() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let result: { destroy: () => void } | undefined;
    try {
      if (!TossAds.attachBanner.isSupported() || !ref.current) return;
      ensureInit();
      result = TossAds.attachBanner(BANNER_AD_GROUP_ID, ref.current, { theme: 'light', variant: 'card' });
    } catch {
      /* 광고가 실패해도 목록은 그대로 */
    }
    return () => result?.destroy();
  }, []);
  return <li className="ad-slot" ref={ref as never} aria-label="광고" />;
}
