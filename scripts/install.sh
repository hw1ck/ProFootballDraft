#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "📦 Installing Frontend Dependencies..."
cd "$PROJECT_DIR/frontend" || exit 1
npm install

echo "☕ Resolving Backend Dependencies..."
cd "$PROJECT_DIR/backend" || exit 1
chmod +x mvnw
./mvnw dependency:resolve

echo "✅ Installation Complete!"
