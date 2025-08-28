import { Router, Request, Response, NextFunction } from "express";

import { sendEmail } from "../controllers/emailController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sendEmail(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
