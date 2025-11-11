import { Router, Request, Response, NextFunction } from "express";

import {
  createUser,
  deleteUserByUserId,
  deleteUserSMSPhoneNumber,
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

let isSMSNotificationPreferencesUpdated = false;

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

router.get("/phone-numbers-status", (req, res) => {
  res.json({ isSMSNotificationPreferencesUpdated });
  isSMSNotificationPreferencesUpdated = false;
});

router.post("/phone-numbers-reset", (req, res) => {
  isSMSNotificationPreferencesUpdated = false;
  res.json({ message: "SMS notification preferences reset" });
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
      isSMSNotificationPreferencesUpdated = true;
      await updateUserSMSPhoneNumber(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:userId/phone-number",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      isSMSNotificationPreferencesUpdated = true;
      await deleteUserSMSPhoneNumber(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:userId/sms-notifications",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      isSMSNotificationPreferencesUpdated = true;
      await toggleAlertSMSNotification(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
