import { Router, Request, Response, NextFunction } from "express";

import { createToken } from "../controllers/tokenController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createToken(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
