// Chat Room Management Routes
import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();
const router = Router();
router.use(requireAuth);

router.post("/", async (req: AuthRequest, res: Response) => {
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

  res.status(201).json({ room: room, createrId: membership.user.id });
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
    where: { id: req.userId },
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
  // Check if the request body contains the immediate parameter
  const immediate = req.body.immediate || false;
  if (typeof immediate !== "boolean") {
    res.status(400).json({ error: "Invalid immediate parameter" });
    return;
  }

  // Extract invite code from the request parameters
  const inviteCode = req.params.inviteCode;

  // Validate invite code
  if (!inviteCode || inviteCode.trim() === "") {
    res.status(400).json({ error: "Invite code is required" });
    return;
  }

  // Check if invite code is exactly 16 characters and contains only alphanumeric characters
  if (inviteCode.length !== 16) {
    res.status(400).json({ error: "Invalid invite code format" });
    return;
  }

  // Check if invite code contains only alphanumeric characters, underscores, or hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(inviteCode)) {
    res
      .status(400)
      .json({ error: "Invite code can only contain alphanumeric characters" });
    return;
  }

  // Check if the invite code exists and is active
  const invite = await prisma.inviteCode.findUnique({
    where: { code: inviteCode },
    select: {
      id: true,
      chatRoomId: true,
      userId: true,
      active: true,
    },
  });

  // If invite code does not exist or is not active, return an error
  if (!invite) {
    res.status(404).json({ error: "Invite code not found" });
    return;
  }

  // If invite code is not active, return an error
  if (invite.active === false) {
    res.status(400).json({ error: "Invite code is no longer active" });
    return;
  }

  // Check if the user is trying to join their own invite
  if (invite.userId === req.userId) {
    res.status(400).json({ error: "You cannot join your own invite" });
    return;
  }

  // If immediate is true, add the user to the chat room immediately
  if (immediate) {
    // Check if the user is already a member of the chat room
    const existingMembership = await prisma.chatRoomUser.findUnique({
      where: {
        userId_chatRoomId: {
          userId: Number(req.userId),
          chatRoomId: invite.chatRoomId,
        },
      },
    });

    // If the user is already a member, return an error
    if (existingMembership) {
      res.status(400).json({ error: "You are already a member of this room" });
      return;
    }

    // Add the user to the chat room
    await prisma.chatRoomUser.create({
      data: {
        userId: Number(req.userId),
        chatRoomId: invite.chatRoomId,
      },
    });

    // Mark the invite code as inactive
    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { active: false },
    });

    res.status(200).json({
      message: "Successfully joined the chat room",
      roomId: invite.chatRoomId,
    });
  }

  // If immediate is false, just return the invite details
  const room = await prisma.chatRoom.findUnique({
    where: { id: invite.chatRoomId },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  // return the invite details and room information
  res.status(200).json({ invite, room });
});

router.get("/my", async (req: AuthRequest, res: Response) => {
  const userId = Number(req.userId);
  const rooms = await prisma.chatRoomUser.findMany({
    where: { userId },
    select: {
      chatRoom: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
    },
  });
  const formattedRooms = rooms.map((membership) => membership.chatRoom);
  res.status(200).json({ rooms: formattedRooms });
});

router.get("/:roomId", async (req: AuthRequest, res: Response) => {
  const roomId = Number(req.params.roomId);

  if (!roomId || isNaN(roomId)) {
    res.status(400).json({ error: "Invalid room ID" });
    return;
  }

  // Validate that the user is a member of the chat room
  const membership = await prisma.chatRoomUser.findUnique({
    where: {
      userId_chatRoomId: {
        userId: Number(req.userId),
        chatRoomId: roomId,
      },
    },
  });

  // If the user is not a member, return an error
  if (!membership) {
    res.status(403).json({ error: "You are not a member of this chat room" });
    return;
  }

  // Fetch the chat room details along with its members
  const room = await prisma.chatRoom.findUnique({
    where: { id: Number(roomId) },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  if (!room) {
    res.status(404).json({ error: "Chat room not found" });
    return;
  }

  // Fetch the members of the chat room
  const members = await prisma.chatRoomUser.findMany({
    where: { chatRoomId: roomId },
    select: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  const formattedMembers = members.map((membership) => membership.user);

  res.status(200).json({ room, members: formattedMembers });
});

// Leave a chat room
router.post("/leave/:roomId", async (req: AuthRequest, res: Response) => {
  const roomId = Number(req.params.roomId);
  const userId = Number(req.userId);

  if (!roomId || isNaN(roomId)) {
    res.status(400).json({ error: "Invalid room ID" });
    return;
  }

  const membership = await prisma.chatRoomUser.findUnique({
    where: {
      userId_chatRoomId: {
        userId,
        chatRoomId: roomId,
      },
    },
  });

  if (!membership) {
    res.status(404).json({ error: "You are not a member of this chat room" });
    return;
  }

  await prisma.chatRoomUser.delete({
    where: {
      id: membership.id,
    },
  });

  res.status(200).json({ message: "Successfully left the chat room" });
});

export default router;
