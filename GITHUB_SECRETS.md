# GitHub Secrets для Kalivan Deploy

Перейдите в репозитории: Settings → Secrets and variables → Actions → New repository secret

Добавьте следующие секреты:

1. **VITE_SUPABASE_URL**
   - Значение: https://mwosxpdtrjcedrtdhwxg.supabase.co

2. **VITE_SUPABASE_ANON_KEY**
   - Значение: (ваш публичный anon ключ из Supabase)
   - (можно получить из Settings → API → anon public)

Пример комманды для добавления через GitHub CLI:
```bash
gh secret set VITE_SUPABASE_URL -b "https://mwosxpdtrjcedrtdhwxg.supabase.co"
gh secret set VITE_SUPABASE_ANON_KEY -b "ваш_anon_key"
```

После добавления секретов GitHub Actions автоматически:
1. Скомпилирует фронтенд (npm run build)
2. Загрузит на GitHub Pages
3. Сайт будет доступен на https://egornesterov9999-stack.github.io/kalivan/
