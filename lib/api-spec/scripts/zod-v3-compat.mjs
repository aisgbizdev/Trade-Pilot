import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const generatedFile = path.resolve(here, "../../api-zod/src/generated/api.ts");
const source = await readFile(generatedFile, "utf8");
const compatible = source
  .replaceAll("zod.email()", "zod.string().email()")
  .replaceAll("zod.url()", "zod.string().url()")
  .replaceAll("zod.int()", "zod.number().int()");

await writeFile(generatedFile, compatible);