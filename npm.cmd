@echo off
set "PATH=C:\Users\amirt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"

set "PNPM_CLI=C:\Users\amirt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs"

if "%1"=="start" (
    node "%~dp0node_modules\expo\bin\cli" start %2 %3 %4 %5
) else if "%1"=="run" (
    if "%2"=="web" (
        node "%~dp0node_modules\expo\bin\cli" start --web %3 %4 %5
    ) else if "%2"=="android" (
        node "%~dp0node_modules\expo\bin\cli" start --android %3 %4 %5
    ) else if "%2"=="ios" (
        node "%~dp0node_modules\expo\bin\cli" start --ios %3 %4 %5
    ) else if "%2"=="check-types" (
        node "%~dp0node_modules\typescript\bin\tsc" --noEmit
    ) else (
        node "%PNPM_CLI%" run %2 %3 %4 %5
    )
) else if "%1"=="test" (
    node "%~dp0test\runTests.js"
) else (
    node "%PNPM_CLI%" %*
)
