/** 웹사이트 경로 이동 (#/ 없는 실제 주소). 링크·뒤로가기 모두 이 모듈을 거친다 */
type Fn = () => void;
const subs = new Set<Fn>();

export const currentPath = () => {
  const p = window.location.pathname.replace(/\/+$/, '').replace(/^\//, '');
  return p;
};

export function navigate(to: string) {
  const url = to.startsWith('/') ? to : `/${to}`;
  if (url === window.location.pathname) return;
  window.history.pushState({ route: url }, '', url);
  subs.forEach((f) => f());
}

export function onRoute(f: Fn) {
  subs.add(f);
  const pop = () => f();
  window.addEventListener('popstate', pop);
  return () => {
    subs.delete(f);
    window.removeEventListener('popstate', pop);
  };
}

/** 예전 #/about 형태 주소로 들어오면 /about 으로 바꿔 준다 */
export function migrateHash() {
  const m = window.location.hash.match(/^#\/(\w+)/);
  if (m) window.history.replaceState(null, '', `/${m[1]}`);
}
