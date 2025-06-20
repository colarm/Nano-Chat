import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(requireAuth); // Apply authentication middleware to all routes in this router

// Complete this api in future
router.get("/me", (req: AuthRequest, res: Response) => {
  res.json({ message: "Protected content", userId: req.userId });
});

export default router;
