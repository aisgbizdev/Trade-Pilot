import { expect, test } from "vitest";

import en from "../locales/en";
import id from "../locales/id";
import {
  getHomeProgressionContent,
  HOME_PROGRESSION_ROUTE,
  HOME_PROGRESSION_TEST_ID,
} from "../lib/home-progression";

test("renders localized Level summaries in Indonesian and English", () => {
  const summary = { level: 25, masteryLevel: 0, rank: "planner" };

  expect(
    getHomeProgressionContent(id.progression, summary, false, id.progression.loading),
  ).toEqual({
    kind: "summary",
    rank: "Perencana",
    level: "Level 25",
    accessibilityLabel: "Kedisiplinan Saya: Perencana, Level 25",
  });
  expect(
    getHomeProgressionContent(en.progression, summary, false, en.progression.loading),
  ).toEqual({
    kind: "summary",
    rank: "Planner",
    level: "Level 25",
    accessibilityLabel: "My Discipline: Planner, Level 25",
  });
});

test("renders localized Mastery summaries in Indonesian and English", () => {
  const summary = { level: 103, masteryLevel: 3, rank: "apex" };

  expect(
    getHomeProgressionContent(id.progression, summary, false, id.progression.loading).kind,
  ).toBe("summary");
  expect(
    getHomeProgressionContent(en.progression, summary, false, en.progression.loading),
  ).toEqual({
    kind: "summary",
    rank: "Apex",
    level: "Mastery 3",
    accessibilityLabel: "My Discipline: Apex, Mastery 3",
  });
});

test("keeps loading compact and hides only the failed progression card", () => {
  expect(
    getHomeProgressionContent(id.progression, undefined, false, id.progression.loading),
  ).toEqual({
    kind: "loading",
    label: "Memuat progresmu...",
    accessibilityLabel: "Kedisiplinan Saya",
  });
  expect(
    getHomeProgressionContent(id.progression, undefined, true, id.progression.loading),
  ).toEqual({ kind: "hidden" });
});

test("exposes the stable home link contract for Progression navigation", () => {
  expect(HOME_PROGRESSION_TEST_ID).toBe("home-progression-link");
  expect(HOME_PROGRESSION_ROUTE).toBe("/progression");
});