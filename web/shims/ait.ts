/* 웹사이트 빌드용: 토스 SDK 대신 쓰는 대체 모듈. 토스 전용 기능은 '미지원'으로 처리된다. */
const unsupported = <T extends (...a: never[]) => unknown>(fn: T) => Object.assign(fn, { isSupported: () => false });

export const Storage = {
  getItem: async (_k: string): Promise<string | null> => {
    throw new Error('web');
  },
  setItem: async (_k: string, _v: string): Promise<void> => {
    throw new Error('web');
  },
};

/** 브라우저 뒤로가기(popstate)를 토스 backEvent처럼 전달 */
export const graniteEvent = {
  addEventListener: (_name: 'backEvent', h: { onEvent: () => void; onError?: (e: unknown) => void }) => {
    const fn = () => h.onEvent();
    window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn);
  },
};

export const closeView = async () => undefined;

export const loadFullScreenAd = unsupported((_o: unknown) => undefined);
export const showFullScreenAd = unsupported((_o: unknown) => undefined);
export const TossAds = {
  initialize: unsupported((_o: unknown) => undefined),
  attachBanner: unsupported((_id: string, _el: HTMLElement, _o: unknown) => ({ destroy: () => undefined })),
};
export const NavigationBar = { setOptions: async (_o: unknown) => undefined };
export const setDeviceOrientation = unsupported(async (_o: unknown) => undefined);
