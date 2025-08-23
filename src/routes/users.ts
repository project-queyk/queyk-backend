import { Router, Request, Response, NextFunction } from "express";

import {
  createUser,
  getAllUsers,
  getUserByUserId,
} from "../controllers/userController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:tokenType",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:userId/:tokenType",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserByUserId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
