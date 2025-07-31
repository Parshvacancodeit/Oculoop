import json
import torch
import clip
from tqdm import tqdm
from sklearn.preprocessing import normalize

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Load your sampled captions
with open("/Users/parshvapatel/Desktop/oculoop/server/sampled_captions.json") as f:
    captions = json.load(f)

# To store results
all_embeddings = []
batch_size = 64

# Embed captions in batches
for i in tqdm(range(0, len(captions), batch_size)):
    batch = captions[i:i + batch_size]
    tokens = clip.tokenize(batch).to(device)
    with torch.no_grad():
        embeddings = model.encode_text(tokens)
        embeddings = normalize(embeddings.cpu().numpy())  # Normalize for cosine similarity
        all_embeddings.extend(embeddings)

# Save caption + embedding pairs
with open("caption_embeddings.json", "w") as f:
    json.dump([
        {"caption": c, "embedding": e.tolist()}
        for c, e in zip(captions, all_embeddings)
    ], f)

print("✅ Finished embedding and saved to caption_embeddings.json")
