import { spawn } from "node:child_process";
import net from "node:net";

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen({ host: "127.0.0.1", port }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function choosePortPair() {
  const override = Number(process.env.E2E_TEST_PORT);
  if (Number.isInteger(override) && override > 0 && override < 65_535) {
    return override;
  }

  const firstCandidate = 30_000 + ((process.pid * 2) % 15_000);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const port = firstCandidate + attempt * 2;
    if (port >= 64_000) break;
    if ((await canListen(port)) && (await canListen(port + 1))) return port;
  }

  throw new Error("Unable to find a free frontend/API port pair for Playwright");
}

const port = await choosePortPair();
const args = ["exec", "playwright", "test", ...process.argv.slice(2)];
const child = spawn("pnpm", args, {
  stdio: "inherit",
  env: {
    ...process.env,
    E2E_TEST_PORT: String(port),
  },
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.once("error", (error) => {
  console.error(`[e2e] failed to start Playwright: ${error.message}`);
  process.exit(1);
});

child.once("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});