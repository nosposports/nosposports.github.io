/**
 * 앱이 다루는 데이터 타입.
 * 스포일러 방지 원칙: 점수·승패·세트 스코어·영상 제목·썸네일·길이·조회수 필드는
 * 타입에서부터 존재하지 않는다. 서버도 이 형태로만 응답해야 한다.
 */

export interface Team {
  id: string;
  name: string;
  short: string;
  color: string;
}

export interface SetVideo {
  setNo: number;
  /** 유튜브 영상 ID. 해당 세트가 치러지지 않았거나 아직 업로드 전이면 null */
  videoId: string | null;
}

export interface Match {
  matchId: string;
  /** YYYY-MM-DD */
  date: string;
  league: string;
  /** 리그 id (catalog.ts). 없으면 'lol' */
  leagueId?: string;
  teamA: string; // Team.id
  teamB: string; // Team.id
  /** 1 = 경기 전체 하이라이트 영상 1개 */
  bestOf: 1 | 3 | 5;
  /** 서버가 '치러진 모든 세트의 하이라이트가 올라왔다'고 판단하면 true */
  ready: boolean;
  sets: SetVideo[];
}
