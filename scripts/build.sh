#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🛠️ Building Frontend (Vite)..."
cd "$PROJECT_DIR/frontend" || exit 1
npm run build

echo "🛠️ Building Backend (Maven)..."
cd "$PROJECT_DIR/backend" || exit 1
chmod +x mvnw
./mvnw clean package -DskipTests

echo "✅ Build Complete!"
