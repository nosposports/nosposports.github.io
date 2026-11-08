import { loadJSON, saveJSON } from './storage';

/** 리워드 광고 보상: 이 시각까지 앱 광고(배너·전면) 제거 */
const KEY = 'nospo.adFreeUntil';
let until = 0;
const listeners = new Set<() => void>();

export async function initAdFree() {
  until = await loadJSON<number>(KEY, 0);
  listeners.forEach((f) => f());
}
export const adFreeUntil = () => until;
export const isAdFree = () => Date.now() < until;
export function grantAdFree(hours: number) {
  // 이미 광고 제거 중이면 남은 시간에 더하지 않고, 지금부터 다시 24시간
  until = Date.now() + hours * 3600e3;
  saveJSON(KEY, until);
  listeners.forEach((f) => f());
}
export function onAdFreeChange(f: () => void) {
  listeners.add(f);
  return () => listeners.delete(f);
}
