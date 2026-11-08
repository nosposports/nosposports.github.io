export function Privacy() {
  return (
    <div className="page article">
      <h1 className="title">개인정보처리방침</h1>
      <p className="sub">시행일: 2026년 11월 8일</p>
      <section className="art-section">
        <h2>1. 수집하는 개인정보</h2>
        <p>노스포스포츠는 회원가입이 없으며, 이름·연락처 등 개인을 식별할 수 있는 정보를 수집하지 않아요.</p>
      </section>
      <section className="art-section">
        <h2>2. 기기에 저장되는 정보</h2>
        <p>
          고른 리그·팀, 시청한 세트, 보던 위치는 이용자의 브라우저(로컬 저장소)에만 저장되고 서버로 보내지 않아요. 브라우저
          데이터를 지우면 함께 삭제돼요.
        </p>
      </section>
      <section className="art-section">
        <h2>3. 유튜브 영상</h2>
        <p>
          영상은 YouTube 임베드 플레이어로 재생되며, 재생 시 YouTube(Google)가 쿠키 등을 사용할 수 있어요. 자세한 내용은{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google 개인정보처리방침</a>과{' '}
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">YouTube 서비스 약관</a>을 참고하세요.
        </p>
      </section>
      <section className="art-section">
        <h2>4. 방문 통계</h2>
        <p>
          서비스 개선을 위해 Google 애널리틱스로 방문 통계(본 페이지, 방문 경로, 기기 종류 등)를 수집해요. 개인을 알아볼 수 있는
          정보는 수집하지 않으며, Google이 쿠키를 사용할 수 있어요. 원하지 않으면{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">Google 애널리틱스 차단 부가기능</a>을
          쓰거나 브라우저에서 쿠키를 차단할 수 있어요.
        </p>
      </section>
      <section className="art-section">
        <h2>5. 제3자 광고</h2>
        <p>
          이 사이트는 Google AdSense 등 제3자 광고 서비스를 이용해 광고를 게재할 수 있어요. 광고 사업자는 쿠키를 사용해 이용자의
          이 사이트 및 다른 사이트 방문 정보를 바탕으로 광고를 보여줄 수 있어요. 맞춤 광고는{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">Google 광고 설정</a>에서 끌 수 있어요. 자세한
          내용은{' '}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">Google 광고 정책</a>을 참고하세요.
        </p>
      </section>
      <section className="art-section">
        <h2>6. 변경</h2>
        <p>방침이 바뀌면 이 페이지에 시행일과 함께 알려드려요.</p>
      </section>
    </div>
  );
}
