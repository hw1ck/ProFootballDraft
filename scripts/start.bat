@echo off
echo 🚀 Starting ProFootballDraft...

echo 📦 Starting Database...
pushd ..\database
call docker-compose up -d
popd

echo ☕ Starting Java Spring Boot Backend (Running in background)...
pushd ..\backend
start "Spring Boot Backend" cmd /c "mvnw.cmd spring-boot:run"
popd

echo ⚛️ Starting React Frontend...
pushd ..\frontend
start "React Frontend" cmd /c "npm run dev"
popd

echo ==========================================
echo ✅ Application is starting up!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo    Database: localhost:5433
echo ==========================================
echo Note: Servers are running in separate windows. Close them to stop the app.
