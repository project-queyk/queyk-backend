import { Router, Request, Response, NextFunction } from "express";

import {
  createUser,
  getAllUsers,
  getUserByUserId,
  toggleAlertNotification,
} from "../controllers/userController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getAllUsers(req, res);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserByUserId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:oauthId/notifications",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await toggleAlertNotification(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
