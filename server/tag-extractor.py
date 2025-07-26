# tag_extractor.py
import json
import spacy

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Load your JSON file
with open("/Users/parshvapatel/Desktop/oculoop/src/assets/data/pexels_images.json", "r") as f:
    images = json.load(f)

def extract_tags_from_caption(caption):
    doc = nlp(caption)
    tags = set()

    # Extract nouns and proper nouns as tags
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop:
            tags.add(token.lemma_.lower())

    # Also extract named entities like "Nike", "Goa", etc.
    for ent in doc.ents:
        tags.add(ent.text.lower())

    return list(tags)

# Process each image
for img in images:
    caption = img.get("alt", "")
    img["tags"] = extract_tags_from_caption(caption)

# Save updated JSON
with open("images_dynamic_tags.json", "w") as f:
    json.dump(images, f, indent=2)

print("✅ Tags extracted and saved to images_dynamic_tags.json")
