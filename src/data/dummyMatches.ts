import type { Match } from '../lib/types';
import seed from './matches.json';

/** 원격 목록을 못 불러올 때 쓰는 내장 데이터 (빌드 시점의 matches.json 사본) */
export const DUMMY_MATCHES = seed as unknown as Match[];
