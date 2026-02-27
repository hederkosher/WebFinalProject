@echo off
chcp 65001 >nul 2>&1
title מסלול טיולים אפקה 2026

echo.
echo ========================================
echo   מסלול טיולים אפקה 2026
echo   Starting both servers...
echo ========================================
echo.

:: Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

:: Check if node_modules exist, install if needed
if not exist "node_modules" (
    echo [SETUP] Installing root dependencies...
    call npm install
)
if not exist "express-server\node_modules" (
    echo [SETUP] Installing Express server dependencies...
    cd express-server
    call npm install
    cd ..
)
if not exist "nextjs-client\node_modules" (
    echo [SETUP] Installing Next.js dependencies...
    cd nextjs-client
    call npm install
    cd ..
)

:: Check .env files
if not exist "express-server\.env" (
    echo [WARNING] express-server\.env not found!
    echo           Run "npm run setup" or copy .env.example to .env
    echo.
)
if not exist "nextjs-client\.env.local" (
    echo [WARNING] nextjs-client\.env.local not found!
    echo           Run "npm run setup" or copy .env.example to .env.local
    echo.
)

echo [1/2] Starting Express auth server on port 4000...
start "Express Server - Port 4000" cmd /k "cd express-server && npm run dev"

:: Brief pause to let Express start first
timeout /t 2 /nobreak >nul

echo [2/2] Starting Next.js app on port 3000...
start "Next.js App - Port 3000" cmd /k "cd nextjs-client && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo.
echo   Next.js:   http://localhost:3000
echo   Express:   http://localhost:4000
echo.
echo   (close the server windows to stop)
echo ========================================
echo.

timeout /t 5 /nobreak >nul
start http://localhost:3000
