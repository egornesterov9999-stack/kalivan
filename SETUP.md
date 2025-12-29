# Kalivan - Настройка и развертывание

## ⚙️ Переменные окружения

### Frontend (.env.local)

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)

```env
# Server
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🚀 Развертывание

### Vercel (Frontend)

1. Подключите репозиторий к Vercel
2. Установите переменные окружения
3. Deploy

### Heroku (Backend)

```bash
heroku create your-app-name
heroku config:set PORT=3000 SUPABASE_URL=... SUPABASE_KEY=... JWT_SECRET=...
git push heroku main
```

### Docker

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_SUPABASE_URL=...
      - VITE_SUPABASE_ANON_KEY=...

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - SUPABASE_URL=...
      - SUPABASE_KEY=...
      - JWT_SECRET=...
```

## 🔗 Интеграция Supabase

### SQL Миграция

1. Откройте Supabase Dashboard
2. Перейдите в SQL Editor
3. Запустите миграцию из `supabase/migrations/001_initial_schema.sql`

### RLS Политики

Уже настроены в SQL миграции:
- Пользователи видят только свои серверы
- Сообщения видны только в своих каналах
- Прямые сообщения видны только участникам

## 📱 API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Chat
- `GET /api/chat/servers` - Список серверов
- `POST /api/chat/servers` - Создание сервера
- `GET /api/chat/servers/:serverId/channels` - Каналы сервера
- `POST /api/chat/servers/:serverId/channels` - Создание канала
- `GET /api/chat/channels/:channelId/messages` - Сообщения
- `POST /api/chat/channels/:channelId/messages` - Отправка сообщения

## 🔄 WebSocket Events

- `join_channel` - Присоединиться к каналу
- `leave_channel` - Покинуть канал
- `send_message` - Отправить сообщение
- `new_message` - Получить новое сообщение
