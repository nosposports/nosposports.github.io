import { useEffect, useMemo, useRef, useState } from 'react';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const kstToday = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const addDays = (d: string, n: number) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
const dowOf = (d: string) => new Date(`${d}T00:00:00Z`).getUTCDay();

interface Props {
  /** 날짜별 경기 수 */
  counts: Record<string, number>;
  value: string | null;
  onChange: (d: string | null) => void;
}

/** 날짜 띠(최근 2주) + 달력 버튼(한 달 보기). 경기가 있는 날에만 점이 찍힌다 */
export function DatePicker({ counts, value, onChange }: Props) {
  const today = kstToday();
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(today, i - 13)), [today]);
  const stripRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState((value ?? today).slice(0, 7));

  useEffect(() => {
    const el = stripRef.current;
    if (el) el.scrollLeft = el.scrollWidth; // 오늘이 보이게 오른쪽 끝으로
  }, []);

  const cells = useMemo(() => {
    const first = `${month}-01`;
    const start = addDays(first, -dowOf(first));
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [month]);
  const shiftMonth = (n: number) => {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    setMonth(d.toISOString().slice(0, 7));
  };
  const pick = (d: string | null) => {
    onChange(d);
    setOpen(false);
  };

  return (
    <div className="dp">
      <div className="dp-row">
        <button className={`dp-all ${value === null ? 'on' : ''}`} onClick={() => pick(null)}>
          전체
        </button>
        <div className="dp-strip" ref={stripRef}>
          {days.map((d) => {
            const n = counts[d] ?? 0;
            const dw = dowOf(d);
            return (
              <button
                key={d}
                className={`dp-day ${value === d ? 'on' : ''} ${d === today ? 'today' : ''} ${dw === 0 ? 'sun' : dw === 6 ? 'sat' : ''}`}
                disabled={!n}
                onClick={() => pick(d)}
                aria-label={`${Number(d.slice(5, 7))}월 ${Number(d.slice(8))}일 ${n}경기`}
              >
                <small>{d === today ? '오늘' : DOW[dw]}</small>
                <b>{Number(d.slice(8))}</b>
                <i className={n ? 'has' : ''} />
              </button>
            );
          })}
        </div>
        <button className={`dp-cal ${open ? 'on' : ''}`} aria-label="달력 열기" onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 20 20" aria-hidden>
            <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" fill="none" strokeWidth="1.8" />
            <path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="dp-pop" role="dialog" aria-label="날짜 고르기">
          <div className="dp-pop-head">
            <button onClick={() => shiftMonth(-1)} aria-label="이전 달">‹</button>
            <b>
              {Number(month.slice(0, 4))}년 {Number(month.slice(5))}월
            </b>
            <button onClick={() => shiftMonth(1)} aria-label="다음 달">›</button>
          </div>
          <div className="dp-grid">
            {DOW.map((w, i) => (
              <span key={w} className={`dp-w ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>{w}</span>
            ))}
            {cells.map((d) => {
              const n = counts[d] ?? 0;
              const inMonth = d.startsWith(month);
              return (
                <button
                  key={d}
                  className={`dp-c ${inMonth ? '' : 'out'} ${value === d ? 'on' : ''} ${d === today ? 'today' : ''}`}
                  disabled={!n}
                  onClick={() => pick(d)}
                >
                  {Number(d.slice(8))}
                  {n > 0 && <em>{n}</em>}
                </button>
              );
            })}
          </div>
          <p className="dp-note">숫자는 그날 올라온 경기 수예요. 결과는 표시하지 않아요.</p>
        </div>
      )}
    </div>
  );
}
