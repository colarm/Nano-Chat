const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 443;

// Use the Let's Encrypt cert
const sslOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/nanochat.cc/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/nanochat.cc/fullchain.pem")
};

// Middleware
app.use(express.json());

// Routes
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log("✅ HTTPS server running at https://nanochat.cc");
});
