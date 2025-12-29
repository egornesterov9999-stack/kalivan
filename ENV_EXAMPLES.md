# Kalivan - Примеры переменных окружения

## Frontend - .env.local

```env
# Supabase - получите из Settings → API
# Это публичные ключи, безопасно хранить в фронтенде
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk0NzY1NDEyLCJleHAiOjE3MjY0NDA0MTJ9.xxxxxxxxxxxxxxxxxxxx

# API - адрес вашего бэкенда
VITE_API_URL=http://localhost:3000/api

# Production
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_API_URL=https://api.your-domain.com
```

## Backend - .env

```env
# Server
PORT=3000

# Supabase - получите из Settings → API
# Используйте service_role secret ключ (НЕ публикуйте!)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2OTQ3NjU0MTIsImV4cCI6MTcyNjQ0MDQxMn0.xxxxxxxxxxxxxxxxxxxx

# JWT - Генерируйте безопасный ключ!
# linux/mac: openssl rand -hex 32
# windows: powershell -Command "[System.Convert]::ToHexString((1..32 | ForEach-Object {Get-Random -Maximum 256}))"
JWT_SECRET=kalivan-super-secret-jwt-key-2024-change-this-in-production-12345

# CORS
FRONTEND_URL=http://localhost:5173

# Production
# PORT=3000
# NODE_ENV=production
```

## Как получить ключи Supabase?

1. Создайте проект на [supabase.com](https://supabase.com)
2. Перейдите в **Settings → API**
3. Скопируйте нужные ключи:

### Frontend (публичные)
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** → `VITE_SUPABASE_ANON_KEY`

### Backend (приватные!)
- **Project URL** → `SUPABASE_URL`
- **service_role secret** → `SUPABASE_KEY` ⚠️ **НИКОГДА не публикуйте!**

## Как сгенерировать JWT_SECRET?

### Linux/Mac
```bash
openssl rand -hex 32
```

### Windows (PowerShell)
```powershell
-join ((1..32 | ForEach-Object {[System.Convert]::ToString((Get-Random -Maximum 256), 16).PadLeft(2, '0')}))
```

## Development vs Production

### Development
```env
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_API_URL=http://localhost:3000/api
JWT_SECRET=dev-secret-key-short
```

### Production
```env
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_API_URL=https://api.kalivan.app
JWT_SECRET=production-secret-key-very-long-and-secure-12345abcde
```

## ⚠️ Безопасность

- ❌ Никогда не коммитьте .env файлы
- ❌ Никогда не публикуйте `SUPABASE_KEY` и `JWT_SECRET`
- ✅ Используйте разные ключи для dev и production
- ✅ Регулярно ротируйте `JWT_SECRET`
- ✅ Используйте переменные окружения для секретов

## Проверка

```bash
# Frontend - Check if .env.local is loaded
npm run dev

# Backend - Check if .env is loaded
npm run dev
```

Если видите сообщения об ошибке подключения - проверьте ключи!
