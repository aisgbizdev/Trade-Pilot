"use strict";

const decoder = new TextDecoder();
const disabledTypes = new Set();

function text(input, start, end) {
  return decoder.decode(input.subarray(start, end));
}

function view(input) {
  return new DataView(input.buffer, input.byteOffset, input.byteLength);
}

function requireBytes(input, offset, length) {
  if (offset < 0 || length < 0 || offset + length > input.length) {
    throw new TypeError("Invalid or truncated image");
  }
}

function readU16(input, offset, littleEndian = false) {
  requireBytes(input, offset, 2);
  return view(input).getUint16(offset, littleEndian);
}

function readU24LE(input, offset) {
  requireBytes(input, offset, 3);
  return input[offset] | (input[offset + 1] << 8) | (input[offset + 2] << 16);
}

function readU32(input, offset, littleEndian = false) {
  requireBytes(input, offset, 4);
  return view(input).getUint32(offset, littleEndian);
}

function readI32LE(input, offset) {
  requireBytes(input, offset, 4);
  return view(input).getInt32(offset, true);
}

function png(input) {
  if (input.length < 24 || text(input, 1, 8) !== "PNG\r\n\u001a\n") return;
  return { width: readU32(input, 16), height: readU32(input, 20), type: "png" };
}

function gif(input) {
  if (input.length < 10 || !/^GIF8[79]a$/.test(text(input, 0, 6))) return;
  return { width: readU16(input, 6, true), height: readU16(input, 8, true), type: "gif" };
}

function bmp(input) {
  if (input.length < 26 || text(input, 0, 2) !== "BM") return;
  return { width: readU32(input, 18, true), height: Math.abs(readI32LE(input, 22)), type: "bmp" };
}

function psd(input) {
  if (input.length < 22 || text(input, 0, 4) !== "8BPS") return;
  return { width: readU32(input, 18), height: readU32(input, 14), type: "psd" };
}

function jpeg(input) {
  if (input.length < 4 || input[0] !== 0xff || input[1] !== 0xd8) return;
  let offset = 2;
  while (offset + 4 <= input.length) {
    while (offset < input.length && input[offset] === 0xff) offset++;
    if (offset >= input.length) break;
    const marker = input[offset++];
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = readU16(input, offset);
    if (length < 2 || offset + length > input.length) throw new TypeError("Invalid JPEG");
    if (
      marker === 0xc0 || marker === 0xc1 || marker === 0xc2 || marker === 0xc3 ||
      marker === 0xc5 || marker === 0xc6 || marker === 0xc7 ||
      marker === 0xc9 || marker === 0xca || marker === 0xcb ||
      marker === 0xcd || marker === 0xce || marker === 0xcf
    ) {
      requireBytes(input, offset + 3, 4);
      return {
        width: readU16(input, offset + 5),
        height: readU16(input, offset + 3),
        type: "jpg",
      };
    }
    offset += length;
  }
  throw new TypeError("Invalid JPEG");
}

function webp(input) {
  if (input.length < 30 || text(input, 0, 4) !== "RIFF" || text(input, 8, 12) !== "WEBP") return;
  const chunk = text(input, 12, 16);
  if (chunk === "VP8X") {
    return {
      width: readU24LE(input, 24) + 1,
      height: readU24LE(input, 27) + 1,
      type: "webp",
    };
  }
  if (chunk === "VP8L") {
    requireBytes(input, 21, 4);
    if (input[20] !== 0x2f) throw new TypeError("Invalid WebP");
    return {
      width: 1 + (((input[22] & 0x3f) << 8) | input[21]),
      height: 1 + (((input[24] & 0x0f) << 10) | (input[23] << 2) | ((input[22] & 0xc0) >> 6)),
      type: "webp",
    };
  }
  if (chunk === "VP8 ") {
    requireBytes(input, 26, 4);
    return {
      width: readU16(input, 26, true) & 0x3fff,
      height: readU16(input, 28, true) & 0x3fff,
      type: "webp",
    };
  }
  throw new TypeError("Invalid WebP");
}

function svg(input) {
  const source = text(input, 0, Math.min(input.length, 65536));
  const root = source.match(/<svg\s([^>"']|"[^"]*"|'[^']*')*>/i);
  if (!root) return;
  const width = root[0].match(/\swidth=["']([0-9.]+)(?:px)?["']/i);
  const height = root[0].match(/\sheight=["']([0-9.]+)(?:px)?["']/i);
  if (width && height) {
    return { width: Number(width[1]), height: Number(height[1]), type: "svg" };
  }
  const box = root[0].match(/\sviewBox=["'][^"']*?\s([0-9.]+)\s([0-9.]+)["']/i);
  if (box) return { width: Number(box[1]), height: Number(box[2]), type: "svg" };
  throw new TypeError("Invalid SVG");
}

function ktx(input) {
  if (input.length < 44 || text(input, 1, 7) !== "KTX 11") return;
  return { width: readU32(input, 36, true), height: readU32(input, 40, true), type: "ktx" };
}

const readers = [png, jpeg, gif, webp, bmp, psd, svg, ktx];

function imageSize(value) {
  const input = value instanceof Uint8Array ? value : new Uint8Array(value);
  for (const reader of readers) {
    const result = reader(input);
    if (result && !disabledTypes.has(result.type)) return result;
  }
  throw new TypeError("Unsupported image type");
}

function disableTypes(types) {
  disabledTypes.clear();
  for (const type of types) disabledTypes.add(type);
}

module.exports = imageSize;
module.exports.default = imageSize;
module.exports.imageSize = imageSize;
module.exports.disableTypes = disableTypes;