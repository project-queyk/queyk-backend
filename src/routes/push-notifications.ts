import { Router, Request, Response, NextFunction } from "express";

import {
  sendPushNotification,
  subscribeWebPush,
  unsubscribeWebPush,
} from "../controllers/pushNotificationController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sendPushNotification(req, res);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/subscribe",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await subscribeWebPush(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/unsubscribe",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await unsubscribeWebPush(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
