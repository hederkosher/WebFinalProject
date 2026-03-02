#!/bin/bash

# Get script directory (project root)
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

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

# Start MongoDB (macOS with Homebrew)
if [[ "$OSTYPE" == "darwin"* ]] && command -v brew &> /dev/null; then
    echo "[SETUP] Starting MongoDB..."
    brew services start mongodb-community@8.0
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

# Create launcher scripts to avoid path/quoting issues (handles Hebrew, spaces, etc.)
LAUNCHER_EXPRESS=$(mktemp)
LAUNCHER_NEXT=$(mktemp)
cat > "$LAUNCHER_EXPRESS" << EOF
#!/bin/bash
cleanup() {
    if [[ "\$OSTYPE" == "darwin"* ]] && command -v brew &> /dev/null; then
        echo ""
        echo "[CLEANUP] Stopping MongoDB..."
        brew services stop mongodb-community@8.0
    fi
    exit 0
}
trap cleanup INT TERM
cd "$DIR/express-server" && npm run dev
cleanup
EOF
cat > "$LAUNCHER_NEXT" << EOF
#!/bin/bash
cd "$DIR/nextjs-client" && exec npm run dev
EOF
chmod +x "$LAUNCHER_EXPRESS" "$LAUNCHER_NEXT"

echo "[1/2] Starting Express auth server on port 4000..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"$LAUNCHER_EXPRESS\""
else
    "$LAUNCHER_EXPRESS" &
fi

# Wait for Express to be ready (up to 30 seconds)
echo "    Waiting for Express to start..."
for i in {1..30}; do
    if curl -s http://localhost:4000/health > /dev/null 2>&1; then
        echo "    Express is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "[WARNING] Express may not have started. Check the Express terminal for errors."
        echo "          Make sure MongoDB is running (run 'mongod' if using local MongoDB)."
    fi
    sleep 1
done

echo "[2/2] Starting Next.js app on port 3000..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"$LAUNCHER_NEXT\""
else
    "$LAUNCHER_NEXT" &
fi

echo ""
echo "========================================"
echo "  Both servers are starting!"
echo ""
echo "  Next.js:   http://localhost:3000"
echo "  Express:   http://localhost:4000"
echo ""
echo "  (close the server windows to stop - MongoDB will stop when Express closes)"
echo "========================================"
echo ""

sleep 5
open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null || true
