import os
import stat

README_MD = """# ProFootballDraft

A dynamic, full-stack fantasy football drafting application built with a modern React UI and a robust Java Spring Boot backend.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS (Glassmorphism & modern UI patterns)
- **Backend**: Java 21, Spring Boot 3, Spring Data JPA
- **Database**: PostgreSQL (containerized via Docker)
- **Tooling**: Maven, npm, Docker Compose

---

## Onboarding & Setup Instructions

Welcome to the team! To get this project running on your local machine, follow the instructions below based on your operating system.

### Prerequisites
Before running the scripts, ensure you have the following installed:
- **Node.js** (v18+)
- **Java JDK** (v21)
- **Docker & Docker Compose** (Must be running in the background)

### Mac & Linux Users

**1. Install Dependencies**
```bash
./install.sh
```

**2. Build the Application (Optional for Dev)**
```bash
./build.sh
```

**3. Start the Application**
```bash
./start.sh
```

### Windows Users
*We have provided `.bat` scripts so you can run the project natively using Command Prompt or PowerShell.*

**1. Install Dependencies**
```cmd
install.bat
```

**2. Build the Application (Optional for Dev)**
```cmd
build.bat
```

**3. Start the Application**
```cmd
start.bat
```

---

## Application URLs
Once the `start` script finishes booting, you can access the stack at:
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API API**: [http://localhost:8080](http://localhost:8080)
- **Database**: `localhost:5433` (Credentials in `application.yml`)
"""

# BASH SCRIPTS (Mac/Linux)

INSTALL_SH = """#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📦 Installing Frontend Dependencies..."
cd "$PROJECT_DIR/frontend" || exit 1
npm install

echo "☕ Resolving Backend Dependencies..."
cd "$PROJECT_DIR/backend" || exit 1
chmod +x mvnw
./mvnw dependency:resolve

echo "✅ Installation Complete!"
"""

BUILD_SH = """#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛠️ Building Frontend (Vite)..."
cd "$PROJECT_DIR/frontend" || exit 1
npm run build

echo "🛠️ Building Backend (Maven)..."
cd "$PROJECT_DIR/backend" || exit 1
chmod +x mvnw
./mvnw clean package -DskipTests

echo "✅ Build Complete!"
"""

START_SH = """#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting ProFootballDraft..."

# 1. Start PostgreSQL Database
echo "📦 Starting Database..."
cd "$PROJECT_DIR/database" || exit 1
docker-compose up -d

# 2. Start Spring Boot Backend
echo "☕ Starting Java Spring Boot Backend..."
cd "$PROJECT_DIR/backend" || exit 1
chmod +x mvnw
./mvnw spring-boot:run &
BACKEND_PID=$!

# 3. Start Vite Frontend
echo "⚛️ Starting React Frontend..."
cd "$PROJECT_DIR/frontend" || exit 1
npm run dev &
FRONTEND_PID=$!

echo "=========================================="
echo "✅ Application is starting up!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8080"
echo "   Database: localhost:5433"
echo "=========================================="
echo "Press [CTRL+C] to stop the backend and frontend servers."

trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID; kill $FRONTEND_PID; exit 0" SIGINT SIGTERM
wait $BACKEND_PID
wait $FRONTEND_PID
"""


# BAT SCRIPTS (Windows)

INSTALL_BAT = """@echo off
echo 📦 Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo ☕ Resolving Backend Dependencies...
cd backend
call mvnw.cmd dependency:resolve
cd ..

echo ✅ Installation Complete!
"""

BUILD_BAT = """@echo off
echo 🛠️ Building Frontend (Vite)...
cd frontend
call npm run build
cd ..

echo 🛠️ Building Backend (Maven)...
cd backend
call mvnw.cmd clean package -DskipTests
cd ..

echo ✅ Build Complete!
"""

START_BAT = """@echo off
echo 🚀 Starting ProFootballDraft...

echo 📦 Starting Database...
cd database
call docker-compose up -d
cd ..

echo ☕ Starting Java Spring Boot Backend (Running in background)...
cd backend
start "Spring Boot Backend" cmd /c "mvnw.cmd spring-boot:run"
cd ..

echo ⚛️ Starting React Frontend...
cd frontend
start "React Frontend" cmd /c "npm run dev"
cd ..

echo ==========================================
echo ✅ Application is starting up!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo    Database: localhost:5433
echo ==========================================
echo Note: Servers are running in separate windows. Close them to stop the app.
"""


def write_file(path, content, make_executable=False):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    if make_executable:
        st = os.stat(path)
        os.chmod(path, st.st_mode | stat.S_IEXEC)
    
    print(f"[+] Wrote {path}")

def generate_dx_scripts():
    # Write Documentation
    write_file("README.md", README_MD)
    
    # Write Bash Scripts
    write_file("install.sh", INSTALL_SH, True)
    write_file("build.sh", BUILD_SH, True)
    write_file("start.sh", START_SH, True)
    
    # Write Bat Scripts
    write_file("install.bat", INSTALL_BAT)
    write_file("build.bat", BUILD_BAT)
    write_file("start.bat", START_BAT)

if __name__ == "__main__":
    generate_dx_scripts()
