import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";

import userRouter from "./routes/users";
import readingRouter from "./routes/readings";
// import tokenRouter from "./routes/tokens";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

app.use(helmet());
// app.use(limiter);
app.use(morgan("dev"));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_APP_URL!]
        : [process.env.FRONTEND_APP_URL!, process.env.LOCALHOST_APP_URL ?? ""],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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

app.use("/v1/api/users", limiter, userRouter);
app.use("/v1/api/iot/readings", readingRouter);

// app.use("/v1/api/tokens", tokenRouter);

export default app;
