import type { ReactNode } from 'react';

/* 웹사이트 빌드용: TDS Button/Badge를 같은 모양의 일반 요소로 대체 */
export function Button(p: {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  display?: string;
  size?: string;
  variant?: string;
}) {
  return (
    <button
      className={`w-btn ${p.variant === 'weak' ? 'weak' : 'fill'} ${p.size ?? 'large'} ${p.display ?? ''}`}
      onClick={p.onClick}
      disabled={p.disabled}
    >
      {p.children}
    </button>
  );
}

export function Badge(p: { children?: ReactNode; className?: string; color?: string; size?: string; variant?: string }) {
  return <span className={`w-badge ${p.color ?? ''} ${p.className ?? ''}`}>{p.children}</span>;
}
