import { Router, Request, Response, NextFunction } from "express";

import {
  createUser,
  deleteUserByUserId,
  getAllUsers,
  getUserByUserId,
  switchUserRole,
  toggleAlertNotification,
  updateExpoPushToken,
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

router.delete(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteUserByUserId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:userId/notifications",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await toggleAlertNotification(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:userId/role",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await switchUserRole(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:userId/push-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateExpoPushToken(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
