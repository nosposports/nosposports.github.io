import type { Team } from '../lib/types';
import { TEAMS as LOL_TEAMS } from './teams';

export interface League {
  id: string;
  name: string;
  /** 하이라이트 자동 수집이 연결된 리그만 true */
  live: boolean;
  /** 팀 선택을 제공하는 리그만 (없으면 리그 전체를 따라감) */
  teams?: Team[];
  note?: string;
}
export interface Sport {
  id: string;
  name: string;
  leagues: League[];
}

const t = (league: string, list: [string, string, string, string][]): Team[] =>
  list.map(([id, name, short, color]) => ({ id: `${league}-${id}`, name, short, color }));

const KBO = t('kbo', [
  ['lg', 'LG 트윈스', 'LG', '#C30037'],
  ['doosan', '두산 베어스', '두산', '#131230'],
  ['kiwoom', '키움 히어로즈', '키움', '#820024'],
  ['ssg', 'SSG 랜더스', 'SSG', '#CE0E2D'],
  ['kt', 'KT 위즈', 'KT', '#000000'],
  ['nc', 'NC 다이노스', 'NC', '#315288'],
  ['lotte', '롯데 자이언츠', '롯데', '#041E42'],
  ['samsung', '삼성 라이온즈', '삼성', '#074CA1'],
  ['kia', 'KIA 타이거즈', 'KIA', '#EA0029'],
  ['hanwha', '한화 이글스', '한화', '#FF6600'],
]);

const KBL = t('kbl', [
  ['sk', '서울 SK', 'SK', '#E01E37'],
  ['samsung', '서울 삼성', '삼성', '#0057B8'],
  ['lg', '창원 LG', 'LG', '#C30037'],
  ['kt', '수원 KT', 'KT', '#000000'],
  ['mobis', '울산 현대모비스', '모비스', '#003E7E'],
  ['db', '원주 DB', 'DB', '#00843D'],
  ['kgc', '안양 정관장', '정관장', '#D3112A'],
  ['kcc', '부산 KCC', 'KCC', '#00205B'],
  ['sono', '고양 소노', '소노', '#1C2F5E'],
  ['kogas', '대구 한국가스공사', '가스', '#0074C8'],
]);

const NBA = t('nba', [
  ['atl', '애틀랜타 호크스', 'ATL', '#C8102E'],
  ['bos', '보스턴 셀틱스', 'BOS', '#007A33'],
  ['bkn', '브루클린 네츠', 'BKN', '#000000'],
  ['cha', '샬럿 호네츠', 'CHA', '#1D1160'],
  ['chi', '시카고 불스', 'CHI', '#CE1141'],
  ['cle', '클리블랜드 캐벌리어스', 'CLE', '#860038'],
  ['dal', '댈러스 매버릭스', 'DAL', '#00538C'],
  ['den', '덴버 너기츠', 'DEN', '#0E2240'],
  ['det', '디트로이트 피스톤스', 'DET', '#C8102E'],
  ['gsw', '골든스테이트 워리어스', 'GSW', '#1D428A'],
  ['hou', '휴스턴 로키츠', 'HOU', '#CE1141'],
  ['ind', '인디애나 페이서스', 'IND', '#002D62'],
  ['lac', 'LA 클리퍼스', 'LAC', '#C8102E'],
  ['lal', 'LA 레이커스', 'LAL', '#552583'],
  ['mem', '멤피스 그리즐리스', 'MEM', '#5D76A9'],
  ['mia', '마이애미 히트', 'MIA', '#98002E'],
  ['mil', '밀워키 벅스', 'MIL', '#00471B'],
  ['min', '미네소타 팀버울브스', 'MIN', '#0C2340'],
  ['nop', '뉴올리언스 펠리컨스', 'NOP', '#0C2340'],
  ['nyk', '뉴욕 닉스', 'NYK', '#006BB6'],
  ['okc', '오클라호마시티 선더', 'OKC', '#007AC1'],
  ['orl', '올랜도 매직', 'ORL', '#0077C0'],
  ['phi', '필라델피아 세븐티식서스', 'PHI', '#006BB6'],
  ['phx', '피닉스 선스', 'PHX', '#1D1160'],
  ['por', '포틀랜드 트레일블레이저스', 'POR', '#E03A3E'],
  ['sac', '새크라멘토 킹스', 'SAC', '#5A2D81'],
  ['sas', '샌안토니오 스퍼스', 'SAS', '#000000'],
  ['tor', '토론토 랩터스', 'TOR', '#CE1141'],
  ['uta', '유타 재즈', 'UTA', '#002B5C'],
  ['was', '워싱턴 위저즈', 'WAS', '#002B5C'],
]);

const VM = t('vm', [
  ['kal', '대한항공', '대한항공', '#0C2D83'],
  ['hdc', '현대캐피탈', '현대캐피탈', '#002C5F'],
  ['kb', 'KB손해보험', 'KB', '#FFBC00'],
  ['ssf', '삼성화재', '삼성화재', '#0057B8'],
  ['woori', '우리카드', '우리카드', '#0067AC'],
  ['ok', 'OK저축은행', 'OK', '#E60012'],
  ['kepco', '한국전력', '한국전력', '#E4002B'],
]);

const VW = t('vw', [
  ['hk', '흥국생명', '흥국생명', '#E60012'],
  ['hdec', '현대건설', '현대건설', '#003876'],
  ['kgc', '정관장', '정관장', '#D3112A'],
  ['ex', '한국도로공사', '도로공사', '#003DA5'],
  ['ibk', 'IBK기업은행', 'IBK', '#004EA2'],
  ['gs', 'GS칼텍스', 'GS', '#00A651'],
  ['pepper', '페퍼저축은행', '페퍼', '#E60012'],
]);

export const SPORTS: Sport[] = [
  {
    id: 'esports',
    name: 'e스포츠',
    leagues: [{ id: 'lol', name: 'LoL (LCK·월즈)', live: true, teams: LOL_TEAMS }],
  },
  {
    id: 'baseball',
    name: '야구',
    leagues: [
      { id: 'kbo', name: 'KBO', live: true, teams: KBO },
      { id: 'mlb', name: 'MLB', live: false, note: '3월 개막' },
    ],
  },
  {
    id: 'basketball',
    name: '농구',
    leagues: [
      { id: 'kbl', name: 'KBL', live: true, teams: KBL, note: '일부 경기만 제공' },
      { id: 'nba', name: 'NBA', live: true, teams: NBA, note: 'NBA가 외부 재생을 허용한 경기만 (많지 않아요)' },
    ],
  },
  {
    id: 'volleyball',
    name: '배구',
    leagues: [
      { id: 'vm', name: 'V-리그 남자부', live: false, teams: VM, note: '공식 경기 하이라이트 채널을 찾는 중' },
      { id: 'vw', name: 'V-리그 여자부', live: false, teams: VW, note: '공식 경기 하이라이트 채널을 찾는 중' },
    ],
  },
  {
    id: 'soccer',
    name: '축구',
    leagues: [
      { id: 'kleague', name: 'K리그1', live: true },
      { id: 'epl', name: '프리미어리그', live: true },
      { id: 'laliga', name: '라리가', live: true },
      { id: 'bundesliga', name: '분데스리가', live: false },
      { id: 'seriea', name: '세리에 A', live: false },
      { id: 'ucl', name: '챔피언스리그', live: false },
    ],
  },
];

export const ALL_LEAGUES = SPORTS.flatMap((s) => s.leagues);
export const leagueById = (id: string) => ALL_LEAGUES.find((l) => l.id === id);
export const ALL_TEAMS: Team[] = ALL_LEAGUES.flatMap((l) => l.teams ?? []);

/** 선택 저장 형식: 리그는 'L:<리그id>', 팀은 팀 id 그대로 */
export const leagueToken = (id: string) => `L:${id}`;
export function splitSelection(sel: string[]) {
  const leagues = sel.filter((s) => s.startsWith('L:')).map((s) => s.slice(2));
  const teams = sel.filter((s) => !s.startsWith('L:'));
  // 예전 버전(팀만 저장) 호환: 리그가 없고 팀만 있으면 LoL로 간주
  if (leagues.length === 0 && teams.length > 0) leagues.push('lol');
  return { leagues, teams };
}

const PALETTE = ['#3182F6', '#F04452', '#00A661', '#FE9800', '#8B5CF6', '#0EA5E9', '#E11D48', '#4B5563'];
export const teamById = (id: string): Team => {
  const hit = ALL_TEAMS.find((t) => t.id === id);
  if (hit) return hit;
  // 'epl:첼시' 처럼 목록에 없는 팀: 이름 그대로 표시, 색은 이름으로 고정 배정
  const name = id.includes(':') ? id.split(':').slice(1).join(':') : id.toUpperCase();
  const color = PALETTE[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
  return { id, name, short: [...name].slice(0, 2).join(''), color };
};
