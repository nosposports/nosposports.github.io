const EMAIL = 'econoscope@gmail.com';

export function Contact() {
  return (
    <div className="page article">
      <h1 className="title">문의</h1>
      <p className="sub">궁금한 점이나 요청이 있으면 이메일로 보내 주세요.</p>
      <section className="art-section">
        <h2>이메일</h2>
        <p>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <p>보통 2~3일 안에 답장드려요.</p>
      </section>
      <section className="art-section">
        <h2>이런 내용을 보내 주세요</h2>
        <ul>
          <li><b>오류 제보</b> — 영상이 재생되지 않거나, 결과가 보이는 문제가 있을 때</li>
          <li><b>리그·팀 추가 요청</b> — 보고 싶은 리그나 대회가 있을 때</li>
          <li><b>저작권 관련 요청</b> — 권리자께서 특정 영상의 노출 중단을 원하시면 확인 후 바로 목록에서 제외해요</li>
          <li><b>제휴·광고 문의</b></li>
        </ul>
      </section>
    </div>
  );
}
