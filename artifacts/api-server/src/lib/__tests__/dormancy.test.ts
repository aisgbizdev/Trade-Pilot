import { describe, it, expect } from "vitest";
import { buildDormancyMessage } from "../dormancy";

describe("dormancy: buildDormancyMessage", () => {
  it("uses the generic copy when no micro-stat is given", () => {
    const { title, body } = buildDormancyMessage();
    expect(title).toContain("Kangen");
    expect(body).toContain("Pasar minggu ini");
    expect(body).toContain("cek analisa");
  });

  it("interpolates a micro-stat when provided", () => {
    const { body } = buildDormancyMessage("3 berita high-impact hari ini");
    expect(body).toContain("3 berita high-impact hari ini");
    expect(body).not.toContain("cek analisa terbaru");
  });

  it("treats null micro-stat as 'no stat'", () => {
    const { body } = buildDormancyMessage(null);
    expect(body).toContain("cek analisa");
  });
});
