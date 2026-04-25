import { type SVGProps } from "react";

export function BrandLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      role="img"
      aria-label="Trade Pilot"
      data-testid="brand-logo"
      {...props}
    >
      <defs>
        <linearGradient id="tpBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <g fill="url(#tpBrandGrad)">
        <path d="M3 9 Q3 6 6 6 H30 Q33 6 33 9 V14 Q33 17 30 17 H22 V52 Q22 56 18 56 Q14 56 14 52 V17 H6 Q3 17 3 14 Z" />
        <path d="M36 10 Q36 6 40 6 Q44 6 44 10 V52 Q44 56 40 56 Q36 56 36 52 Z" />
      </g>
      <path
        d="M44 11 H50 Q61 11 61 22 Q61 33 50 33 H44"
        stroke="url(#tpBrandGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
