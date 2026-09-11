import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";

import iotRouter from "./routes/iot";
import { auth } from "./lib/auth/auth";
import userRouter from "./routes/users";
import emailRouter from "./routes/email";
import readingRouter from "./routes/readings";
import earthquakeRouter from "./routes/earthquakes";
import notificationRouter from "./routes/notifications";
import pushNotificationRouter from "./routes/push-notifications";

const app = express();

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

const allowedOrigins = [
  process.env.FRONTEND_APP_URL,
  process.env.LOCALHOST_APP_URL,
  "http://localhost:3000",
  "http://localhost:9245",
  "http://127.0.0.1:9245",
  "http://localhost:9246",
  "http://127.0.0.1:9246",
  "wails://localhost",
  "wails://localhost:9245",
  "wails://wails",
  "http://wails.localhost",
].filter(Boolean) as string[];

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin === "null") {
        return callback(null, true);
      }

      if (
        process.env.NODE_ENV !== "production" &&
        (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
          origin.startsWith("wails://"))
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Token-Type"],
  }),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    message: "Queyk Backend API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/v1/api/users", userRouter);
app.use("/v1/api/iot/readings", readingRouter);
app.use("/v1/api/readings", limiter, readingRouter);
app.use("/v1/api/email", emailRouter);
app.use("/v1/api/push-notifications", pushNotificationRouter);
app.use("/v1/api/notifications", notificationRouter);
app.use("/v1/api/iot/earthquakes", earthquakeRouter);
app.use("/v1/api/earthquakes", limiter, earthquakeRouter);
app.use("/v1/api/iot/device", iotRouter);

export default app;
