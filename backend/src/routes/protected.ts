import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/me", requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ message: "Protected content", userId: req.userId });
});

export default router;
