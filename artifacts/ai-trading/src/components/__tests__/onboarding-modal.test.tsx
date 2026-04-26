/**
 * Component test for the OnboardingModal
 * (`src/components/onboarding-modal.tsx`).
 *
 * The OnboardingModal is the only "page" the task refers to as
 * `onboarding.tsx` — there is no standalone onboarding route in the
 * codebase. The modal is mounted by the Dashboard whenever the local
 * `ai_trading_onboarding_done_<userId>` flag is unset (see
 * `pages/dashboard.tsx`).
 *
 * Coverage:
 * - happy-path render: the first step's title shows, the Skip + Next
 *   CTAs are mounted, the dialog opens.
 * - branching state: clicking Next three times advances to the last
 *   step, which swaps Next for the Get-Started CTA and hides Skip.
 * - user action: clicking Get-Started persists the
 *   `ai_trading_onboarding_done_<userId>` flag and dispatches the
 *   `onboarding-complete` window event the Dashboard listens for.
 *
 * No fetches are made by this component, but `installFetchMock` is
 * still installed so the strict harness fails fast if the modal ever
 * starts touching the network in a refactor.
 */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  OnboardingModal,
  getOnboardingKey,
  isOnboardingDone,
} from "../onboarding-modal";
import {
  TEST_USER,
  installFetchMock,
  makeWrapper,
} from "../../pages/__tests__/test-helpers";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("OnboardingModal: happy-path render", () => {
  it("opens with the first step's title, exposes both Skip and Next CTAs and does not yet show the finish CTA", async () => {
    installFetchMock();
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <OnboardingModal open userId={TEST_USER.id} />
      </Wrapper>,
    );

    // The Dialog is portal-rendered into document.body — `screen`
    // queries the whole document so the testid lookups still work.
    expect(
      await screen.findByTestId("button-skip-onboarding"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("button-next-onboarding"),
    ).toBeInTheDocument();

    // Last-step CTA is not mounted while we are on step 0.
    expect(
      screen.queryByTestId("button-finish-onboarding"),
    ).not.toBeInTheDocument();

    // The first step's title (from the EN locale) renders.
    expect(screen.getByText(/Welcome to Trade Pilot/i)).toBeInTheDocument();
  });
});

describe("OnboardingModal: last-step branch", () => {
  it("swaps Next for Get-Started and hides Skip after advancing through all the steps", async () => {
    installFetchMock();
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <OnboardingModal open userId={TEST_USER.id} />
      </Wrapper>,
    );

    // The locale ships four steps; click Next three times to land on
    // the last one. Re-query the next button each iteration because
    // the CTA's testid switches to `button-finish-onboarding` on the
    // final step.
    for (let i = 0; i < 3; i += 1) {
      const next = await screen.findByTestId("button-next-onboarding");
      await act(async () => {
        fireEvent.click(next);
      });
    }

    // On the last step Next is replaced by the finish CTA.
    expect(
      await screen.findByTestId("button-finish-onboarding"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("button-next-onboarding"),
    ).not.toBeInTheDocument();

    // Skip is suppressed on the last step (only the finish CTA remains).
    expect(
      screen.queryByTestId("button-skip-onboarding"),
    ).not.toBeInTheDocument();
  });
});

describe("OnboardingModal: user actions", () => {
  it("persists the per-user onboarding flag and dispatches the 'onboarding-complete' window event when the finish CTA is clicked", async () => {
    installFetchMock();
    const { Wrapper } = makeWrapper();

    const onComplete = vi.fn();
    window.addEventListener("onboarding-complete", onComplete);

    render(
      <Wrapper>
        <OnboardingModal open userId={TEST_USER.id} />
      </Wrapper>,
    );

    // Sanity: the flag is unset before the user interacts.
    expect(isOnboardingDone(TEST_USER.id)).toBe(false);
    expect(localStorage.getItem(getOnboardingKey(TEST_USER.id))).toBeNull();

    // Walk to the last step.
    for (let i = 0; i < 3; i += 1) {
      const next = await screen.findByTestId("button-next-onboarding");
      await act(async () => {
        fireEvent.click(next);
      });
    }

    const finish = await screen.findByTestId("button-finish-onboarding");
    await act(async () => {
      fireEvent.click(finish);
    });

    // The completion side-effects fire: localStorage gets the per-user
    // key (so the Dashboard stops re-mounting the modal) and the
    // window event is dispatched (so the Dashboard can react in real
    // time without polling).
    await waitFor(() => {
      expect(localStorage.getItem(getOnboardingKey(TEST_USER.id))).toBe("1");
      expect(isOnboardingDone(TEST_USER.id)).toBe(true);
      expect(onComplete).toHaveBeenCalled();
    });

    window.removeEventListener("onboarding-complete", onComplete);
  });

  it("also persists the onboarding flag when the user clicks Skip on a non-last step", async () => {
    installFetchMock();
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <OnboardingModal open userId={TEST_USER.id} />
      </Wrapper>,
    );

    const skip = await screen.findByTestId("button-skip-onboarding");
    await act(async () => {
      fireEvent.click(skip);
    });

    // Skip routes through the same `handleComplete` as the finish CTA
    // — it must therefore persist the flag too.
    await waitFor(() => {
      expect(localStorage.getItem(getOnboardingKey(TEST_USER.id))).toBe("1");
    });
  });
});
