@echo off
REM Windows Setup Script for Kalivan

echo.
echo ========================================
echo    Kalivan Setup Script for Windows
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Install Node.js from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm version: %NPM_VERSION%
echo.

REM Install frontend
echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend
    pause
    exit /b 1
)
echo [OK] Frontend installed
cd ..

REM Install backend
echo [INFO] Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend
    pause
    exit /b 1
)
echo [OK] Backend installed
cd ..

REM Create .env files
echo [INFO] Creating .env files...

if not exist "frontend\.env.local" (
    (
        echo VITE_SUPABASE_URL=https://your-project.supabase.co
        echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        echo VITE_API_URL=http://localhost:3000/api
    ) > frontend\.env.local
    echo [WARNING] Fill frontend\.env.local with your Supabase keys
)

if not exist "backend\.env" (
    (
        echo PORT=3000
        echo SUPABASE_URL=https://your-project.supabase.co
        echo SUPABASE_KEY=eyJhbGc...
        echo JWT_SECRET=kalivan-super-secret-key-2024
        echo FRONTEND_URL=http://localhost:5173
    ) > backend\.env
    echo [WARNING] Fill backend\.env with your Supabase keys
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo [INFO] Next steps:
echo 1. Open SUPABASE_SETUP.md for database setup
echo 2. Fill .env files with your Supabase keys
echo 3. Run: npm run dev
echo.
pause
