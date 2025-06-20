// Authentication routes for user registration, login, and logout

import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret"; // Use a strong secret in production
const isProd = process.env.NODE_ENV === "production";

// Helper to set JWT cookie
function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Helper to clear cookie
function clearAuthCookie(res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
  });
}

interface AuthBody {
  username: string;
  password: string;
}

// Register route
router.post(
  "/register",
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }

    if (username !== username.toLowerCase()) {
      res.status(400).json({ error: "Username must be lowercase only" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10); // Use a strong hash function in production
    const user = await prisma.user.create({
      data: { username, password: hashed },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    setAuthCookie(res, token);

    res.status(201).json({ id: user.id, username: user.username });
  }
);

// Login route
router.post(
  "/login",
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    setAuthCookie(res, token);
    res.json({ id: user.id, username: user.username });
  }
);


// Logout route
router.post("/logout", (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully" });
});

export default router;
