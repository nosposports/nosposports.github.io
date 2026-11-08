/** 종목 아이콘 (직접 그린 단순 도형) */
export function SportIcon({ id }: { id: string }) {
  switch (id) {
    case 'esports':
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <rect x="6" y="14" width="36" height="22" rx="11" fill="#3182f6" />
          <rect x="15" y="20" width="2" height="10" rx="1" fill="#fff" />
          <rect x="11" y="24" width="10" height="2" rx="1" fill="#fff" />
          <circle cx="31" cy="22" r="2.2" fill="#fff" />
          <circle cx="35" cy="27" r="2.2" fill="#fff" />
        </svg>
      );
    case 'baseball':
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r="17" fill="#fff" stroke="#d1d6db" strokeWidth="2" />
          <path d="M14 12c5 6 5 18 0 24M34 12c-5 6-5 18 0 24" fill="none" stroke="#f04452" strokeWidth="2.2" strokeDasharray="3 2.5" />
        </svg>
      );
    case 'basketball':
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r="17" fill="#fe9800" />
          <path d="M7 24h34M24 7v34M12 12c6 6 6 18 0 24M36 12c-6 6-6 18 0 24" fill="none" stroke="#7a4300" strokeWidth="1.8" />
        </svg>
      );
    case 'volleyball':
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r="17" fill="#ffd43b" />
          <path d="M24 7c-4 8-4 18 4 26M10 16c8 0 16 4 22 14M38 14c-8 2-14 8-16 18" fill="none" stroke="#3182f6" strokeWidth="2.2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r="17" fill="#fff" stroke="#191f28" strokeWidth="2" />
          <path d="M24 17l6 4.5-2.3 7h-7.4L18 21.5z" fill="#191f28" />
          <path d="M24 17V8M30 21.5l8-3M27.7 28.5l5 7M20.3 28.5l-5 7M18 21.5l-8-3" stroke="#191f28" strokeWidth="1.6" />
        </svg>
      );
  }
}
