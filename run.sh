#!/usr/bin/env bash

# ==============================================================================
# Retail Sales & Customer Analytics Dashboard - Unified Startup Script
# Automatically configures environment, dependencies, database, and launches app.
# ==============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "====================================================================="
echo "   RetailPulse - Sales & Customer Analytics Dashboard"
echo "====================================================================="

# 1. Check Python
if ! command -v python3 &> /dev/null; then
    echo "[!] Error: python3 is not installed or not in PATH."
    exit 1
fi

# 2. Check Node / npm
if ! command -v npm &> /dev/null; then
    echo "[!] Error: npm is not installed or not in PATH."
    exit 1
fi

# 3. Setup backend environment file if missing
if [ ! -f "backend/.env" ]; then
    echo "[*] Creating backend/.env from backend/.env.example..."
    cp backend/.env.example backend/.env
fi

# 4. Setup Python Virtual Environment
if [ ! -d "backend/venv" ]; then
    echo "[*] Setting up Python virtual environment in backend/venv..."
    python3 -m venv backend/venv
    echo "[*] Installing Python backend dependencies..."
    ./backend/venv/bin/pip install --upgrade pip
    ./backend/venv/bin/pip install -r backend/requirements.txt
fi

# 5. Check Frontend Dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "[*] Installing frontend npm packages (this only runs once)..."
    (cd frontend && npm install)
fi

# 6. Seed Database if needed
echo "[*] Verifying database status..."
(cd backend && ./venv/bin/python -c "
from db import get_db_status
status = get_db_status()
if status.get('status') != 'connected' or status.get('counts', {}).get('customers', 0) < 100:
    import seed_data
    seed_data.seed_database()
")

echo "---------------------------------------------------------------------"
echo " [OK] Starting Servers:"
echo "      Backend REST API:  http://127.0.0.1:5001"
echo "      Frontend UI:       http://127.0.0.1:5173"
echo "---------------------------------------------------------------------"

# Start Backend Server
(cd backend && ./venv/bin/python app.py) &
BACKEND_PID=$!

# Start Frontend Dev Server
(cd frontend && npm run dev -- --host 127.0.0.1 --port 5173) &
FRONTEND_PID=$!

# Trap Ctrl+C to stop both processes cleanly
cleanup() {
    echo ""
    echo "[*] Stopping RetailPulse services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

# Wait 2 seconds and open browser
sleep 2
if command -v open &> /dev/null; then
    open "http://127.0.0.1:5173" 2>/dev/null || true
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://127.0.0.1:5173" 2>/dev/null || true
fi

echo "[*] Applications running. Press Ctrl+C to stop."
wait
