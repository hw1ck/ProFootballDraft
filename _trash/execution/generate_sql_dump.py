import csv
import uuid
import os

COLUMN_MAPPING = {
    "short_name": "firstName",
    "long_name": "lastName",
    "player_positions": "position",
    "overall": "overallRating",
    "pace": "pace",
    "shooting": "shooting",
    "passing": "passing",
    "dribbling": "dribbling",
    "defending": "defending",
    "physic": "physicality",
    "player_face_url": "playerImageUrl",
    "nationality_name": "nationName",
    "nationality_id": "countryCode",
    "club_logo_url": "clubLogoUrl",
    "league_name": "leagueName",
    "display_name": "displayName"
}

def parse_int(val, default=0):
    try:
        if val == "": return default
        return int(float(val))
    except (ValueError, TypeError):
        return default

def escape_sql(s):
    if s is None:
        return "NULL"
    s = str(s).replace("'", "''")
    return f"'{s}'"

def generate_sql(csv_path, output_path):
    nations = {}
    leagues = {}
    clubs = {}
    players = []

    print(f"Reading {csv_path}...")
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data = {}
            for csv_header, java_field in COLUMN_MAPPING.items():
                val = row.get(csv_header, "").strip()
                if java_field in ["overallRating", "pace", "shooting", "passing", "dribbling", "defending", "physicality"]:
                    data[java_field] = parse_int(val)
                elif java_field in ["playerImageUrl", "clubLogoUrl"]:
                    data[java_field] = val if val else "https://placeholder.com/150"
                elif java_field == "position":
                    data[java_field] = val.split(',')[0].strip() if val else "RES"
                elif java_field == "displayName":
                    data[java_field] = val
                else:
                    data[java_field] = val
                    
            # Overwrite Image URL to point to local frontend directory based on displayName
            # e.g., if displayName is "Lionel Messi", URL becomes "/faces/Lionel Messi.webp"
            if data.get("displayName"):
                data["playerImageUrl"] = f"/faces/{data['displayName']}.webp"

            # Default empty names
            if not data.get("firstName"): data["firstName"] = data.get("lastName", "Unknown")
            if not data.get("lastName"): data["lastName"] = data["firstName"]

            # Handle Nation
            nation_name = data.get("nationName", "Unknown Nation")
            if not nation_name: nation_name = "Unknown Nation"
            if nation_name not in nations:
                nations[nation_name] = {
                    "id": str(uuid.uuid4()),
                    "countryCode": data.get("countryCode", "xx")
                }
            
            # Handle League
            league_name = data.get("leagueName", "Unknown League")
            if not league_name: league_name = "Unknown League"
            if league_name not in leagues:
                leagues[league_name] = {
                    "id": str(uuid.uuid4()),
                    "logoUrl": "https://placeholder.com/150"
                }
                
            # Handle Club
            club_name = data.get("clubName", "Unknown Club")
            if not club_name: club_name = "Unknown Club"
            if club_name not in clubs:
                clubs[club_name] = {
                    "id": str(uuid.uuid4()),
                    "logoUrl": data.get("clubLogoUrl", "https://placeholder.com/150"),
                    "league_id": leagues[league_name]["id"]
                }
                
            data["id"] = str(uuid.uuid4())
            data["nation_id"] = nations[nation_name]["id"]
            data["club_id"] = clubs[club_name]["id"]
            players.append(data)

    print(f"Parsed {len(nations)} nations, {len(leagues)} leagues, {len(clubs)} clubs, {len(players)} players.")
    print(f"Writing to {output_path}...")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("-- BULK SEED DATA\n\n")
        
        f.write("TRUNCATE TABLE squad_players CASCADE;\n")
        f.write("TRUNCATE TABLE squads CASCADE;\n")
        f.write("TRUNCATE TABLE players CASCADE;\n")
        f.write("TRUNCATE TABLE clubs CASCADE;\n")
        f.write("TRUNCATE TABLE leagues CASCADE;\n")
        f.write("TRUNCATE TABLE nations CASCADE;\n\n")
        
        # Insert Nations
        for name, info in nations.items():
            f.write(f"INSERT INTO nations (id, name, country_code) VALUES ({escape_sql(info['id'])}, {escape_sql(name)}, {escape_sql(info['countryCode'])}) ON CONFLICT (name) DO NOTHING;\n")
            
        # Insert Leagues
        for name, info in leagues.items():
            f.write(f"INSERT INTO leagues (id, name, logo_url) VALUES ({escape_sql(info['id'])}, {escape_sql(name)}, {escape_sql(info['logoUrl'])}) ON CONFLICT (name) DO NOTHING;\n")
            
        # Insert Clubs
        for name, info in clubs.items():
            f.write(f"INSERT INTO clubs (id, name, logo_url, league_id) VALUES ({escape_sql(info['id'])}, {escape_sql(name)}, {escape_sql(info['logoUrl'])}, {escape_sql(info['league_id'])}) ON CONFLICT (name) DO NOTHING;\n")
            
        # Insert Players
        for p in players:
            f.write(f"INSERT INTO players (id, display_name, first_name, last_name, position, overall_rating, pace, shooting, passing, dribbling, defending, physicality, player_image_url, club_id, nation_id) VALUES ({escape_sql(p['id'])}, {escape_sql(p.get('displayName', p['lastName']))}, {escape_sql(p['firstName'])}, {escape_sql(p['lastName'])}, {escape_sql(p['position'])}, {p['overallRating']}, {p['pace']}, {p['shooting']}, {p['passing']}, {p['dribbling']}, {p['defending']}, {p['physicality']}, {escape_sql(p['playerImageUrl'])}, {escape_sql(p['club_id'])}, {escape_sql(p['nation_id'])});\n")

    print("Done!")

if __name__ == "__main__":
    generate_sql("data/players.csv", "database/seed_players.sql")
