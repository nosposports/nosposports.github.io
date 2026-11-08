import { Storage } from '@apps-in-toss/web-framework';

/**
 * 앱인토스 Storage API 래퍼. (AsyncStorage는 사용 금지)
 * 토스 앱 밖(로컬 브라우저 개발)에서는 Storage가 실패할 수 있어 localStorage로 대체한다.
 */
async function getRaw(key: string): Promise<string | null> {
  try {
    return await Storage.getItem(key);
  } catch {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
}

async function setRaw(key: string, value: string): Promise<void> {
  try {
    await Storage.setItem(key, value);
  } catch {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* 저장 실패는 무시: 앱은 계속 동작 */
    }
  }
}

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await getRaw(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const saveJSON = (key: string, value: unknown) => setRaw(key, JSON.stringify(value));

export const KEYS = {
  favorites: 'nospo.favoriteTeams',
  watched: 'nospo.watched', // { [matchId]: number[] } 시청 완료한 세트 번호
  positions: 'nospo.positions', // { [matchId:setNo]: seconds } 보던 위치
} as const;
