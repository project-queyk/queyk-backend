import { Router, Request, Response, NextFunction } from "express";

import { createReading } from "../controllers/readingController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createReading(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
