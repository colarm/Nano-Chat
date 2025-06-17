const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API example
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
