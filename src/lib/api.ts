import type { Match } from './types';
import { leagueById, splitSelection } from '../data/catalog';

/**
 * 자동 갱신되는 경기 목록 (GitHub 저장소의 matches.json, 10분마다 자동 업데이트)
 */
const DATA_URL = 'https://raw.githubusercontent.com/changyongone-star/nospo-data/main/matches.json';

const ALLOWED_KEYS = new Set(['matchId', 'date', 'league', 'teamA', 'teamB', 'bestOf', 'ready', 'sets', 'leagueId']);

/** 서버가 실수로 제목·점수 등을 보내도 화면에 닿지 않도록 허용 필드만 남긴다. */
function sanitize(raw: unknown): Match {
  const m = raw as Record<string, unknown>;
  const clean: Record<string, unknown> = {};
  for (const k of Object.keys(m)) if (ALLOWED_KEYS.has(k)) clean[k] = m[k];
  const sets = Array.isArray(clean.sets) ? clean.sets : [];
  clean.sets = sets.map((s: Record<string, unknown>) => ({
    setNo: Number(s.setNo),
    videoId: typeof s.videoId === 'string' ? s.videoId : null,
  }));
  return clean as unknown as Match;
}

let cache: { at: number; p: Promise<Match[]> } | null = null;

async function load(): Promise<Match[]> {
  const res = await fetch(`${DATA_URL}?t=${Math.floor(Date.now() / 300000)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`matches ${res.status}`);
  return ((await res.json()) as unknown[]).map(sanitize);
}

/**
 * 전체 경기 목록 (1분 동안은 같은 요청을 재사용).
 * 못 불러오면 한 번 더 시도하고, 그래도 안 되면 오류를 던진다 — 옛날 목록을 말없이 보여주지 않는다.
 */
export function fetchAllMatches(): Promise<Match[]> {
  if (cache && Date.now() - cache.at < 60000) return cache.p;
  const p = load().catch(async (e) => {
    console.warn('[nospo] 목록 불러오기 실패, 다시 시도', e);
    await new Promise((r) => setTimeout(r, 1500));
    return load();
  });
  const entry = { at: Date.now(), p };
  cache = entry;
  // 실패한 결과는 캐시에 남기지 않는다 (다시 시도 버튼이 바로 새로 불러오도록)
  p.catch(() => {
    if (cache === entry) cache = null;
  });
  return p;
}

/** 한국 날짜 기준 오늘부터 n일 전까지의 경기인지 */
/** 목록 주소의 ?r= 값: 모든 리그의 최근 이틀 경기 */
export const RECENT_ROUND = '__recent2';

export const withinDays = (date: string, n: number) => {
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const d = (Date.parse(today) - Date.parse(date)) / 864e5;
  return d >= 0 && d < n;
};

export async function fetchMatches(selection: string[]): Promise<Match[]> {
  const list = await fetchAllMatches();
  const { leagues, teams } = splitSelection(selection);
  const mine = list.filter((m) => {
    const lid = m.leagueId ?? 'lol';
    if (!leagues.includes(lid)) return false;
    // 이 리그에서 고른 팀이 있으면 그 팀 경기만, 없으면 리그 전체
    const leagueTeams = (leagueById(lid)?.teams ?? []).map((t) => t.id).filter((id) => teams.includes(id));
    return leagueTeams.length === 0 || leagueTeams.includes(m.teamA) || leagueTeams.includes(m.teamB);
  });
  return [...mine].sort((a, b) => b.date.localeCompare(a.date));
}
