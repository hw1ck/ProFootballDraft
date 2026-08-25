import csv
import json
import urllib.request
import urllib.error

# Configurable Mapping: Maps raw CSV headers to Java Backend fields
COLUMN_MAPPING = {
    "First Name": "firstName",
    "Last Name": "lastName",
    "Pos": "position",
    "OVR": "overallRating",
    "PAC": "pace",
    "SHO": "shooting",
    "PAS": "passing",
    "DRI": "dribbling",
    "DEF": "defending",
    "PHY": "physicality",
    "Image URL": "playerImageUrl",
    "Nation": "nationName",
    "Country Code": "countryCode",
    "Club": "clubName",
    "Club Logo URL": "clubLogoUrl",
    "League": "leagueName"
}

def parse_int(val, default=0):
    try:
        return int(val)
    except (ValueError, TypeError):
        return default

def process_csv(file_path):
    payload = []
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            player_data = {}
            for csv_header, java_field in COLUMN_MAPPING.items():
                val = row.get(csv_header, "").strip()
                
                # Type validation / Normalization
                if java_field in ["overallRating", "pace", "shooting", "passing", "dribbling", "defending", "physicality"]:
                    player_data[java_field] = parse_int(val)
                elif java_field == "playerImageUrl" or java_field == "clubLogoUrl":
                    # Placeholder check
                    player_data[java_field] = val if val else "placeholder_url_test"
                else:
                    player_data[java_field] = val
                    
            payload.append(player_data)
    return payload

def send_to_api(payload):
    url = "http://localhost:8080/api/v1/players/batch"
    headers = {'Content-Type': 'application/json'}
    data = json.dumps(payload).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            result = response.read().decode('utf-8')
            print(f"[+] API Success: {result}")
    except urllib.error.URLError as e:
        print(f"[-] API Failed: {e}")

if __name__ == "__main__":
    import sys
    csv_file = sys.argv[1] if len(sys.argv) > 1 else "execution/dummy_players.csv"
    print(f"Reading from {csv_file}...")
    normalized_data = process_csv(csv_file)
    print(f"Prepared {len(normalized_data)} players. Sending to API...")
    send_to_api(normalized_data)
