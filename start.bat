@echo off
setlocal
echo ========================================================
echo   NearServe - Starting Expo Mobile App Development Server
echo ========================================================

:: Add node to PATH if needed
set "PATH=C:\Users\amirt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"

:: Run Expo start
node node_modules\expo\bin\cli start %*

pause
