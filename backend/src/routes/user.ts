import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();
router.use(requireAuth);

// Fetch user profile data
router.get("/me", async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  // Validate userId
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  // Fetch user profile from the database
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

export default router;
