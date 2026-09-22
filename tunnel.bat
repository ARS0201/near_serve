@echo off
setlocal
echo ===================================================================
echo   NearServe - Starting Expo Tunnel (Connects over Any Network/Data)
echo ===================================================================

set "PATH=C:\Users\amirt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"

:: Run Expo start with tunnel and clear cache
node node_modules\expo\bin\cli start --tunnel --clear %*

pause
