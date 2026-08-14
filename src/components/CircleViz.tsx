import type { RefObject } from 'react';

// Kružna vizualizacija: prsten napretka + točka po obodu + broj u sredini.
// Oznake četvrtina/polovice su vrlo suptilne (hairline); polovica (6h) tek
// neznatno jača. Vidi docs/specifikacije/dizajn-i-stil.md.
export function CircleViz({
  ringRef,
  dotRef,
  numRef,
  color = '#2B9CAD',
}: {
  ringRef: RefObject<SVGCircleElement>;
  dotRef: RefObject<SVGCircleElement>;
  numRef: RefObject<HTMLDivElement>;
  color?: string;
}) {
  return (
    <div className="relative mx-auto" style={{ width: 240, maxWidth: '72vw' }}>
      <svg viewBox="0 0 240 240" width="100%" aria-hidden="true">
        <circle
          cx="120"
          cy="120"
          r="90"
          fill="none"
          className="stroke-border-light dark:stroke-border-dark"
          strokeWidth="6"
        />
        <circle
          ref={ringRef}
          cx="120"
          cy="120"
          r="90"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          transform="rotate(-90 120 120)"
        />
        <g
          className="stroke-text-secondary dark:stroke-text-secondary-dark"
          strokeLinecap="round"
          opacity="0.3"
        >
          <line x1="120" y1="35" x2="120" y2="29" strokeWidth="1" />
          <line x1="205" y1="120" x2="211" y2="120" strokeWidth="1" />
          <line x1="35" y1="120" x2="29" y2="120" strokeWidth="1" />
          <line x1="120" y1="205" x2="120" y2="213" strokeWidth="1.4" opacity="1.4" />
        </g>
        <circle ref={dotRef} cx="120" cy="30" r="9" fill={color} />
      </svg>
      <div
        ref={numRef}
        className="absolute inset-0 flex items-center justify-center text-[40px] font-medium tabular-nums text-text-primary dark:text-text-primary-dark"
      >
        –
      </div>
    </div>
  );
}
