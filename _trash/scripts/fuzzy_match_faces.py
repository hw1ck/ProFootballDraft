import os
import csv
import unicodedata
from difflib import get_close_matches

FACES_DIR = "data/faces"
CSV_PATH = "data/players.csv"
OUTPUT_CSV_PATH = "data/players_updated.csv"

def remove_accents(input_str):
    if not input_str:
        return ""
    # NFKD normalizes accents, encode to ascii ignores non-ascii, decode back to string
    return ''.join(c for c in unicodedata.normalize('NFKD', input_str) if unicodedata.category(c) != 'Mn')

def normalize_name(name):
    return remove_accents(name).lower().strip()

def match_faces():
    if not os.path.exists(FACES_DIR):
        print(f"Error: {FACES_DIR} not found.")
        return
        
    # Get all image names without extension
    image_names = set()
    for f in os.listdir(FACES_DIR):
        if f.endswith(".webp") or f.endswith(".png") or f.endswith(".jpg"):
            name = os.path.splitext(f)[0].split("_")[0] # clean things like _1
            image_names.add(name)
            
    print(f"Found {len(image_names)} unique image names.")

    # Build lookup dictionaries
    image_lookup = {normalize_name(name): name for name in image_names}
    
    # Read CSV
    rows = []
    fieldnames = []
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        if "display_name" not in fieldnames:
            fieldnames.append("display_name")
        for row in reader:
            rows.append(row)

    print(f"Loaded {len(rows)} rows from CSV.")
    
    # First pass: Exact & Normalized O(1) matching
    unmatched_rows = []
    matched_count = 0
    
    for row in rows:
        short_name = row.get("short_name", "").strip()
        long_name = row.get("long_name", "").strip()
        
        norm_short = normalize_name(short_name)
        norm_long = normalize_name(long_name)
        
        matched_name = None
        
        # 1. Check exact match in lookup
        if norm_long in image_lookup:
            matched_name = image_lookup[norm_long]
        elif norm_short in image_lookup:
            matched_name = image_lookup[norm_short]
        else:
            # Maybe check reversed long name (Last First)
            parts = norm_long.split()
            if len(parts) == 2:
                rev_long = parts[1] + " " + parts[0]
                if rev_long in image_lookup:
                    matched_name = image_lookup[rev_long]
        
        if matched_name:
            row["display_name"] = matched_name
            matched_count += 1
        else:
            unmatched_rows.append((row, norm_short, norm_long))
            
    print(f"O(1) Pass: Matched {matched_count} players.")

    # Second pass: Fuzzy matching for unmatched (this takes time so we limit to top 1 match)
    all_norm_images = list(image_lookup.keys())
    print(f"Starting Fuzzy Pass on {len(unmatched_rows)} unmatched rows...")
    fuzzy_matched = 0
    
    # Only fuzzy match the first few to show it works, or we can do all of them if fast enough.
    # difflib over 18k images for 9k unmatched might take a minute or two. We will try a fast approach.
    import time
    start = time.time()
    for i, (row, norm_short, norm_long) in enumerate(unmatched_rows):
        if i % 1000 == 0 and i > 0:
            print(f"  Processed {i} fuzzy matches... ({time.time()-start:.1f}s)")
            
        best = get_close_matches(norm_long, all_norm_images, n=1, cutoff=0.85)
        if not best:
            best = get_close_matches(norm_short, all_norm_images, n=1, cutoff=0.85)
            
        if best:
            row["display_name"] = image_lookup[best[0]]
            fuzzy_matched += 1
        else:
            row["display_name"] = row.get("short_name", "") # Fallback to short name
            
    print(f"Fuzzy Pass: Matched {fuzzy_matched} players.")
    print(f"Total Matches: {matched_count + fuzzy_matched}")
    
    # Write updated CSV
    print(f"Writing to {OUTPUT_CSV_PATH}...")
    with open(OUTPUT_CSV_PATH, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
        
    print("Done! (Replacing old CSV with new one)")
    os.replace(OUTPUT_CSV_PATH, CSV_PATH)

if __name__ == "__main__":
    match_faces()
