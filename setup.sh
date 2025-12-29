#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Kalivan Setup Script${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен${NC}"
    echo "Установите Node.js с https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓ Node.js версия: $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm не установлен${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm версия: $(npm -v)${NC}"
echo ""

# Install frontend dependencies
echo -e "${YELLOW}📦 Установка зависимостей фронтенда...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка установки фронтенда${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Фронтенд установлен${NC}"
cd ..

# Install backend dependencies
echo -e "${YELLOW}📦 Установка зависимостей бэкенда...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка установки бэкенда${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Бэкенд установлен${NC}"
cd ..

# Create .env files if they don't exist
echo -e "${YELLOW}📝 Создание .env файлов...${NC}"

if [ ! -f "frontend/.env.local" ]; then
    cat > frontend/.env.local << 'EOF'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3000/api
EOF
    echo -e "${YELLOW}⚠️  Заполните frontend/.env.local своими ключами Supabase${NC}"
fi

if [ ! -f "backend/.env" ]; then
    cat > backend/.env << 'EOF'
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGc...
JWT_SECRET=kalivan-super-secret-key-2024
FRONTEND_URL=http://localhost:5173
EOF
    echo -e "${YELLOW}⚠️  Заполните backend/.env своими ключами Supabase${NC}"
fi

echo ""
echo -e "${GREEN}✅ Установка завершена!${NC}"
echo ""
echo -e "${YELLOW}📚 Дальше:${NC}"
echo "1. Откройте SUPABASE_SETUP.md для настройки БД"
echo "2. Заполните переменные окружения в .env файлах"
echo "3. Запустите: npm run dev (в корневой папке)"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
