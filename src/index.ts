import { Hono } from "hono";
import { config } from "dotenv";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import auth from "./routes/auth.js";

config({ path: ".env.local" });

const app = new Hono();

app.get("/", (c) =>
  c.json({
    message: "Queyk Backend API",
    version: "2.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
  })
);

app.use(
  "/v2/api/auth/*",
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? (process.env.FRONTEND_URL as string)
        : "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

const routes = [auth] as const;

routes.forEach((route) => {
  app.basePath("/v2/api").route("/", route);
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

serve({
  fetch: app.fetch,
  port: port,
});
