@echo off
title IBVAP - Tactical Border Surveillance Dashboard
echo ===================================================
echo Starting IBVAP Border Surveillance Dashboard...
echo ===================================================
echo.
cd /d "%~dp0"
start http://localhost:5173
call npm run dev
pause
