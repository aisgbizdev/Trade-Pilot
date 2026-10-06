import { describe, expect, it, vi, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppStoreBadges } from "../app-store-badges";
import { makeWrapper } from "@/pages/__tests__/test-helpers";

afterEach(() => vi.unstubAllGlobals());

describe("AppStoreBadges", () => {
  it("links to the real App Store and Play Store listings and fires outbound-click tracking", async () => {
    const sendBeacon = vi.fn(() => true);
    vi.stubGlobal("navigator", { ...navigator, sendBeacon });

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AppStoreBadges placement="profile-cta" />
      </Wrapper>,
    );

    const appStoreLink = screen.getByTestId("link-download-app-store");
    const playStoreLink = screen.getByTestId("link-download-play-store");
    expect(appStoreLink).toHaveAttribute("href", "https://apps.apple.com/id/app/tradepilot-id/id6807276937");
    expect(appStoreLink).toHaveAttribute("target", "_blank");
    expect(appStoreLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(playStoreLink).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=id.tradepilot.app&pcampaignid=web_share",
    );

    // jsdom's Blob doesn't implement .text()/.arrayBuffer() — read back the
    // raw string each Blob was constructed from instead, via a spy on the
    // Blob constructor itself.
    const blobParts: string[] = [];
    const RealBlob = globalThis.Blob;
    vi.stubGlobal(
      "Blob",
      class extends RealBlob {
        constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
          super(parts, options);
          blobParts.push(String(parts?.[0] ?? ""));
        }
      },
    );

    fireEvent.click(appStoreLink);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(JSON.parse(blobParts[0]!)).toMatchObject({ placement: "profile-cta", target: "app-store" });

    fireEvent.click(playStoreLink);
    expect(sendBeacon).toHaveBeenCalledTimes(2);
    expect(JSON.parse(blobParts[1]!)).toMatchObject({ placement: "profile-cta", target: "play-store" });
  });
});
