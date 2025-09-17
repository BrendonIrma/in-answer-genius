# Инструкция по деплою на Vercel

## Автоматический деплой

### 1. Подключение к Vercel

1. **Войдите в Vercel Dashboard:**
   - Перейдите на [vercel.com](https://vercel.com)
   - Войдите через GitHub аккаунт

2. **Импортируйте проект:**
   - Нажмите "New Project"
   - Выберите репозиторий `BrendonIrma/in-answer-genius`
   - Vercel автоматически определит настройки (Vite + React)

3. **Настройки деплоя:**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### 2. Настройка кастомного домена

1. **В Vercel Dashboard:**
   - Перейдите в Settings → Domains
   - Добавьте домен: `inanswer.pro`
   - Следуйте инструкциям по настройке DNS

2. **DNS настройки:**
   ```
   Type: CNAME
   Name: @ (или www)
   Value: cname.vercel-dns.com
   ```

### 3. Автоматический деплой

После настройки каждый коммит в `main` ветку будет автоматически деплоиться:
- Push в GitHub → Vercel получает webhook
- Автоматическая сборка и деплой
- Уведомления в Vercel Dashboard

## Ручной деплой

```bash
# Установка Vercel CLI
npm i -g vercel

# Деплой
vercel

# Продакшен деплой
vercel --prod
```

## Проверка деплоя

1. **В Vercel Dashboard:**
   - Раздел "Deployments" показывает все деплои
   - Статус: Ready, Building, Error
   - Время деплоя и логи

2. **URL деплоя:**
   - Preview: `https://in-answer-genius-xxx.vercel.app`
   - Production: `https://inanswer.pro`

## Устранение проблем

- **Build ошибки**: Проверьте логи в Vercel Dashboard
- **Домен не работает**: Проверьте DNS настройки
- **Медленная загрузка**: Проверьте размер бандла и оптимизацию