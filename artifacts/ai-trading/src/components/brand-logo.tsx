import { type HTMLAttributes } from "react";

interface BrandLogoProps extends HTMLAttributes<HTMLDivElement | HTMLImageElement> {
  variant?: "horizontal" | "compact";
}

export function BrandLogo({
  className,
  variant = "compact",
  ...props
}: BrandLogoProps) {
  if (variant === "horizontal") {
    return (
      <div className="flex items-center gap-2 md:gap-2.5" data-testid="brand-logo" {...(props as any)}>
        <img src="/logo-compact.png" alt="Trade Pilot Icon" className={`object-contain shrink-0 ${className || ""}`} />
        <div className="flex flex-col justify-center">
          <span className="text-base md:text-lg font-extrabold tracking-tight leading-none text-inherit">
            Trade Pilot
          </span>
          <span className="text-[8px] md:text-[9px] font-bold text-primary uppercase tracking-[0.2em] leading-none mt-1">
            Universe Comes To Us.
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src="/logo-compact.png"
      alt="Trade Pilot"
      className={`object-contain ${className || ""}`}
      data-testid="brand-logo"
      {...(props as any)}
    />
  );
}
