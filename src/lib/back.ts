/**
 * 뒤로가기 우선 처리 스택.
 * 전체화면처럼 화면 안의 상태를 먼저 닫아야 할 때 handler를 등록하면,
 * App의 backEvent가 화면 이동보다 먼저 이 handler를 실행한다.
 */
const stack: (() => void)[] = [];

export function pushBackHandler(fn: () => void): () => void {
  stack.push(fn);
  return () => {
    const i = stack.lastIndexOf(fn);
    if (i >= 0) stack.splice(i, 1);
  };
}

/** 등록된 handler가 있으면 실행하고 true */
export function runBackHandler(): boolean {
  const fn = stack.at(-1);
  if (!fn) return false;
  fn();
  return true;
}
