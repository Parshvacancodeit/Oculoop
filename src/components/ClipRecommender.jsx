import React, { useEffect, useState } from "react";
import axios from "axios";

const ClipRecommender = ({ logs }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const topAlts = logs
        .sort((a, b) => b.score - a.score)
        .slice(0, 3) // take top 3
        .map(log => log.alt);

      const results = [];

      for (let alt of topAlts) {
        try {
          const pexelsRes = await axios.get(`http://localhost:5052/fetch-pexels?query=${encodeURIComponent(alt)}`);
          results.push({
            original: alt,
            image: pexelsRes.data.image_url,
          });
        } catch (err) {
          console.error("Pexels fetch error:", err);
        }
      }

      setRecommendations(results);
    };

    if (logs.length > 0) {
      fetchImages();
    }
  }, [logs]);

  return (
    <div className="clip-recommendations">
      <h2>🔁 Alt-based Recommendations (No CLIP)</h2>
      <div className="recommend-grid">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommend-card">
            <p><strong>Original Alt:</strong> {rec.original}</p>
            <img src={rec.image} alt={rec.original} width="300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClipRecommender;
