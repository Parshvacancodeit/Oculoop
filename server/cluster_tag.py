import spacy
from sklearn.cluster import KMeans
import numpy as np
import json
from collections import defaultdict

# Load spaCy model with word vectors
nlp = spacy.load("en_core_web_md")

# Load your images JSON
with open("/Users/parshvapatel/Desktop/oculoop/images_dynamic_tags.json") as f:
    data = json.load(f)

# 1. Collect all unique tags
all_tags = set(tag.lower() for img in data for tag in img.get("tags", []))
tag_list = list(all_tags)

# 2. Vectorize tags
vectors = np.array([nlp(tag).vector for tag in tag_list])

# 3. Cluster the tags into groups (try with 8)
kmeans = KMeans(n_clusters=8, random_state=42)
labels = kmeans.fit_predict(vectors)

# 4. Assign each tag to a cluster
tag_clusters = {tag_list[i]: int(labels[i]) for i in range(len(tag_list))}

# (Optional) Print the clustered groups
clusters = defaultdict(list)
for tag, cluster_id in tag_clusters.items():
    clusters[cluster_id].append(tag)

print("\n=== Clustered Tag Groups ===")
for cluster_id, tags in clusters.items():
    print(f"\nCluster {cluster_id}: {tags}")

# 5. Add cluster IDs to each image
for img in data:
    cluster_ids = set()
    for tag in img.get("tags", []):
        cluster_ids.add(tag_clusters.get(tag.lower(), -1))
    img["tag_clusters"] = list(cluster_ids)

# 6. Save new file
with open("images_clustered.json", "w") as f:
    json.dump(data, f, indent=2)

print("\n✅ Done. Saved as images_clustered.json")
