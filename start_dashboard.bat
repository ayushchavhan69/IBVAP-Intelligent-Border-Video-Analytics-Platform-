@echo off
title IBVAP - Tactical Border Surveillance Dashboard
echo ===================================================
echo Starting IBVAP Border Surveillance Dashboard...
echo ===================================================
echo.
cd /d "%~dp0"
call npm run dev
pause
