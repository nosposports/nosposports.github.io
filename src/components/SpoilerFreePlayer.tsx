import { useEffect, useRef } from 'react';

interface Props {
  videoId: string;
  startAt: number;
  /** 값이 바뀔 때마다 재생 (0이면 대기) */
  playSignal: number;
  /** 값이 바뀔 때마다 일시정지 */
  pauseSignal: number;
  /** 부모가 iframe을 직접 전체화면으로 띄울 수 있게 iframe 요소를 넘겨준다 */
  onIframe: (el: HTMLIFrameElement | null) => void;
  /** 세트를 끝까지 봤을 때 (종료 직전 호출) */
  onFinished: () => void;
  /** 보던 위치 저장. 일시정지·화면 이탈·종료 때만 호출 (Storage 과다 호출 방지) */
  onPosition: (seconds: number) => void;
  onEmbedError: (code: number) => void;
  fullscreen: boolean;
}

const END_GUARD = 1.5; // 종료 n초 전에 정지 → 유튜브 종료 화면(추천 영상)이 뜨기 전에 닫음
const YT_ORIGIN = 'https://www.youtube.com';
const ST = { ENDED: 0, PLAYING: 1, PAUSED: 2 } as const;

/**
 * 유튜브 기본 UI를 그대로 쓰는 플레이어.
 * - 미리 불러오되 재생은 playSignal이 올 때만 (화면 밖에서 대기 → 썸네일이 보이지 않음)
 * - 외부 스크립트 없이 iframe + postMessage로만 통신 (앱인토스 체크리스트 21)
 * - 자막(CC)은 자동으로 끈다
 */
export function SpoilerFreePlayer(props: Props) {
  const { videoId, startAt, playSignal, pauseSignal, onIframe, fullscreen } = props;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const readyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const playingRef = useRef(false);
  const finishedRef = useRef(false);
  const captionsOffRef = useRef(false);
  const timeRef = useRef(startAt);
  const durRef = useRef(0);

  const cb = useRef(props);
  cb.current = props;

  const send = (func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args, id: 'nospo', channel: 'widget' }),
      YT_ORIGIN,
    );
  };

  const captionsOff = () => {
    send('unloadModule', ['captions']);
    send('unloadModule', ['cc']);
    send('setOption', ['captions', 'track', {}]);
  };

  /** 재생. 1.2초 안에 시작 안 되면(자동재생 차단) 음소거로 다시 시도 */
  const doPlay = () => {
    send('playVideo');
    window.setTimeout(() => {
      if (playingRef.current || finishedRef.current) return;
      send('mute');
      send('playVideo');
    }, 1200);
  };

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    send('stopVideo');
    cb.current.onPosition(0);
    cb.current.onFinished();
  };

  useEffect(() => {
    if (!playSignal) return;
    if (readyRef.current) doPlay();
    else pendingPlayRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playSignal]);

  useEffect(() => {
    if (pauseSignal) send('pauseVideo');
  }, [pauseSignal]);

  useEffect(() => {
    let listen: number | undefined;
    const handleState = (s: number) => {
      playingRef.current = s === ST.PLAYING;
      if (s === ST.PLAYING && !captionsOffRef.current) {
        captionsOffRef.current = true;
        captionsOff();
        window.setTimeout(captionsOff, 1500);
      }
      if (s === ST.PAUSED) cb.current.onPosition(timeRef.current);
      if (s === ST.ENDED) finish();
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== iframeRef.current?.contentWindow) return;
      let data: { event?: string; info?: unknown };
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data.event === 'onReady') {
        window.clearInterval(listen);
        readyRef.current = true;
        send('addEventListener', ['onStateChange']);
        send('addEventListener', ['onError']);
        captionsOff();
        if (pendingPlayRef.current) {
          pendingPlayRef.current = false;
          doPlay();
        }
      } else if (data.event === 'onStateChange' && typeof data.info === 'number') {
        handleState(data.info);
      } else if (data.event === 'onError') {
        cb.current.onEmbedError(Number(data.info));
      } else if (data.event === 'infoDelivery' && data.info && typeof data.info === 'object') {
        const info = data.info as { currentTime?: number; duration?: number; playerState?: number };
        if (typeof info.currentTime === 'number') timeRef.current = info.currentTime;
        if (typeof info.duration === 'number' && info.duration > 0) durRef.current = info.duration;
        if (typeof info.playerState === 'number') handleState(info.playerState);
        if (durRef.current > 0 && durRef.current - timeRef.current <= END_GUARD) finish();
      }
    };
    window.addEventListener('message', onMessage);
    listen = window.setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 'nospo', channel: 'widget' }),
        YT_ORIGIN,
      );
    }, 400);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearInterval(listen);
      if (!finishedRef.current && playingRef.current) cb.current.onPosition(timeRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const params = new URLSearchParams({
    enablejsapi: '1',
    controls: '1',
    rel: '0',
    playsinline: '1',
    fs: '1',
    iv_load_policy: '3',
    cc_load_policy: '0',
    autoplay: '0',
    start: String(Math.floor(startAt)),
  });
  if (window.location.origin && window.location.origin !== 'null') {
    params.set('origin', window.location.origin);
    params.set('widget_referrer', window.location.origin);
  }

  return (
    <div className={`player ${fullscreen ? 'fs' : ''}`}>
      <div className="player-frame">
        <iframe
          ref={(el) => {
            iframeRef.current = el;
            onIframe(el);
          }}
          src={`https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params}`}
          title="하이라이트 영상"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
