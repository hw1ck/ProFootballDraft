import os
import csv

FACES_DIR = "data/faces"
CSV_PATH = "data/players.csv"

def check_matches():
    if not os.path.exists(FACES_DIR):
        print(f"Error: {FACES_DIR} not found.")
        return
        
    # Get all image names without extension
    images = []
    for f in os.listdir(FACES_DIR):
        if f.endswith(".webp") or f.endswith(".png") or f.endswith(".jpg"):
            name = os.path.splitext(f)[0]
            images.append(name)
            
    if not images:
        print("No images found in data/faces.")
        return

    print(f"Found {len(images)} images in {FACES_DIR}.")

    # Load CSV names
    csv_names = set()
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            short_name = row.get("short_name", "").strip()
            long_name = row.get("long_name", "").strip()
            if short_name:
                csv_names.add(short_name.lower())
            if long_name:
                csv_names.add(long_name.lower())

    # Check matches
    matched = 0
    unmatched = []
    
    for img_name in images:
        clean_name = img_name.split("_")[0] # handle things like "Alisson_1"
        if clean_name.lower() in csv_names:
            matched += 1
        else:
            unmatched.append(img_name)

    match_rate = (matched / len(images)) * 100
    
    print("\n--- RESULTS ---")
    print(f"Total Images Checked: {len(images)}")
    print(f"Matches Found in CSV: {matched}")
    print(f"Match Rate: {match_rate:.2f}%")
    
    if unmatched:
        print("\n--- SAMPLE UNMATCHED IMAGES ---")
        for u in unmatched[:15]:
            print(f"- {u}")

if __name__ == "__main__":
    check_matches()
