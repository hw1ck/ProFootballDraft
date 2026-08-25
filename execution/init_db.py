import os
import subprocess

DOCKER_COMPOSE_CONTENT = """version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: profootballdraft_db
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-profootball_admin}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-admin123}
      POSTGRES_DB: ${POSTGRES_DB:-profootballdraft}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

volumes:
  postgres_data:
"""

INIT_SQL_CONTENT = """-- ProFootballDraft Initial Schema

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    overall_rating INT DEFAULT 0,
    coins INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    position VARCHAR(10) NOT NULL,
    overall_rating INT NOT NULL,
    pace INT,
    shooting INT,
    passing INT,
    dribbling INT,
    defending INT,
    physicality INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    chemistry INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS squad_players (
    squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    position_index INT NOT NULL,
    PRIMARY KEY (squad_id, player_id)
);
"""

def generate_docker_compose(directory: str):
    """Generates the docker-compose.yml for PostgreSQL."""
    compose_path = os.path.join(directory, 'docker-compose.yml')
    with open(compose_path, 'w') as f:
        f.write(DOCKER_COMPOSE_CONTENT)
    print(f"[+] Created {compose_path}")

def generate_init_sql(directory: str):
    """Generates the initial database schema (init.sql)."""
    sql_path = os.path.join(directory, 'init.sql')
    with open(sql_path, 'w') as f:
        f.write(INIT_SQL_CONTENT)
    print(f"[+] Created {sql_path}")

def setup_database_environment(base_path: str):
    """Sets up the database environment folders and files."""
    db_path = os.path.join(base_path, 'database')
    os.makedirs(db_path, exist_ok=True)
    
    generate_docker_compose(db_path)
    generate_init_sql(db_path)
    print(f"[+] Database setup files generated in {db_path}")

if __name__ == "__main__":
    # Assumes execution from root or execution directory
    # Using parent directory to create a top-level 'database' folder
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    setup_database_environment(project_root)
