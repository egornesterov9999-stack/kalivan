# 🚀 Быстрый старт Kalivan

## ⏱️ 5 минут до рабочего приложения

### Шаг 1: Подготовка Supabase (2 мин)

```bash
# 1. Создайте проект на supabase.com
# 2. Получите ключи из Settings → API
# 3. Запустите SQL из supabase/migrations/001_initial_schema.sql в SQL Editor
```

### Шаг 2: Настройка переменных окружения (1 мин)

**Frontend** - `frontend/.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_URL=http://localhost:3000/api
```

**Backend** - `backend/.env`:
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGc...
JWT_SECRET=kalivan-super-secret-key-2024
FRONTEND_URL=http://localhost:5173
```

### Шаг 3: Установка зависимостей (1.5 мин)

```bash
cd kalivan/frontend
npm install
cd ../backend
npm install
```

### Шаг 4: Запуск приложения (0.5 мин)

**Терминал 1 - Frontend:**
```bash
cd frontend
npm run dev
# http://localhost:5173
```

**Терминал 2 - Backend:**
```bash
cd backend
npm run dev
# http://localhost:3000
```

## ✅ Готово!

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend**: http://localhost:3000
- 📱 **Создайте аккаунт** и начните общаться!

## 🎯 Тестирование

1. Откройте http://localhost:5173
2. Нажмите "Зарегистрироваться"
3. Заполните форму и создайте аккаунт
4. Создайте первый сервер кнопкой "+"
5. Начните отправлять сообщения!

## 📚 Дополнительно

- [README.md](./README.md) - Полная документация
- [SETUP.md](./SETUP.md) - Расширенная настройка
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Настройка БД

## 🆘 Помощь

| Проблема | Решение |
|----------|---------|
| "Cannot find module" | Запустите `npm install` в папке |
| "Connection refused" | Проверьте PORT и URL в .env |
| "Ошибка Supabase" | Проверьте ключи в .env |
| "RLS блокирует" | Запустите SQL миграцию |

---

**Happy chatting! 🎉**
