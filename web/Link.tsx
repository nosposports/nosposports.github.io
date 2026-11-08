import type { MouseEvent, ReactNode } from 'react';
import { navigate } from './nav';

/** signal: 같은 주소에서 눌러도 화면을 바꾸도록 보내는 신호 (예: 'nospo-home' = 첫 화면, 'nospo-list' = 경기 목록) */
export function Link({ to, children, className, signal }: { to: string; children: ReactNode; className?: string; signal?: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to, signal === 'nospo-home' ? { home: true } : undefined);
    if (signal) window.dispatchEvent(new Event(signal));
    window.scrollTo(0, 0);
  };
  return (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
