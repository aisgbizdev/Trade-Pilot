import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { MarketSessionsBadge } from "../market-sessions-badge";
import { LanguageProvider } from "@/lib/i18n";

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe("MarketSessionsBadge", () => {
  it("renders the London/NY overlap label with highest-liquidity hint", () => {
    // Wed 2026-05-27 15:00 UTC — London + NY overlap window.
    render(
      <Wrapper>
        <MarketSessionsBadge now={new Date("2026-05-27T15:00:00Z")} />
      </Wrapper>,
    );
    const badge = screen.getByTestId("market-sessions-badge");
    expect(badge.textContent).toContain("London");
    expect(badge.textContent).toContain("New York");
    expect(badge.textContent?.toLowerCase()).toContain("highest liquidity");
  });

  it("keeps the badge compact and reveals market context on demand", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <MarketSessionsBadge now={new Date("2026-05-27T15:00:00Z")} />
      </Wrapper>,
    );

    expect(screen.queryByTestId("market-sessions-info")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Learn about market sessions" }),
    );

    const info = screen.getByTestId("market-sessions-info");
    expect(info).toHaveTextContent("global market sessions");
    expect(info).toHaveTextContent("Gold, forex");
    expect(info).toHaveTextContent("not a trading signal");
  });

  it("explains why crypto does not use FX session times", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <MarketSessionsBadge instrument="BTC/USD" />
      </Wrapper>,
    );

    expect(screen.getByTestId("market-sessions-badge")).toHaveTextContent(
      "Crypto · 24/7",
    );
    await user.click(
      screen.getByRole("button", { name: "Learn about market sessions" }),
    );
    expect(screen.getByTestId("market-sessions-info")).toHaveTextContent(
      "Crypto trades 24/7",
    );
  });

  it("renders 'Market closed' on weekends", () => {
    render(
      <Wrapper>
        <MarketSessionsBadge now={new Date("2026-05-30T12:00:00Z")} />
      </Wrapper>,
    );
    const badge = screen.getByTestId("market-sessions-badge");
    expect(badge.textContent).toContain("Market closed");
    // Next event is Sydney opening Sunday 22:00 UTC.
    expect(badge.textContent).toContain("Sydney");
    expect(badge.textContent?.toLowerCase()).toContain("opens in");
  });
});
