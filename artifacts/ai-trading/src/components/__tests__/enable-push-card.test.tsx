import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LanguageProvider } from "@/lib/i18n";

const { state, subscribeMock, promptMock } = vi.hoisted(() => ({
  state: {
    push: "default" as
      | "unsupported"
      | "denied"
      | "default"
      | "subscribed"
      | "requesting"
      | "error",
    standalone: false,
    isIos: false,
    canInstall: false,
  },
  subscribeMock: vi.fn(async () => {}),
  promptMock: vi.fn(async () => "accepted" as const),
}));

vi.mock("@/hooks/use-push", () => ({
  usePush: () => ({
    state: state.push,
    subscription: null,
    subscribe: subscribeMock,
    unsubscribe: vi.fn(async () => {}),
  }),
}));

vi.mock("@/hooks/use-standalone", () => ({
  useStandalone: () => ({ standalone: state.standalone, isIos: state.isIos }),
}));

vi.mock("@/hooks/use-install-prompt", () => ({
  useInstallPrompt: () => ({ canInstall: state.canInstall, prompt: promptMock }),
  InstallPromptProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { EnablePushCard } from "../enable-push-card";

const DISMISS_KEY = "tp_enable_push_dismissed";

function renderCard() {
  return render(
    <LanguageProvider>
      <EnablePushCard />
    </LanguageProvider>,
  );
}

beforeEach(() => {
  state.push = "default";
  state.standalone = false;
  state.isIos = false;
  state.canInstall = false;
  subscribeMock.mockClear();
  promptMock.mockClear();
  localStorage.removeItem(DISMISS_KEY);
});

afterEach(() => {
  localStorage.removeItem(DISMISS_KEY);
});

describe("EnablePushCard: visibility lifecycle", () => {
  it("renders Enable button on a push-capable browser when unsubscribed", () => {
    renderCard();
    expect(screen.getByTestId("card-enable-push")).toBeInTheDocument();
    expect(screen.getByTestId("button-enable-push")).toBeInTheDocument();
  });

  it("hides when already subscribed", () => {
    state.push = "subscribed";
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });

  it("hides when permission was denied", () => {
    state.push = "denied";
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });

  it("hides on unsupported browsers when not on iOS", () => {
    state.push = "unsupported";
    state.isIos = false;
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });

  it("respects sticky localStorage dismissal", () => {
    localStorage.setItem(DISMISS_KEY, "1");
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });

  it("clicking dismiss hides the card and persists the choice", () => {
    renderCard();
    fireEvent.click(screen.getByTestId("button-dismiss-enable-push"));
    expect(screen.queryByTestId("card-enable-push")).not.toBeInTheDocument();
    expect(localStorage.getItem(DISMISS_KEY)).toBe("1");
  });
});

describe("EnablePushCard: never auto-prompts", () => {
  it("does not call subscribe() on mount; only on explicit click", () => {
    renderCard();
    expect(subscribeMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("button-enable-push"));
    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });

  it("disables Enable button while the subscribe request is in flight", () => {
    state.push = "requesting";
    renderCard();
    expect(screen.getByTestId("button-enable-push")).toBeDisabled();
  });

  it("surfaces error helper text when subscribe fails", () => {
    state.push = "error";
    renderCard();
    expect(screen.getByTestId("text-enable-push-error")).toBeInTheDocument();
  });
});

describe("EnablePushCard: iOS Add-to-Home-Screen recipe", () => {
  it("on iOS in a regular tab, swaps Enable button for the install steps", () => {
    state.push = "unsupported";
    state.isIos = true;
    state.standalone = false;
    renderCard();
    expect(screen.getByTestId("ios-install-steps")).toBeInTheDocument();
    expect(screen.queryByTestId("button-enable-push")).not.toBeInTheDocument();
  });

  it("hides entirely when iOS app is already running standalone", () => {
    state.push = "unsupported";
    state.isIos = true;
    state.standalone = true;
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });
});

describe("EnablePushCard: install button (Chromium beforeinstallprompt)", () => {
  it("hides the Install button when no deferred prompt is available", () => {
    state.canInstall = false;
    renderCard();
    expect(screen.queryByTestId("button-install-pwa")).not.toBeInTheDocument();
  });

  it("renders the Install button when canInstall && !standalone", () => {
    state.canInstall = true;
    state.standalone = false;
    renderCard();
    expect(screen.getByTestId("button-install-pwa")).toBeInTheDocument();
  });

  it("calls the deferred prompt only on explicit click", () => {
    state.canInstall = true;
    renderCard();
    expect(promptMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("button-install-pwa"));
    expect(promptMock).toHaveBeenCalledTimes(1);
  });

  it("hides the Install button when the app is already standalone", () => {
    state.canInstall = true;
    state.standalone = true;
    renderCard();
    expect(screen.queryByTestId("button-install-pwa")).not.toBeInTheDocument();
  });
});
