// backend/src/socket.ts
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // your frontend
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload & { userId: number };
      socket.data.userId = payload.userId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log("User connected:", userId);

    socket.on("join_room", (roomId: string) => {
      socket.join(`room:${roomId}`);
    });

    socket.on("send_message", async ({ roomId, content }) => {
      const message = await prisma.message.create({
        data: {
          chatRoomId: Number(roomId),
          userId,
          content,
        },
        include: {
          user: {
            select: { username: true },
          },
        },
      });

      io.to(`room:${roomId}`).emit("new_message", {
        id: message.id,
        content: message.content,
        sender: message.user.username,
        createdAt: message.createdAt,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });
}
