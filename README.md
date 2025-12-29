# 🚀 Kalivan - Discord Clone

Современное приложение для общения в режиме реального времени, построенное на React, Node.js и Supabase.

## ✨ Возможности

- ✅ **Аутентификация** - Регистрация и авторизация с использованием Supabase Auth
- ✅ **Серверы и каналы** - Создание и управление серверами/каналами
- ✅ **Обмен сообщениями** - Отправка/получение сообщений в реальном времени
- ✅ **Real-time** - WebSocket для мгновенного обновления
- ✅ **Современный дизайн** - Темный UI с Tailwind CSS
- ✅ **Responsive** - Адаптивный дизайн для всех устройств
- ✅ **TypeScript** - Полная типизация проекта

## 🛠️ Требования

- **Node.js** 18+ 
- **npm** или **yarn**
- **Supabase** аккаунт ([supabase.com](https://supabase.com))

## 📁 Структура проекта

```
kalivan/
├── frontend/                 # React приложение
│   ├── src/
│   │   ├── components/       # React компоненты
│   │   ├── pages/            # Страницы приложения
│   │   ├── store/            # Zustand хранилище
│   │   ├── lib/              # Утилиты и API
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Node.js/Express сервер
│   ├── src/
│   │   ├── routes/           # API маршруты
│   │   ├── middleware/       # Middleware (auth)
│   │   └── index.ts          # Главный файл
│   ├── tsconfig.json
│   └── package.json
│
├── supabase/
│   └── migrations/           # SQL миграции
│
└── README.md
```

## 🚀 Быстрый старт

### 1️⃣ Клонирование и установка зависимостей

```bash
cd kalivan
cd frontend
npm install
cd ../backend
npm install
```

### 2️⃣ Настройка Supabase

1. Зайдите на [supabase.com](https://supabase.com) и создайте проект
2. Скопируйте URL и Anon Key из настроек проекта
3. Запустите SQL миграции из файла `supabase/migrations/001_initial_schema.sql`

### 3️⃣ Переменные окружения

**Frontend** (`frontend/.env.local`):
```env
VITE_SUPABASE_URL=ваш_supabase_url
VITE_SUPABASE_ANON_KEY=ваш_supabase_anon_key
VITE_API_URL=http://localhost:3000/api
```

**Backend** (`backend/.env`):
```env
PORT=3000
SUPABASE_URL=ваш_supabase_url
SUPABASE_KEY=ваш_supabase_service_key
JWT_SECRET=ваш_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

### 4️⃣ Запуск приложения

**Фронтенд:**
```bash
cd frontend
npm run dev
# Приложение откроется на http://localhost:5173
```

**Бэкенд** (в отдельном терминале):
```bash
cd backend
npm run dev
# Сервер запустится на http://localhost:3000
```

## 🔧 Основные функции

### Аутентификация
- Регистрация новых пользователей
- Вход по email/пароль
- JWT токены
- Сохранение сессии

### Сообщения
- Отправка текстовых сообщений
- История сообщений
- Информация об отправителе
- Временные метки

### Серверы
- Создание серверов
- Приглашение участников
- Управление каналами

### Каналы
- Текстовые каналы
- Голосовые каналы
- Категоризация

## 🗄️ Структура БД

### Таблицы
- **profiles** - Профили пользователей
- **servers** - Серверы
- **channels** - Каналы
- **messages** - Сообщения
- **direct_messages** - Прямые сообщения

## 🔐 Безопасность

- Row Level Security (RLS) в Supabase
- JWT аутентификация
- CORS настройки
- Валидация входных данных

## 📦 Используемые библиотеки

**Frontend:**
- React 18
- React Router
- Zustand (state management)
- Tailwind CSS
- Socket.io-client
- Axios
- React Icons

**Backend:**
- Express
- Socket.io
- JWT
- Bcrypt
- CORS

## 🐛 Troubleshooting

### Проблемы с подключением к Supabase
- Проверьте правильность URL и ключей
- Убедитесь, что таблицы созданы через SQL миграции

### WebSocket не подключается
- Проверьте CORS настройки в бэкенде
- Убедитесь, что фронтенд и бэкенд запущены на правильных портах

### Ошибки аутентификации
- Проверьте JWT_SECRET в бэкенде
- Убедитесь, что токен передается в заголовках

## 📝 Лицензия

MIT License

## 🤝 Контрибьютинг

Приветствуются pull requests и issues!

---

**Готово к использованию!** 🎉
