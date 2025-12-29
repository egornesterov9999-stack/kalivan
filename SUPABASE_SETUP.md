# Настройка Supabase для Kalivan

## 1️⃣ Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "New Project"
3. Заполните форму:
   - Organization: Выберите или создайте
   - Project name: `kalivan`
   - Database password: Сохраните где-то
   - Region: Выберите ближайший регион
   - Нажмите "Create new project"

## 2️⃣ Получение ключей доступа

1. Перейдите в Settings → API
2. Скопируйте:
   - **Project URL** → `VITE_SUPABASE_URL` (frontend) и `SUPABASE_URL` (backend)
   - **anon public** → `VITE_SUPABASE_ANON_KEY` (frontend)
   - **service_role secret** → `SUPABASE_KEY` (backend)

## 3️⃣ Создание таблиц и политик

1. Откройте **SQL Editor** в Supabase Dashboard
2. Нажмите "New Query"
3. Скопируйте весь код из `supabase/migrations/001_initial_schema.sql`
4. Нажмите "Run"
5. Должны появиться таблицы:
   - profiles
   - servers
   - channels
   - messages
   - direct_messages

## 4️⃣ Настройка Authentication

1. Перейдите в Authentication → Providers
2. Убедитесь, что включены:
   - Email
3. Перейдите в URL Configuration
4. Добавьте в "Redirect URLs":
   - http://localhost:5173
   - https://your-domain.com (если деплоим)

## 5️⃣ Включение Row Level Security (RLS)

RLS уже включена в SQL миграции, но проверьте:

1. Перейдите в Authentication → Policies
2. Для каждой таблицы (profiles, servers, channels, messages, direct_messages):
   - Должны быть созданы политики
   - Убедитесь, что включены

## 6️⃣ Тестирование подключения

```bash
# В терминале frontend
curl -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/profiles \
  -H "apikey: $VITE_SUPABASE_ANON_KEY"
```

## 🔗 Полезные ссылки

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

## 🐛 Troubleshooting

### "Ошибка при подключении к Supabase"
- Проверьте правильность URL и ключей в .env
- Убедитесь, что проект активен в Supabase Dashboard

### "Таблицы не созданы"
- Повторно запустите SQL миграцию
- Проверьте консоль на ошибки

### "RLS блокирует запросы"
- Проверьте политики в Settings → RLS
- Убедитесь, что политики созданы правильно

### "Auth не работает"
- Проверьте Email Provider в Authentication → Providers
- Убедитесь, что добавили redirect URL
