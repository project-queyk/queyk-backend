import { Router, Request, Response, NextFunction } from "express";

import {
  createReading,
  getReading,
  getReadings,
} from "../controllers/readingController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createReading(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getReadings(req, res);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:readingId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getReading(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
