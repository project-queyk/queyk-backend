import { Router, Request, Response, NextFunction } from "express";

import { sendAllNotifications } from "../controllers/notificationController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sendAllNotifications(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
