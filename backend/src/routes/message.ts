// Message routes for sending and receiving messages
import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();
router.use(requireAuth);

// Send a message to a chat room
router.post("/", async (req: AuthRequest, res: Response) => {
	const roomId = Number(req.body.roomId);
	const content = req.body.content as string;
	
	// Validate input
  if (!roomId || !content) {
    res.status(400).json({ error: "Room ID and content are required" });
    return;
	}
	
	// Prevent XSS attacks by sanitizing content
	const sanitizedContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

	// Limit message length to 2048 characters
	if (sanitizedContent.length > 2048) {
		res.status(400).json({ error: "Message content exceeds 2048 characters" });
		return;
	}

	// Check if the chat room exists
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

	// Check if user is a member of the chat room
	const membership = await prisma.chatRoomUser.findFirst({
		where: {
			chatRoomId: roomId,
			userId: Number(req.userId),
		},
	});

	if (!membership) {
		res.status(403).json({ error: "You are not a member of this chat room" });
		return;
	}

	// Create the message
  const message = await prisma.message.create({
    data: {
      content: sanitizedContent,
      chatRoomId: roomId,
      userId: Number(req.userId),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  res.status(201).json(message);
});

// Get specific number of messages from a chat room
router.get("/:roomId", async (req: AuthRequest, res: Response) => {
  const roomId = Number(req.params.roomId);
	const limit = parseInt(req.query.limit as string) || 50; // Default to 50 messages
	
	// Validate roomId and limit
  if (!roomId) {
    res.status(400).json({ error: "Room ID is required" });
    return;
  }

  if (isNaN(limit) || limit <= 0) {
    res.status(400).json({ error: "Invalid limit parameter" });
    return;
	}
	
	if (limit > 100) {
		res.status(400).json({ error: "Limit cannot exceed 100 messages" });
		return;
	}

	// Check if the chat room exists
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
	
	// Check if user is a member of the chat room
	const membership = await prisma.chatRoomUser.findFirst({
		where: {
			chatRoomId: roomId,
			userId: Number(req.userId),
		},
	});

	if (!membership) {
		res.status(403).json({ error: "You are not a member of this chat room" });
		return;
	}

	// Fetch messages from the chat room
  const messages = await prisma.message.findMany({
    where: { chatRoomId: roomId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  res.json(messages.reverse()); // Reverse to show oldest first
});

export default router;