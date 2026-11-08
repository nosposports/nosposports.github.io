import { SPORTS } from '../../src/data/catalog';

/** 리그별 소개와 '결과 모르고 보기' 요령. 유튜브에서 가져오지 않은 자체 작성 콘텐츠 */
const INFO: Record<string, { what: string; format: string; tip: string }> = {
  lol: {
    what: '한국 리그 오브 레전드 프로 리그예요. 국내 최상위 10개 팀이 경기를 치르고, 상위 팀은 국제 대회(MSI·월즈)에 나가요.',
    format: '한 경기는 여러 세트로 이뤄져요. 3판 2선승(Bo3)이나 5판 3선승(Bo5)이 대부분이라, 몇 세트까지 갔는지만 알아도 흐름이 보여요.',
    tip: '세트 버튼은 항상 5개예요. 1세트부터 순서대로 보고, 영상이 없는 세트가 나오면 그 전 세트에서 경기가 끝난 거예요.',
  },
  kbo: {
    what: '한국 프로야구 리그예요. 10개 구단이 정규시즌을 치른 뒤 상위 팀이 포스트시즌에 올라가요.',
    format: '포스트시즌은 와일드카드 결정전, 준플레이오프, 플레이오프, 한국시리즈 순으로 열려요. 한국시리즈는 7전 4선승제예요.',
    tip: '시리즈 경기는 차전 버튼을 넉넉히 열어 둬요. 몇 차전에서 시리즈가 끝났는지 미리 알 수 없도록요.',
  },
  mlb: {
    what: '미국·캐나다 30개 구단이 참가하는 메이저리그예요.',
    format: '정규시즌 162경기 후 포스트시즌을 거쳐 월드시리즈(7전 4선승)로 우승팀을 가려요.',
    tip: '시즌이 시작되면 연결할 예정이에요. 미리 골라 두면 목록에 자동으로 나와요.',
  },
  kbl: {
    what: '한국 남자 프로농구 리그예요. 보통 가을에 개막해 봄까지 이어져요.',
    format: '10개 팀이 정규리그를 치른 뒤 상위 팀이 플레이오프와 챔피언결정전에 나가요.',
    tip: '농구는 경기 하나에 하이라이트 하나예요. 일부 경기만 하이라이트가 올라와요.',
  },
  nba: {
    what: '미국·캐나다 30개 팀이 참가하는 프로농구 리그예요.',
    format: '82경기 정규시즌 후 플레이오프(7전 4선승)를 치러요. 시즌 초반에는 NBA컵 경기도 열려요.',
    tip: 'NBA 공식 채널의 풀게임 하이라이트만 보여줘요. 기록·명장면 영상은 제목에 결과가 담겨 있어서 빼요. 날짜는 미국 현지 기준이에요.',
  },
  kleague: {
    what: '한국 프로축구 1부 리그예요.',
    format: '정규 라운드를 치른 뒤 순위에 따라 상위·하위 그룹으로 나뉘어 파이널 라운드를 치러요.',
    tip: '축구 하이라이트는 영상 길이로 결과가 짐작되지 않도록, 가능하면 풀 하이라이트를 골라 보여줘요.',
  },
  epl: {
    what: '잉글랜드 프로축구 1부 리그예요. 20개 팀이 홈·원정으로 38경기씩 치러요.',
    format: '승점으로 순위를 정하고, 하위 3팀은 2부로 강등돼요.',
    tip: '경기 다음 날이면 대부분 하이라이트가 올라와요.',
  },
};

export function Leagues() {
  return (
    <div className="page article">
      <h1 className="title">리그 안내</h1>
      <p className="sub">노스포스포츠에서 볼 수 있는 리그와, 결과를 모르고 보기 위한 리그별 요령이에요.</p>
      {SPORTS.map((s) => (
        <section key={s.id} className="art-section">
          <h2>{s.name}</h2>
          {s.leagues.map((l) => {
            const info = INFO[l.id];
            return (
              <div key={l.id} className="league-box">
                <h3>
                  {l.name} {l.live ? <span className="tag live">볼 수 있어요</span> : <span className="tag">준비 중</span>}
                </h3>
                {info ? (
                  <>
                    <p>{info.what}</p>
                    <p>
                      <b>경기 방식</b> {info.format}
                    </p>
                    <p>
                      <b>노스포 요령</b> {info.tip}
                    </p>
                  </>
                ) : (
                  <p>하이라이트 연결을 준비하고 있어요. 미리 골라 두면 연결되는 대로 목록에 나와요.</p>
                )}
                {l.teams?.length ? <p className="teams">팀: {l.teams.map((t) => t.name).join(', ')}</p> : null}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
