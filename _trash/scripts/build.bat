@echo off
echo 🛠️ Building Frontend (Vite)...
pushd ..\frontend
call npm run build
popd

echo 🛠️ Building Backend (Maven)...
pushd ..\backend
call mvnw.cmd clean package -DskipTests
popd

echo ✅ Build Complete!
