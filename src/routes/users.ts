import { Router, Request, Response, NextFunction } from "express";

import {
  createUser,
  deleteUserByUserId,
  getAllUserPhoneNumbers,
  getAllUsers,
  getUserByUserId,
  switchUserRole,
  toggleAlertNotification,
  toggleAlertPushNotification,
  toggleAlertSMSNotification,
  updateExpoPushToken,
  updateUserSMSPhoneNumber,
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
  "/phone-numbers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllUserPhoneNumbers(req, res);
    } catch (error) {
      next(error);
    }
  }
);

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
  "/:userId/push-notifications",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await toggleAlertPushNotification(req, res);
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

router.patch(
  "/:userId/phone-number",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateUserSMSPhoneNumber(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:userId/sms-notifications",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await toggleAlertSMSNotification(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
