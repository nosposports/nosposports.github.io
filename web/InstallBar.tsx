import { useEffect, useState } from 'react';

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

let deferred: BIPEvent | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BIPEvent;
    window.dispatchEvent(new Event('nospo-installable'));
  });
}

function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function platform(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

/** 맨 아래 "홈 화면에 추가" 안내 */
export function InstallBar() {
  const [hidden, setHidden] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [guide, setGuide] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    if (isStandalone()) return setHidden(true);
    setOs(platform());
    setCanPrompt(!!deferred);
    const on = () => setCanPrompt(true);
    const done = () => setHidden(true);
    window.addEventListener('nospo-installable', on);
    window.addEventListener('appinstalled', done);
    return () => {
      window.removeEventListener('nospo-installable', on);
      window.removeEventListener('appinstalled', done);
    };
  }, []);

  if (hidden) return null;

  const click = async () => {
    if (deferred) {
      await deferred.prompt();
      const r = await deferred.userChoice.catch(() => null);
      deferred = null;
      setCanPrompt(false);
      if (r?.outcome === 'accepted') setHidden(true);
      return;
    }
    setGuide((g) => !g);
  };

  return (
    <section className="install-bar" aria-label="홈 화면에 추가">
      <div className="ib-row">
        <img src="/icon-192.png" alt="" width={52} height={52} />
        <div className="ib-text">
          <strong>노스포를 앱처럼 쓰기</strong>
          <span>아이콘 한 번 누르면 바로 열려요. 무료·가입 없음</span>
        </div>
        <button className="ib-btn" onClick={click}>
          {canPrompt ? '앱 설치' : '홈 화면에 추가'}
        </button>
      </div>
      {guide && (
        <ol className="ib-guide">
          {os === 'ios' ? (
            <>
              <li>Safari 아래쪽 <b>공유 버튼</b>(네모에 위 화살표)을 눌러요</li>
              <li>목록에서 <b>홈 화면에 추가</b>를 골라요</li>
              <li>오른쪽 위 <b>추가</b>를 누르면 끝!</li>
            </>
          ) : os === 'android' ? (
            <>
              <li>크롬 오른쪽 위 <b>⋮ 메뉴</b>를 눌러요</li>
              <li><b>홈 화면에 추가</b> 또는 <b>앱 설치</b>를 골라요</li>
              <li><b>설치</b>를 누르면 홈 화면에 노스포 아이콘이 생겨요</li>
            </>
          ) : (
            <>
              <li>휴대폰으로 <b>nospo.kr</b>에 들어가요</li>
              <li>아이폰은 Safari <b>공유 → 홈 화면에 추가</b></li>
              <li>안드로이드는 크롬 <b>⋮ → 홈 화면에 추가</b></li>
            </>
          )}
        </ol>
      )}
    </section>
  );
}
