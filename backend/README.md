# In Answer Backend API

Backend API для сервиса анализа видимости сайтов в ответах Yandex GPT.

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
```bash
cp env.example .env
```

Отредактируйте `.env` файл:
```env
# Backend Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# YandexGPT API Configuration
YANDEX_API_KEY=ваш_реальный_ключ
YANDEX_FOLDER_ID=ваш_реальный_id
```

### 3. Запуск
```bash
# Development режим
npm run dev

# Production режим
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Анализ сайта
```
POST /api/analysis
Content-Type: application/json

{
  "url": "https://example.com",
  "query": "ключевой запрос"
}
```

### История анализов
```
GET /api/analysis/history?limit=10
```

### Статистика
```
GET /api/analysis/stats
```

## База данных

Используется SQLite с better-sqlite3:
- **analyses** - таблица с результатами анализов
- **cache** - таблица кэширования (5 минут TTL)

## 🔧 Технологии

- **Node.js** + **Express**
- **better-sqlite3** - база данных
- **Axios** - HTTP клиент для YandexGPT
- **Joi** - валидация данных
- **Helmet** - безопасность
- **CORS** - кросс-доменные запросы
- **Rate Limiting** - ограничение запросов

## Безопасность

- API ключи хранятся на сервере
- Rate limiting (100 запросов/15 минут)
- Валидация входных данных
- CORS настройки
- Helmet для безопасности заголовков

## Мониторинг

- Логирование всех запросов
- Обработка ошибок
- Health check endpoint
- Кэширование результатов

## Деплой

1. Установите переменные окружения
2. Запустите `npm start`
3. Настройте reverse proxy (nginx)
4. Настройте SSL сертификат