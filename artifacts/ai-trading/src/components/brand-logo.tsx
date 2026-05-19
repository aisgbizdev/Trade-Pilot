import { type ImgHTMLAttributes } from "react";

export function BrandLogo({
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/trade-pilot-logo-3.png"
      alt="Trade Pilot"
      className={className}
      data-testid="brand-logo"
      {...props}
    />
  );
}
