import { Router, Request, Response, NextFunction } from "express";

import {
  createEarthquake,
  getEarthquake,
  getEarthquakes,
} from "../controllers/earthquakeController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createEarthquake(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getEarthquakes(req, res);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:earthquakeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getEarthquake(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
