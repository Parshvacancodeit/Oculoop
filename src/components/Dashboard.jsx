// src/components/Dashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import ClipRecommender from "./ClipRecommender";


import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bcd4", "#ff69b4"];

// --- Scoring Function ---
const computeScore = (log) => {
  let score = 0;

  const typeWeights = {
    hover: 1,
    modal: 2,
    like: 3,
  };

  if (Array.isArray(log.type)) {
    log.type.forEach(t => {
      score += typeWeights[t] || 0;
    });
  }

  if (log.liked === true) score += 3;

  const durationSeconds = Math.min(log.duration / 1000, 5);
  score += durationSeconds;

  const logTime = new Date(log.timestamp).getTime();
  const now = new Date().getTime();
  const FIVE_MIN_MS = 5 * 60 * 1000;
  if (now - logTime <= FIVE_MIN_MS) {
    score += 2;
  }

  return Math.round(score * 100) / 100;
};

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5051/all-logs")
      .then(res => {
        const scored = res.data.map(log => ({
          ...log,
          score: computeScore(log),
        }));
        const sorted = scored.sort((a, b) => b.score - a.score);
        setLogs(sorted);
      })
      .catch(err => console.error("Error fetching logs:", err));

    const id = "Session-" + Math.floor(100000 + Math.random() * 900000);
    setSessionId(id);
  }, []);

  // Chart data prep
  const typeCounts = {};
  const tagCounts = {};

  logs.forEach(log => {
    (log.type || []).forEach(t => typeCounts[t] = (typeCounts[t] || 0) + 1);
    (log.tags || []).forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1);
  });

  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  const tagData = Object.entries(tagCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Behavior Dashboard</h1>
      <p className="session-id">Session ID: {sessionId}</p>

      <div className="charts">
        <div className="chart-card">
          <h3>Interaction Types</h3>
          <BarChart width={300} height={250} data={typeData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
<ClipRecommender logs={logs} />

        <div className="chart-card">
          <h3>Tags Distribution</h3>
          <PieChart width={300} height={250}>
            <Pie data={tagData} dataKey="value" nameKey="name" outerRadius={90} label>
              {tagData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <h2 className="section-title">🖼️ Image Logs (Sorted by Score)</h2>
      <div className="log-grid">
        {logs.map((log, index) => (
          <div className="log-card" key={index}>
            <img src={log.url} alt={log.alt} className="log-image" />
            <div className="log-info">
              <p><strong>Alt:</strong> {log.alt}</p>
              <p><strong>Tags:</strong> {log.tags.join(", ")}</p>
              <p><strong>Types:</strong> {log.type.join(", ")}</p>
              <p><strong>Duration:</strong> {log.duration} ms</p>
              <p><strong>Liked:</strong> {log.liked ? "❤️" : "❌"}</p>
              <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
              <p><strong>Score:</strong> {log.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default Dashboard;
