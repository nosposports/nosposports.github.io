import type { Team } from '../lib/types';

// 2026 월드 챔피언십 참가팀 (LCK 팀 먼저). region은 온보딩 묶음 표시에 사용
export const TEAMS: (Team & { region: 'LCK' | '해외' })[] = [
  { id: 'gen', name: '젠지', short: 'GEN', color: '#AA8A00', region: 'LCK' },
  { id: 'hle', name: '한화생명e스포츠', short: 'HLE', color: '#F37321', region: 'LCK' },
  { id: 't1', name: 'T1', short: 'T1', color: '#E2012D', region: 'LCK' },
  { id: 'dk', name: '디플러스 기아', short: 'DK', color: '#1B3B6F', region: 'LCK' },
  { id: 'kt', name: 'KT 롤스터', short: 'KT', color: '#D7000F', region: 'LCK' },
  { id: 'bfx', name: 'BNK 피어엑스', short: 'BFX', color: '#E0A100', region: 'LCK' },
  { id: 'ns', name: '농심 레드포스', short: 'NS', color: '#D6001C', region: 'LCK' },
  { id: 'dnf', name: 'DN 프릭스', short: 'DNF', color: '#3A2D7D', region: 'LCK' },
  { id: 'drx', name: 'DRX', short: 'DRX', color: '#2B5CE6', region: 'LCK' },
  { id: 'bro', name: '브리온', short: 'BRO', color: '#00573F', region: 'LCK' },
  { id: 'blg', name: 'BLG', short: 'BLG', color: '#00A0E9', region: '해외' },
  { id: 'tes', name: 'TES', short: 'TES', color: '#E8411D', region: '해외' },
  { id: 'ig', name: 'IG', short: 'IG', color: '#1F1F1F', region: '해외' },
  { id: 'al', name: 'AL', short: 'AL', color: '#6A3FB5', region: '해외' },
  { id: 'g2', name: 'G2', short: 'G2', color: '#2B2B2B', region: '해외' },
  { id: 'kc', name: '카르민 코프', short: 'KC', color: '#0B4DA2', region: '해외' },
  { id: 'mkoi', name: '모비스타 코이', short: 'MKOI', color: '#5B2D8E', region: '해외' },
  { id: 'lyon', name: 'LYON', short: 'LYON', color: '#0E2D52', region: '해외' },
  { id: 'tlaw', name: '팀 리퀴드', short: 'TL', color: '#0A2240', region: '해외' },
  { id: 'los', name: 'LOS', short: 'LOS', color: '#2E7D32', region: '해외' },
  { id: 'cfo', name: 'CFO', short: 'CFO', color: '#C99A2E', region: '해외' },
  { id: 'tsw', name: 'TSW', short: 'TSW', color: '#37474F', region: '해외' },
];

export const teamById = (id: string): Team =>
  TEAMS.find((t) => t.id === id) ?? { id, name: id, short: id.toUpperCase(), color: '#8B95A1' };
