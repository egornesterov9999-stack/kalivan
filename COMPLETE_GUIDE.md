# 📖 Полный гайд Kalivan - Discord Clone

## 📋 Содержание

1. [Что это?](#что-это)
2. [Структура](#структура-проекта)
3. [Требования](#требования)
4. [Быстрый старт](#быстрый-старт)
5. [Архитектура](#архитектура)
6. [Основные функции](#основные-функции)
7. [API](#api)
8. [Troubleshooting](#troubleshooting)

## Что это?

**Kalivan** - это полнофункциональный чат-сервис, похожий на Discord, построенный на современных технологиях:

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js/Express + Socket.io
- **Database**: Supabase (PostgreSQL)
- **Real-time**: WebSocket + Supabase Realtime
- **Auth**: Supabase Auth + JWT

## Структура проекта

```
kalivan/
├── 📁 frontend/              # React приложение
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── components/      # UI компоненты
│   │   ├── store/           # Zustand хранилище (auth, chat)
│   │   ├── lib/             # Supabase, API клиент
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css        # Tailwind styles
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── 📁 backend/               # Express сервер
│   ├── src/
│   │   ├── routes/          # API маршруты
│   │   │   ├── auth.ts      # /auth/register, /auth/login
│   │   │   └── chat.ts      # /chat/* endpoints
│   │   ├── middleware/      # auth, error handling
│   │   └── index.ts         # Express + Socket.io
│   ├── tsconfig.json
│   └── package.json
│
├── 📁 supabase/
│   └── migrations/          # SQL scripts
│       └── 001_initial_schema.sql
│
├── 📄 README.md             # Основная документация
├── 📄 QUICKSTART.md         # 5 минут до рабочего приложения
├── 📄 SETUP.md              # Расширенная настройка
├── 📄 SUPABASE_SETUP.md     # Настройка БД
├── 📄 ENV_EXAMPLES.md       # Примеры переменных
├── 📄 setup.sh              # Linux/Mac скрипт
├── 📄 setup.bat             # Windows скрипт
└── 📄 package.json          # Root npm scripts
```

## Требования

- **Node.js**: 18.0.0 или выше
- **npm**: 9.0.0 или выше (или yarn)
- **Git**: для клонирования
- **Supabase**: бесплатный аккаунт на supabase.com

## Быстрый старт

### 1. Клонирование (0 мин)
```bash
cd funpay_bot
# Папка kalivan уже создана!
```

### 2. Supabase (2 мин)
```bash
# 1. Создайте проект на supabase.com
# 2. Откройте SQL Editor
# 3. Запустите все из: supabase/migrations/001_initial_schema.sql
# 4. Скопируйте ключи из Settings → API
```

### 3. Переменные окружения (1 мин)

**frontend/.env.local**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=ваш_публичный_ключ
VITE_API_URL=http://localhost:3000/api
```

**backend/.env**:
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=ваш_приватный_ключ
JWT_SECRET=ваш_секретный_ключ
FRONTEND_URL=http://localhost:5173
```

### 4. Установка (1.5 мин)
```bash
# Linux/Mac
bash setup.sh

# Windows
setup.bat

# Или вручную
cd frontend && npm install && cd ../backend && npm install && cd ..
```

### 5. Запуск (30 сек)

**Терминал 1**:
```bash
cd frontend
npm run dev
# http://localhost:5173
```

**Терминал 2**:
```bash
cd backend
npm run dev
# http://localhost:3000
```

## Архитектура

### Frontend Flow
```
Login/Register
    ↓
Dashboard (разделен на 3 части)
├── Server Sidebar (выбор сервера)
├── Channel Sidebar (каналы сервера)
└── Chat Window (сообщения + input)
    ├── Fetch messages
    ├── Real-time подписка
    └── Send message
```

### Backend Architecture
```
Express Server
├── Auth Routes (/api/auth)
│   ├── POST /register
│   └── POST /login
│
├── Chat Routes (/api/chat) - Protected
│   ├── GET /servers
│   ├── POST /servers
│   ├── GET /servers/:serverId/channels
│   ├── POST /servers/:serverId/channels
│   ├── GET /channels/:channelId/messages
│   └── POST /channels/:channelId/messages
│
└── WebSocket
    ├── join_channel
    ├── leave_channel
    ├── send_message
    └── new_message (broadcast)
```

### Data Flow
```
User Input → Store Action → API Call
                ↓
         Supabase Request
                ↓
         Response → Store Update
                ↓
         Component Re-render
```

## Основные функции

### ✅ Аутентификация
- Регистрация (email + username + password)
- Вход (email + password)
- Автоматическая сессия
- JWT токены (7 дней)

### ✅ Серверы
- Создание новых серверов
- Список своих серверов
- Выбор активного сервера
- Аватарки серверов

### ✅ Каналы
- Текстовые каналы
- Голосовые каналы (структура, не audio)
- История сообщений
- Список участников

### ✅ Сообщения
- Отправка текста
- История с временными метками
- Инфо об отправителе (аватар, имя)
- Real-time обновления
- Автоскролл к последнему

### ✅ UI/UX
- Темный тему (как Discord)
- Responsive дизайн
- Smooth анимации
- Error handling
- Loading states

## API

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "securepass123"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Chat (требует Authorization: Bearer token)

#### Get Servers
```bash
GET /api/chat/servers
Authorization: Bearer eyJhbGc...

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "My Server",
    "owner_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Server
```bash
POST /api/chat/servers
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "name": "New Server"
}

Response: 201 Created
{ ... server data ... }
```

#### Get Channels
```bash
GET /api/chat/servers/:serverId/channels
Authorization: Bearer eyJhbGc...

Response: 200 OK
[
  {
    "id": "uuid",
    "server_id": "uuid",
    "name": "general",
    "type": "text"
  }
]
```

#### Get Messages
```bash
GET /api/chat/channels/:channelId/messages
Authorization: Bearer eyJhbGc...

Response: 200 OK
[
  {
    "id": "uuid",
    "channel_id": "uuid",
    "user_id": "uuid",
    "content": "Hello!",
    "created_at": "2024-01-01T00:00:00Z",
    "user": {
      "username": "john",
      "avatar_url": "https://..."
    }
  }
]
```

#### Send Message
```bash
POST /api/chat/channels/:channelId/messages
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "content": "Hello, everyone!"
}

Response: 201 Created
{ ... message data ... }
```

## Troubleshooting

### ❌ "Cannot find module"
```bash
# Решение
cd frontend && npm install && cd ../backend && npm install
```

### ❌ "Connection refused"
```bash
# Проверьте:
# 1. Backend запущен? (должен быть на 3000)
# 2. Frontend указывает правильный URL в .env
# 3. Firewall блокирует порты?
```

### ❌ "Ошибка Supabase"
```bash
# Проверьте:
# 1. Правильность URL в .env
# 2. Правильность ключей в .env
# 3. Таблицы созданы? (запустите SQL миграцию)
```

### ❌ "RLS блокирует запросы"
```sql
-- Проверьте политики в Supabase:
-- Settings → Authentication → Policies
-- Должны быть созданы для всех таблиц
```

### ❌ "Сообщения не обновляются"
```bash
# Проверьте:
# 1. RealtimeSubscriber компонент добавлен
# 2. Supabase Realtime включен (Settings → Realtime)
# 3. Консоль на ошибки (F12)
```

### ❌ "Auth не работает"
```bash
# Проверьте:
# 1. Email Provider в Supabase включен
# 2. JWT_SECRET не пуст
# 3. Redirect URLs добавлены
```

## 🎯 Roadmap

- [ ] Голосовые каналы (WebRTC)
- [ ] Прямые сообщения
- [ ] Упоминания (@user)
- [ ] Эмодзи реакции
- [ ] Редактирование/удаление сообщений
- [ ] Юзер профили
- [ ] Приглашения на сервер
- [ ] Роли и разрешения
- [ ] Нотификации
- [ ] Загрузка файлов

## 📚 Документация

- [README.md](./README.md) - Основное описание
- [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт
- [SETUP.md](./SETUP.md) - Расширенная настройка
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Настройка БД
- [ENV_EXAMPLES.md](./ENV_EXAMPLES.md) - Переменные окружения

## 🔗 Ссылки

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [Socket.io Docs](https://socket.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)

## 📝 Лицензия

MIT License - используйте как угодно!

## 🤝 Помощь

Если возникнут проблемы:
1. Проверьте консоль браузера (F12)
2. Проверьте консоль терминала бэкенда
3. Проверьте переменные окружения
4. Запустите SQL миграцию заново
5. Перезагрузите приложение

---

**Enjoy building! 🚀**
