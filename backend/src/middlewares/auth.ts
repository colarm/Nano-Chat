import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret"; // Use a strong secret in production

// Extend Request
export interface AuthRequest extends Request {
  userId?: number;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = Number(payload.userId);
    if (isNaN(req.userId)) {
      throw new Error("Invalid user ID");
    }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
