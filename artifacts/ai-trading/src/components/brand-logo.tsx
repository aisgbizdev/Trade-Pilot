import { type ImgHTMLAttributes } from "react";

interface BrandLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: "horizontal" | "compact";
}

export function BrandLogo({
  className,
  variant = "compact",
  ...props
}: BrandLogoProps) {
  const src = variant === "horizontal"
    ? "/logo-horizontal.png"
    : "/logo-compact.png";

  return (
    <img
      src={src}
      alt="Trade Pilot"
      className={`object-contain ${className || ""}`}
      data-testid="brand-logo"
      {...props}
    />
  );
}
