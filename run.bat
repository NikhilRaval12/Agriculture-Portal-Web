@echo off
title Agriculture Portal Launcher
color 0A

echo ===================================================
echo           AGRICULTURE PORTAL LAUNCHER
echo ===================================================
echo.
echo Starting Spring Boot Backend (Port 8080)...
start "Agriculture Portal - Backend" cmd /k "cd /d D:\Project\AGRICULTURE PORTAL\backend && D:\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"

echo Starting React + Vite Frontend (Port 5173)...
start "Agriculture Portal - Frontend" cmd /k "cd /d D:\Project\AGRICULTURE PORTAL\frontend && npm run dev"

echo.
echo ===================================================
echo Both services are starting in separate windows:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8080
echo ===================================================
timeout /t 5
start http://localhost:5173
