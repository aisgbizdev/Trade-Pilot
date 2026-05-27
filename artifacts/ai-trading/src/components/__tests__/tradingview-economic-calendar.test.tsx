import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";

import { TradingViewEconomicCalendar } from "../tradingview-economic-calendar";
import { LanguageProvider } from "@/lib/i18n";

vi.mock("@/components/theme-provider", () => ({
  useTheme: () => ({ theme: "light" }),
}));

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe("TradingViewEconomicCalendar countryFilter", () => {
  it("forwards countryFilter into the widget script config", () => {
    const { container } = render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} countryFilter="us,eu" />
      </Wrapper>,
    );
    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    const config = JSON.parse(script!.textContent ?? "{}");
    expect(config.countryFilter).toBe("us,eu");
    const host = container.querySelector(
      '[data-testid="tradingview-economic-calendar"]',
    ) as HTMLElement;
    expect(host.getAttribute("data-country-filter")).toBe("us,eu");
  });

  it("omits countryFilter from the script config when empty", () => {
    const { container } = render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} countryFilter="" />
      </Wrapper>,
    );
    const script = container.querySelector("script");
    const config = JSON.parse(script!.textContent ?? "{}");
    expect("countryFilter" in config).toBe(false);
  });

  it("re-initializes the widget script when countryFilter changes", () => {
    const { container, rerender } = render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} countryFilter="us" />
      </Wrapper>,
    );
    const firstScript = container.querySelector("script");
    expect(firstScript).not.toBeNull();
    const firstConfig = JSON.parse(firstScript!.textContent ?? "{}");
    expect(firstConfig.countryFilter).toBe("us");

    rerender(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} countryFilter="jp,gb" />
      </Wrapper>,
    );

    const secondScript = container.querySelector("script");
    expect(secondScript).not.toBeNull();
    // The widget should be torn down and rebuilt with the new config.
    expect(secondScript).not.toBe(firstScript);
    const secondConfig = JSON.parse(secondScript!.textContent ?? "{}");
    expect(secondConfig.countryFilter).toBe("jp,gb");
    const host = container.querySelector(
      '[data-testid="tradingview-economic-calendar"]',
    ) as HTMLElement;
    expect(host.getAttribute("data-country-filter")).toBe("jp,gb");
  });
});
