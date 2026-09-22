@echo off
setlocal
echo ========================================================
echo   NearServe - Starting Expo Web Preview
echo ========================================================

set "PATH=C:\Users\amirt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"

node node_modules\expo\bin\cli start --web %*

pause
