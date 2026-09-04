"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const imageSize = require("./index.cjs");

const pngHeader = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x01, 0xb4, 0x00, 0x00, 0x01, 0x0a,
]);

test("reads PNG dimensions from a buffer", () => {
  assert.deepEqual(imageSize(pngHeader), { width: 436, height: 266, type: "png" });
});

test("reads PNG dimensions from a filesystem path for Metro compatibility", () => {
  const file = path.join(os.tmpdir(), `image-size-safe-${process.pid}.png`);
  fs.writeFileSync(file, pngHeader);
  try {
    assert.deepEqual(imageSize(file), { width: 436, height: 266, type: "png" });
  } finally {
    fs.rmSync(file, { force: true });
  }
});