#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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
