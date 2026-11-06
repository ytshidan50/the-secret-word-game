@echo off
title RandomTopicGen Dual Prompt Server
cd /d "%~dp0"

echo ========================================================
echo   Starting RandomTopicGen Dual Prompt & REST API Server
echo ========================================================
echo.
echo Opening http://localhost:8080 in your browser...
echo Press Ctrl+C in this window anytime to stop the server.
echo.

start http://localhost:8080
powershell -NoProfile -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
pause

