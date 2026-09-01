import { describe, expect, it } from "vitest";
import { prioritizeNewsSources } from "./news-source-priority";

function item(source: string, id: string) {
  return { id, source };
}

describe("prioritizeNewsSources", () => {
  it("keeps two Newsmaker items and at most one Yahoo item for a three-item list", () => {
    const result = prioritizeNewsSources(
      [
        item("Yahoo Finance", "yahoo-newest"),
        item("Newsmaker.id", "newsmaker-newest"),
        item("Yahoo Finance", "yahoo-second"),
        item("Newsmaker.id", "newsmaker-second"),
        item("Newsmaker.id", "newsmaker-third"),
      ],
      3,
    );

    expect(result.map((news) => news.id)).toEqual([
      "yahoo-newest",
      "newsmaker-newest",
      "newsmaker-second",
    ]);
  });

  it("falls back honestly to one Yahoo item when Newsmaker is unavailable", () => {
    const result = prioritizeNewsSources(
      [item("Yahoo Finance", "yahoo-one"), item("Yahoo Finance", "yahoo-two")],
      3,
    );

    expect(result.map((news) => news.id)).toEqual(["yahoo-one"]);
  });
});