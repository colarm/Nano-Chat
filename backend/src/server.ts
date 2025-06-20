import express from "express";
import path from "path";
import fs from "fs";
import http from "http";
import https from "https";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { setupSocketIO } from "./socket";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import searchRoutes from "./routes/search";
import chatroomRoutes from "./routes/chatroom";
import messageRoutes from "./routes/message";

dotenv.config();

const app = express();
const DIST_DIR = path.join(__dirname, "../dist");
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.PORT || 443;
const isProd = process.env.NODE_ENV === "production";

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chatroom", chatroomRoutes);
app.use("/api/message", messageRoutes);

// Ping test
app.get("/api/ping", (_req, res) => {
  res.json({ message: "pong" });
});

// Serve frontend (React + Vite build)
app.use(express.static(DIST_DIR));

// Fallback for SPA routes
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

let server;

if (isProd) {
  const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/nanochat.cc/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/nanochat.cc/fullchain.pem"),
  };

  server = https.createServer(sslOptions, app);
  server.listen(HTTPS_PORT, () => {
    console.log(`🔐 HTTPS server running at https://nanochat.cc:${HTTPS_PORT}`);
  });
} else {
  server = http.createServer(app);
  server.listen(HTTP_PORT, () => {
    console.log(`🧪 Dev server running at http://localhost:${HTTP_PORT}`);
  });
}

// Attach Socket.IO
setupSocketIO(server);
