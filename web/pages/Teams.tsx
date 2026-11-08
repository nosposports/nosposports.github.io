import { SPORTS } from '../../src/data/catalog';
import { TEAMS as LOL } from '../../src/data/teams';
import type { Team } from '../../src/lib/types';
import { Link } from '../Link';

/** 연고지 (팀 이름에 지역이 없는 리그만) */
const HOME: Record<string, string> = {
  'kbo-lg': '서울 (잠실)', 'kbo-doosan': '서울 (잠실)', 'kbo-kiwoom': '서울 (고척)', 'kbo-ssg': '인천', 'kbo-kt': '수원',
  'kbo-nc': '창원', 'kbo-lotte': '부산', 'kbo-samsung': '대구', 'kbo-kia': '광주', 'kbo-hanwha': '대전',
};

/** 리그별 한 줄 소개 (팀 목록 위) */
const LEAGUE_INTRO: Record<string, string> = {
  lol: '한국 리그 오브 레전드 프로 리그(LCK) 10개 팀이에요. 월즈(롤드컵) 같은 국제 대회 경기도 함께 볼 수 있어요.',
  kbo: '10개 구단과 연고지예요. 시리즈 경기는 몇 차전까지 갔는지 알 수 없도록 차전 버튼을 넉넉히 열어 둬요.',
  mlb: '시즌이 시작되면 연결할 예정이에요. 미리 골라 두면 목록에 자동으로 나와요.',
  kbl: '10개 구단이에요. 팀 이름 앞의 지역이 연고지예요.',
  nba: 'NBA 공식 채널의 풀게임 하이라이트 중, NBA가 다른 사이트에서 재생을 허용한 경기만 나와요. 허용하지 않은 경기가 많아서 목록이 적을 수 있어요. 날짜는 미국 현지 기준이에요.',
  vm: '남자부 7개 팀이에요. 결과가 드러나지 않는 공식 경기 하이라이트 채널을 찾고 있어요.',
  vw: '여자부 팀들이에요. 결과가 드러나지 않는 공식 경기 하이라이트 채널을 찾고 있어요.',
  kleague: '팀 선택 없이 리그 전체 경기를 보여드려요. 팀별 보기는 준비 중이에요.',
  epl: '팀 선택 없이 리그 전체 경기를 보여드려요. 팀별 보기는 준비 중이에요.',
};

function TeamGrid({ teams }: { teams: Team[] }) {
  return (
    <ul className="team-grid">
      {teams.map((t) => (
        <li key={t.id}>
          <span className="team-dot" style={{ background: t.color }}>{t.short.slice(0, 3)}</span>
          <span>
            <b>{t.name}</b>
            {HOME[t.id] && <small>{HOME[t.id]}</small>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Teams() {
  const jump = (id: string) => document.getElementById(`sport-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <div className="page article">
      <h1 className="title">팀 소개</h1>
      <p className="sub">종목별로 리그와 팀을 모았어요. 응원 팀을 고르면 그 팀 경기만 목록에 나와요.</p>

      <div className="sport-jump" role="navigation" aria-label="종목">
        {SPORTS.map((s) => (
          <button key={s.id} className="sport-tab" onClick={() => jump(s.id)}>
            {s.name}
          </button>
        ))}
      </div>

      {SPORTS.map((s) => (
        <section key={s.id} id={`sport-${s.id}`} className="art-section sport-section">
          <h2>{s.name}</h2>
          {s.leagues
            .filter((l) => l.teams?.length || LEAGUE_INTRO[l.id])
            .map((l) => {
              const teams = l.id === 'lol' ? LOL.filter((t) => t.region === 'LCK') : l.teams ?? [];
              return (
                <div key={l.id} className="league-box">
                  <h3>
                    {l.id === 'lol' ? 'LCK' : l.name}{' '}
                    {l.live ? <span className="tag live">볼 수 있어요</span> : <span className="tag">준비 중</span>}
                  </h3>
                  {LEAGUE_INTRO[l.id] && <p>{LEAGUE_INTRO[l.id]}</p>}
                  {l.live && teams.length > 0 && <TeamGrid teams={teams} />}
                </div>
              );
            })}
        </section>
      ))}

      <section className="art-section">
        <h2>응원 팀 고르기</h2>
        <p>
          <Link to="/">하이라이트</Link> 화면의 "리그·팀 편집"에서 리그와 팀을 고를 수 있어요. 팀을 고르지 않으면 그 리그 전체
          경기가 나와요.
        </p>
      </section>
    </div>
  );
}
