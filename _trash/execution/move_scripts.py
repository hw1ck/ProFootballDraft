import os
import shutil

SCRIPTS_DIR = "scripts"

# Create scripts directory
os.makedirs(SCRIPTS_DIR, exist_ok=True)

# Files to move
sh_files = ["install.sh", "build.sh", "start.sh"]
bat_files = ["install.bat", "build.bat", "start.bat"]

# 1. Update SH scripts
for f in sh_files:
    if os.path.exists(f):
        with open(f, "r") as file:
            content = file.read()
        
        # Update path resolution to go one level up
        content = content.replace(
            'PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
            'PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"'
        )
        
        new_path = os.path.join(SCRIPTS_DIR, f)
        with open(new_path, "w") as file:
            file.write(content)
        
        # Ensure executable
        os.chmod(new_path, 0o755)
        os.remove(f)

# 2. Update BAT scripts
for f in bat_files:
    if os.path.exists(f):
        with open(f, "r") as file:
            content = file.read()
        
        # Update paths to go one level up
        content = content.replace('cd frontend', 'cd ..\\frontend')
        content = content.replace('cd backend', 'cd ..\\backend')
        content = content.replace('cd database', 'cd ..\\database')
        
        # When finishing a block, they did 'cd ..'. Since they started in 'scripts',
        # going into '..\frontend' and then 'cd ..' puts them back in root.
        # Actually, to get back to scripts, they need 'cd scripts'.
        # Let's fix that.
        content = content.replace('cd ..\n', 'cd scripts\n')
        # Wait, if they do 'cd ..\frontend' (which is root\frontend), and then 'cd scripts'
        # from frontend, that fails. It should be 'cd ..\scripts'.
        # Better: just use absolute-like relative pushd/popd or just 'cd ..\scripts'.
        # Let's completely rewrite the bat contents to be safe.
        
        new_path = os.path.join(SCRIPTS_DIR, f)
        with open(new_path, "w") as file:
            file.write(content)
        
        os.remove(f)

# Let's manually fix the BAT scripts to use pushd/popd for safety
INSTALL_BAT = """@echo off
echo 📦 Installing Frontend Dependencies...
pushd ..\\frontend
call npm install
popd

echo ☕ Resolving Backend Dependencies...
pushd ..\\backend
call mvnw.cmd dependency:resolve
popd

echo ✅ Installation Complete!
"""

BUILD_BAT = """@echo off
echo 🛠️ Building Frontend (Vite)...
pushd ..\\frontend
call npm run build
popd

echo 🛠️ Building Backend (Maven)...
pushd ..\\backend
call mvnw.cmd clean package -DskipTests
popd

echo ✅ Build Complete!
"""

START_BAT = """@echo off
echo 🚀 Starting ProFootballDraft...

echo 📦 Starting Database...
pushd ..\\database
call docker-compose up -d
popd

echo ☕ Starting Java Spring Boot Backend (Running in background)...
pushd ..\\backend
start "Spring Boot Backend" cmd /c "mvnw.cmd spring-boot:run"
popd

echo ⚛️ Starting React Frontend...
pushd ..\\frontend
start "React Frontend" cmd /c "npm run dev"
popd

echo ==========================================
echo ✅ Application is starting up!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo    Database: localhost:5433
echo ==========================================
echo Note: Servers are running in separate windows. Close them to stop the app.
"""

with open(os.path.join(SCRIPTS_DIR, "install.bat"), "w") as f:
    f.write(INSTALL_BAT)
with open(os.path.join(SCRIPTS_DIR, "build.bat"), "w") as f:
    f.write(BUILD_BAT)
with open(os.path.join(SCRIPTS_DIR, "start.bat"), "w") as f:
    f.write(START_BAT)


# 3. Update README.md
if os.path.exists("README.md"):
    with open("README.md", "r") as file:
        content = file.read()
    
    content = content.replace('./install.sh', './scripts/install.sh')
    content = content.replace('./build.sh', './scripts/build.sh')
    content = content.replace('./start.sh', './scripts/start.sh')
    
    content = content.replace('install.bat', 'scripts\\install.bat')
    content = content.replace('build.bat', 'scripts\\build.bat')
    content = content.replace('start.bat', 'scripts\\start.bat')
    
    with open("README.md", "w") as file:
        file.write(content)

print("Moved scripts to scripts/ and updated paths.")
