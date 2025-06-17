import express from "express";
import path from "path";
import fs from "fs";
import http from "http";
import https from "https";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 443;
const HTTP_PORT = 3000; // fallback for local dev

app.use(express.json());

// Sample API route
app.get("/api/ping", (_req, res) => {
  res.json({ message: "pong" });
});

// Serve static frontend
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Handle SPA routing (e.g. React Router)
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  // Production: run HTTPS with real certs
  const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/your-domain.com/privkey.pem"),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/your-domain.com/fullchain.pem"
    ),
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔐 HTTPS server running at https://your-domain.com:${PORT}`);
  });
} else {
  // Development: run HTTP only
  http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`🧪 Dev server running at http://localhost:${HTTP_PORT}`);
  });
}
