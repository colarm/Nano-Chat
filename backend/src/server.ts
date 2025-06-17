import express from "express";
import path from "path";
import fs from "fs";
import http from "http";
import https from "https";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();
const DIST_DIR = path.join(__dirname, "../dist");
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.PORT || 443;
const isProd = process.env.NODE_ENV === "production";

app.use(express.json());

// Sample API
app.get("/api/ping", (_req, res) => {
  res.json({ message: "pong" });
});

// Serve static frontend
app.use(express.static(DIST_DIR));

// SPA fallback for client-side routes (e.g., React Router)
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

// HTTPS for production, HTTP for development
if (isProd) {
  const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/nanochat.cc/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/nanochat.cc/fullchain.pem"),
  };  

  https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`🔐 HTTPS server running at https://nanochat.cc:${HTTPS_PORT}`);
  });
} else {
  http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`🧪 Dev server running at http://localhost:${HTTP_PORT}`);
  });
}
