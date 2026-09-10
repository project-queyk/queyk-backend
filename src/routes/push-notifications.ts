import { Router, Request, Response, NextFunction } from "express";

import { sendPushNotification } from "../controllers/pushNotificationController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sendPushNotification(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
