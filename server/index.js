const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5051;

app.use(cors());
app.use(express.json());

const mergedLogs = {};

app.get("/", (req, res) => {
  res.send("✅ Backend is running.");
});

function mergeLogs(existing, incoming) {
  return {
    url: incoming.url,
    alt: incoming.alt || existing.alt,
    tags: incoming.tags || existing.tags,
    duration: Math.max(existing.duration || 0, incoming.duration || 0),
    liked: incoming.hasOwnProperty("liked") ? incoming.liked : existing.liked,
    type: Array.from(new Set([...(existing.type || []), ...(incoming.type || [])])),
    timestamp: incoming.timestamp,
  };
}

app.post("/log-behavior", (req, res) => {
  const log = req.body;
  const key = log.url;

  console.log("📥 Received Log:", log);

  if (!mergedLogs[key]) {
    mergedLogs[key] = log;
  } else {
    mergedLogs[key] = mergeLogs(mergedLogs[key], log);
  }

  console.log("📦 Merged Log:", mergedLogs[key]);
  res.json({ status: "success", merged: mergedLogs[key] });
});


// ✅ NEW ENDPOINT to expose all logs
app.get("/all-logs", (req, res) => {
  res.json(Object.values(mergedLogs)); // Return all merged log objects as an array
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
