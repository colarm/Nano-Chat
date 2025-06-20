// Search routes for users and chatrooms
import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/users", async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  res.json(users);
});

router.get("/chatrooms", async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }

  const chatrooms = await prisma.chatRoom.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  res.json(chatrooms);
});

export default router;
