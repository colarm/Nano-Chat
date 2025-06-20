import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();
const router = Router();
router.use(requireAuth); // Apply authentication middleware to all routes in this router

router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    res.status(400).json({ error: "Room name is required" });
    return;
  }

  const room = await prisma.chatRoom.create({
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  const membership = await prisma.chatRoomUser.create({
    data: {
      userId: Number(req.userId),
      chatRoomId: room.id,
    },
    select: {
      id: true,
      user: true,
      chatRoom: true,
    },
  });

  res.status(201).json({ room: room, ownerId: membership.user.id });
});

router.post("/invite", async (req: AuthRequest, res: Response) => {
  const { roomId } = req.body;

  if (!roomId) {
    res.status(400).json({ error: "Room ID is required", id: roomId });
    return;
  }

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
    },
  });

  if (!room) {
    res.status(404).json({ error: "Chat room not found" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(req.userId) },
    select: {
      id: true,
      username: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const membership = await prisma.chatRoomUser.findUnique({
    where: {
      userId_chatRoomId: {
        userId: Number(req.userId),
        chatRoomId: roomId,
      },
    },
    select: {
      id: true,
      user: true,
      chatRoom: true,
    },
  });

  if (!membership) {
    res.status(403).json({ error: "You are not a member of this chat room" });
    return;
  }

  let inviteCode: string;
  while (true) {
    const testInviteCode = nanoid(16);
    try {
      await prisma.inviteCode.create({
        data: {
          code: testInviteCode,
          chatRoomId: room.id,
          userId: user.id,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        // Unique constraint failed
        continue; // Retry with a new invite code
      }
    }
    inviteCode = testInviteCode;
    break; // Successfully created invite code
  }

  res
    .status(200)
    .json({ inviteCode, roomName: room.name, userName: user.username });
});

router.post("/join/:inviteCode", async (req: AuthRequest, res: Response) => {
  const inviteCode = req.params.inviteCode;

  if (!inviteCode || inviteCode.trim() === "") {
    res.status(400).json({ error: "Invite code is required" });
    return;
  }
});

export default router;
