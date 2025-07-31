from flask import Flask, request, jsonify
import torch
import clip
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


import requests

PEXELS_API_KEY = "g3vXaQf0Nwz3EhZs1S6sco7uUhMHyYlOK1SIxPOg9hKYB6CI4SokwgSp"  # Replace with your actual key

@app.route('/fetch-pexels')
def fetch_pexels():
    query = request.args.get("query", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    headers = {
        "Authorization": PEXELS_API_KEY
    }

    response = requests.get(
        "https://api.pexels.com/v1/search",
        headers=headers,
        params={"query": query, "per_page": 1}
    )

    if response.status_code != 200:
        return jsonify({"error": "Pexels API error"}), 500

    data = response.json()
    if data["photos"]:
        image_url = data["photos"][0]["src"]["medium"]
        return jsonify({"image_url": image_url})
    else:
        return jsonify({"error": "No image found"}), 404
if __name__ == "__main__":
    
    app.run(host="0.0.0.0", port=5052, debug=True)