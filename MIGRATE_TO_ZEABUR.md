# Миграция с Vercel на Zeabur

## 🚀 Полный переход на Zeabur

### Что нужно сделать:

1. **Отключить деплой на Vercel**
2. **Развернуть фронтенд на Zeabur**
3. **Развернуть бэкенд на Zeabur**
4. **Настроить переменные окружения**
5. **Обновить домены и CORS**

---

## 📋 Пошаговая инструкция

### 1. Отключение Vercel

#### В панели Vercel:
1. Зайдите в [vercel.com/dashboard](https://vercel.com/dashboard)
2. Найдите ваш проект "in-answer-genius"
3. Перейдите в Settings → General
4. В разделе "Danger Zone" нажмите "Delete Project"
5. Подтвердите удаление

#### Альтернативно (если хотите сохранить проект):
1. В Settings → Git
2. Отключите "Auto-deploy" для всех веток
3. Проект останется, но не будет автоматически обновляться

### 2. Деплой фронтенда на Zeabur

#### Создание проекта фронтенда:
1. Зайдите в [dash.zeabur.com](https://dash.zeabur.com/)
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub"
4. Подключите ваш репозиторий
5. **Важно**: Выберите корневую директорию (не backend!)
6. Zeabur автоматически определит Vite проект

#### Настройка переменных окружения для фронтенда:
```
NODE_ENV=production
VITE_API_URL=https://your-backend-domain.zeabur.app/api
```

### 3. Деплой бэкенда на Zeabur

#### Создание проекта бэкенда:
1. В том же проекте Zeabur нажмите "New Service"
2. Выберите "Deploy from GitHub"
3. Выберите тот же репозиторий
4. **Важно**: Выберите папку `backend` как корневую директорию
5. Zeabur определит Node.js проект

#### Настройка переменных окружения для бэкенда:
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.zeabur.app
YANDEX_API_KEY=your_actual_api_key
YANDEX_FOLDER_ID=your_actual_folder_id
DB_PATH=/tmp/analyses.db
```

### 4. Настройка доменов

#### Для фронтенда:
1. В панели управления фронтенд-сервисом
2. Перейдите в "Domains"
3. Добавьте ваш домен или используйте предоставленный Zeabur домен
4. Запомните этот URL - он понадобится для настройки бэкенда

#### Для бэкенда:
1. В панели управления бэкенд-сервисом
2. Перейдите в "Domains"
3. Добавьте домен для API (например: `api.yourdomain.com`)
4. Обновите переменную `VITE_API_URL` во фронтенде на этот URL

### 5. Обновление CORS в бэкенде

После получения домена фронтенда:
1. Обновите переменную `FRONTEND_URL` в бэкенде
2. Перезапустите бэкенд-сервис

---

## 🔧 Технические детали

### Структура проекта на Zeabur:
```
Project: in-answer-genius
├── Service 1: Frontend (Vite/React)
│   ├── Source: Root directory
│   ├── Type: Static Site
│   └── Domain: your-frontend-domain.zeabur.app
└── Service 2: Backend (Node.js/Express)
    ├── Source: backend/ directory
    ├── Type: Node.js
    └── Domain: your-backend-domain.zeabur.app
```

### Файлы конфигурации:
- ✅ `zeabur.json` (корневой) - для фронтенда
- ✅ `backend/zeabur.json` - для бэкенда
- ✅ `.zeaburignore` (корневой) - исключения для фронтенда
- ✅ `backend/.zeaburignore` - исключения для бэкенда

### Переменные окружения:

#### Фронтенд:
```
VITE_API_URL=https://your-backend-domain.zeabur.app/api
```

#### Бэкенд:
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.zeabur.app
YANDEX_API_KEY=your_api_key
YANDEX_FOLDER_ID=your_folder_id
DB_PATH=/tmp/analyses.db
```

---

## ✅ Проверочный список

### Перед миграцией:
- [ ] Сделать бэкап текущего проекта
- [ ] Записать все переменные окружения из Vercel
- [ ] Убедиться, что код загружен на GitHub

### После деплоя бэкенда:
- [ ] Проверить health check: `https://your-backend-domain.zeabur.app/api/health`
- [ ] Протестировать API endpoint
- [ ] Проверить логи на ошибки

### После деплоя фронтенда:
- [ ] Проверить, что сайт загружается
- [ ] Протестировать отправку формы
- [ ] Проверить, что API запросы работают
- [ ] Проверить CORS (отсутствие ошибок в консоли)

### Финальная проверка:
- [ ] Вся функциональность работает
- [ ] Нет ошибок в консоли браузера
- [ ] Нет ошибок в логах серверов
- [ ] Домены настроены корректно

---

## 🆘 Troubleshooting

### Проблемы с CORS:
```
Access to fetch at 'backend-url' from origin 'frontend-url' has been blocked by CORS policy
```
**Решение**: Проверить переменную `FRONTEND_URL` в бэкенде

### API не отвечает:
```
Failed to fetch
```
**Решение**: 
1. Проверить URL в `VITE_API_URL`
2. Проверить, что бэкенд запущен
3. Проверить логи бэкенда

### Ошибки сборки:
**Решение**: 
1. Проверить логи сборки в Zeabur
2. Убедиться, что все зависимости в `package.json`
3. Проверить версию Node.js

---

## 💰 Стоимость

Zeabur использует pay-as-you-use модель:
- **Фронтенд (Static)**: Бесплатно до определенного трафика
- **Бэкенд (Node.js)**: ~$1-5/месяц в зависимости от использования
- **Домены**: Бесплатно для поддоменов zeabur.app

---

## 📞 Поддержка

- [Zeabur Documentation](https://docs.zeabur.com/)
- [Zeabur Discord](https://discord.gg/zeabur)
- [GitHub Issues](https://github.com/zeabur/zeabur/issues)