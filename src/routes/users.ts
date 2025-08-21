import { Router, Request, Response, NextFunction } from "express";
import { createUser } from "../controllers/userController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createUser(req, res);
  } catch (error) {
    next;
  }
});

export default router;
