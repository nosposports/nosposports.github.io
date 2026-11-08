import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';
import { grantAdFree, isAdFree } from './adfree';

/**
 * 토스 인앱 광고(전면형). 콘솔 > 인앱 광고에서 광고 그룹을 만든 뒤 실제 ID로 교체하세요.
 * 테스트 중에는 반드시 테스트 ID를 써야 해요 (실제 ID로 테스트하면 정책 위반).
 */
// 테스트 중에는 반드시 테스트 ID (실제 ID로 테스트하면 정책 위반).
// 콘솔에서 광고 그룹 ID가 발급되면 출시용 빌드에서 USE_TEST_ADS=false로 바꾼다.
const USE_TEST_ADS = true;
const REAL = { interstitial: '', banner: '', rewarded: '' }; // 콘솔 '재생 전 전면 광고', '경기 목록 배너', '24시간 광고 제거 리워드' 그룹 ID
export const AD_GROUP_ID = USE_TEST_ADS || !REAL.interstitial ? 'ait-ad-test-interstitial-id' : REAL.interstitial;
export const REWARDED_AD_GROUP_ID = USE_TEST_ADS || !REAL.rewarded ? 'ait-ad-test-rewarded-id' : REAL.rewarded;
export const BANNER_AD_GROUP_ID = USE_TEST_ADS || !REAL.banner ? 'ait-ad-test-native-image-id' : REAL.banner;

/** 전면 광고 하루 노출 상한 */
const DAILY_CAP = 3;
const capKey = () => `nospo.adcount.${new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10)}`;
const shownToday = () => {
  try {
    return Number(window.localStorage.getItem(capKey()) ?? 0);
  } catch {
    return 0;
  }
};
const countShown = () => {
  try {
    window.localStorage.setItem(capKey(), String(shownToday() + 1));
  } catch {
    /* noop */
  }
};

let loaded = false;
let loading = false;

const supported = () => {
  try {
    return loadFullScreenAd.isSupported() && showFullScreenAd.isSupported();
  } catch {
    return false;
  }
};

/** 광고를 미리 불러온다 (체크리스트 73: 재생 시점에 실시간 로딩 금지) */
export function preloadAd() {
  if (!supported() || loaded || loading) return;
  loading = true;
  try {
    loadFullScreenAd({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: (e) => {
        if (e.type === 'loaded') {
          loaded = true;
          loading = false;
        }
      },
      onError: () => {
        loading = false;
      },
    });
  } catch {
    loading = false;
  }
}

export const isAdReady = () => supported() && loaded && shownToday() < DAILY_CAP && !isAdFree();

/**
 * 광고가 준비돼 있으면 보여주고, 끝나면 next()를 호출한다.
 * 준비되지 않았거나 실패하면 광고 없이 바로 next() (재생을 막지 않는다).
 */
export function showAdThen(next: () => void) {
  if (!isAdReady()) return next();
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    loaded = false;
    preloadAd(); // 다음 광고 미리 준비
    next();
  };
  countShown();
  try {
    showFullScreenAd({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: (e) => {
        if (e.type === 'dismissed' || e.type === 'failedToShow') finish();
      },
      onError: finish,
    });
  } catch {
    finish();
  }
}

// ---------- 리워드: 끝까지 보면 24시간 앱 광고 제거 ----------
export const AD_FREE_HOURS = 24;
let rLoaded = false;
let rLoading = false;

export function preloadRewarded() {
  if (!supported() || rLoaded || rLoading) return;
  rLoading = true;
  try {
    loadFullScreenAd({
      options: { adGroupId: REWARDED_AD_GROUP_ID },
      onEvent: (e) => {
        if (e.type === 'loaded') {
          rLoaded = true;
          rLoading = false;
        }
      },
      onError: () => {
        rLoading = false;
      },
    });
  } catch {
    rLoading = false;
  }
}
export const adsSupported = () => supported();
export const isRewardedReady = () => supported() && rLoaded;

/**
 * 리워드 광고 표시. 'userEarnedReward' 이벤트가 왔을 때만 보상 지급 (중간에 닫으면 보상 없음).
 * done(earned): 광고가 닫힌 뒤 호출
 */
export function showRewarded(done: (earned: boolean) => void) {
  if (!isRewardedReady()) return done(false);
  let earned = false;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    rLoaded = false;
    preloadRewarded();
    done(earned);
  };
  try {
    showFullScreenAd({
      options: { adGroupId: REWARDED_AD_GROUP_ID },
      onEvent: (e) => {
        if (e.type === 'userEarnedReward') {
          earned = true;
          grantAdFree(AD_FREE_HOURS);
        }
        if (e.type === 'dismissed' || e.type === 'failedToShow') finish();
      },
      onError: finish,
    });
  } catch {
    finish();
  }
}
