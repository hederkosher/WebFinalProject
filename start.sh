#!/bin/bash

echo ""
echo "========================================"
echo "  Travel Routes Afeka 2026"
echo "  Starting both servers..."
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Download from: https://nodejs.org"
    exit 1
fi

# Check if node_modules exist, install if needed
if [ ! -d "node_modules" ]; then
    echo "[SETUP] Installing root dependencies..."
    npm install
fi
if [ ! -d "express-server/node_modules" ]; then
    echo "[SETUP] Installing Express server dependencies..."
    (cd express-server && npm install)
fi
if [ ! -d "nextjs-client/node_modules" ]; then
    echo "[SETUP] Installing Next.js dependencies..."
    (cd nextjs-client && npm install)
fi

# Check .env files
if [ ! -f "express-server/.env" ]; then
    echo "[WARNING] express-server/.env not found!"
    echo "          Run 'npm run setup' or copy .env.example to .env"
    echo ""
fi
if [ ! -f "nextjs-client/.env.local" ]; then
    echo "[WARNING] nextjs-client/.env.local not found!"
    echo "          Run 'npm run setup' or copy .env.example to .env.local"
    echo ""
fi

echo "[INFO] Starting both servers (Express + Next.js)..."
echo ""
echo "  Next.js:   http://localhost:3000"
echo "  Express:   http://localhost:4000"
echo ""
echo "  Press Ctrl+C to stop"
echo "========================================"
echo ""

# Open browser after a short delay (in background)
(sleep 5 && open http://localhost:3000 2>/dev/null) &

npm run dev
