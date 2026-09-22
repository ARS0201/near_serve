@echo off
set "PATH=C:\Users\amirt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"

if "%1"=="expo" (
    node "%~dp0node_modules\expo\bin\cli" %2 %3 %4 %5 %6 %7 %8 %9
) else (
    node "%~dp0node_modules\.bin\%1" %2 %3 %4 %5 %6 %7 %8 %9
)
