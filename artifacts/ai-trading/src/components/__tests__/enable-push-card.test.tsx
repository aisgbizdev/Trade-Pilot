/**
 * Component test for the dashboard's "Enable notifications" card
 * (`src/components/enable-push-card.tsx`).
 *
 * The card is the only on-screen surface that asks a user to turn on
 * push, so it has strict UX contracts: never auto-prompt the OS
 * permission dialog, never re-pop after dismissal (sticky in
 * localStorage), hide entirely once the user is subscribed / has
 * blocked permission / is on an unsupported browser. On iOS Safari it
 * has to swap the "Enable" button for the Add-to-Home-Screen recipe
 * because push only works for installed PWAs there.
 *
 * The hooks `usePush`, `useStandalone`, and `useInstallPrompt` are
 * mocked at module-load via `vi.hoisted` shared state so each test
 * can flip a single field and assert the resulting render branch.
 */
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

// Hoisted shared state so the `vi.mock` factories below can read /
// write live values that each test mutates in `beforeEach`.
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
  // Provider is only used at the app root; tests render the card in
  // isolation, so the no-op fallback in the real hook is fine. We
  // still re-export it as a passthrough so any incidental import does
  // not blow up.
  InstallPromptProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// IMPORTANT: import the component AFTER the mocks above so it picks
// up the mocked hooks on its first module-load.
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
  // Reset to a "fresh, push-capable, signed-in user on a non-iOS
  // browser, never prompted, never dismissed" baseline before every
  // test.
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
  it("renders the Enable button on a push-capable browser when the user is unsubscribed", () => {
    renderCard();
    expect(screen.getByTestId("card-enable-push")).toBeInTheDocument();
    expect(screen.getByTestId("button-enable-push")).toBeInTheDocument();
  });

  it("hides itself entirely once the user is already subscribed", () => {
    state.push = "subscribed";
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId("card-enable-push")).not.toBeInTheDocument();
  });

  it("hides itself when the OS-level permission has been denied (no point re-prompting)", () => {
    state.push = "denied";
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });

  it("hides on browsers where push is genuinely unsupported AND the user is not on iOS", () => {
    state.push = "unsupported";
    state.isIos = false;
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });

  it("respects a sticky dismissal stored in localStorage and does not re-render", () => {
    localStorage.setItem(DISMISS_KEY, "1");
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });

  it("clicking the dismiss button hides the card and persists the choice", () => {
    renderCard();
    const dismiss = screen.getByTestId("button-dismiss-enable-push");
    fireEvent.click(dismiss);
    expect(screen.queryByTestId("card-enable-push")).not.toBeInTheDocument();
    expect(localStorage.getItem(DISMISS_KEY)).toBe("1");
  });
});

describe("EnablePushCard: never auto-prompts", () => {
  it("never calls subscribe() on mount — only when the user explicitly taps Enable", () => {
    renderCard();
    // Critical contract: Chrome down-ranks sites that ask for the
    // permission dialog without a user gesture. Mount must be silent.
    expect(subscribeMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("button-enable-push"));
    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state on the Enable button while the subscribe request is in flight", () => {
    state.push = "requesting";
    renderCard();
    const btn = screen.getByTestId("button-enable-push");
    expect(btn).toBeDisabled();
  });

  it("surfaces the error helper text when the subscribe attempt fails", () => {
    state.push = "error";
    renderCard();
    expect(screen.getByTestId("text-enable-push-error")).toBeInTheDocument();
  });
});

describe("EnablePushCard: iOS Add-to-Home-Screen recipe", () => {
  it("on iOS Safari in a regular tab, swaps the Enable button for the Share→Add to Home Screen steps", () => {
    state.push = "unsupported";
    state.isIos = true;
    state.standalone = false;
    renderCard();
    expect(screen.getByTestId("card-enable-push")).toBeInTheDocument();
    expect(screen.getByTestId("ios-install-steps")).toBeInTheDocument();
    // The OS-prompt button must NOT render in this branch — tapping
    // it on iOS Safari would silently fail.
    expect(screen.queryByTestId("button-enable-push")).not.toBeInTheDocument();
  });

  it("hides the iOS recipe once the app is running standalone (already added to Home Screen)", () => {
    // Standalone iOS but still unsupported / not yet subscribed: nothing
    // useful to offer, so the card should disappear instead of telling
    // the user to install something they already installed.
    state.push = "unsupported";
    state.isIos = true;
    state.standalone = true;
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });
});

describe("EnablePushCard: install button (Chromium beforeinstallprompt)", () => {
  it("only renders the Install button after `beforeinstallprompt` has been captured by the provider", () => {
    state.canInstall = false;
    renderCard();
    expect(screen.queryByTestId("button-install-pwa")).not.toBeInTheDocument();
  });

  it("renders the Install button when the install prompt is available and the app is not standalone", () => {
    state.canInstall = true;
    state.standalone = false;
    renderCard();
    expect(screen.getByTestId("button-install-pwa")).toBeInTheDocument();
  });

  it("calls the deferred install prompt only on explicit click", () => {
    state.canInstall = true;
    renderCard();
    expect(promptMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("button-install-pwa"));
    expect(promptMock).toHaveBeenCalledTimes(1);
  });

  it("hides the Install button once the app is already running standalone (already installed)", () => {
    state.canInstall = true;
    state.standalone = true;
    renderCard();
    expect(screen.queryByTestId("button-install-pwa")).not.toBeInTheDocument();
  });
});
