@echo off
echo 📦 Installing Frontend Dependencies...
pushd ..\frontend
call npm install
popd

echo ☕ Resolving Backend Dependencies...
pushd ..\backend
call mvnw.cmd dependency:resolve
popd

echo ✅ Installation Complete!
