import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In production the api-server also serves the ai-trading SPA so the
// whole app runs as a single Cloud Run service on a single port.
if (process.env["NODE_ENV"] === "production") {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const staticDir =
    process.env["STATIC_DIR"] ??
    path.resolve(here, "..", "..", "ai-trading", "dist", "public");

  if (existsSync(staticDir)) {
    app.use(express.static(staticDir, { index: false }));
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== "GET") return next();
      if (req.path.startsWith("/api")) return next();
      // Only serve index.html for navigation requests — let real asset
      // misses 404 normally so bundle-mismatch bugs are visible instead
      // of silently returning HTML with a 200.
      if (path.extname(req.path) !== "") return next();
      const accept = req.headers.accept ?? "";
      if (accept !== "" && !accept.includes("text/html") && !accept.includes("*/*")) {
        return next();
      }
      res.sendFile(path.join(staticDir, "index.html"));
    });
    logger.info({ staticDir }, "Serving SPA static assets");
  } else {
    logger.warn(
      { staticDir },
      "STATIC_DIR not found — SPA will not be served from api-server",
    );
  }
}

export default app;
