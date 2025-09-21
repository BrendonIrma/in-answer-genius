# 🔧 Настройка YandexGPT API

## 📋 Пошаговая инструкция

### 1. Получение API ключа

1. **Зайдите в консоль Yandex Cloud:**
   - Откройте https://console.cloud.yandex.ru/
   - Войдите в свой аккаунт

2. **Создайте API ключ:**
   - Перейдите в раздел **IAM** → **API ключи**
   - Нажмите **"Создать новый ключ"**
   - Выберите сервисный аккаунт или создайте новый
   - Скопируйте созданный ключ (начинается с `AQVN...`)

### 2. Получение FOLDER_ID

1. **Найдите ID каталога:**
   - В консоли Yandex Cloud выберите нужный каталог
   - ID каталога будет в URL: `console.cloud.yandex.ru/folders/{FOLDER_ID}`
   - Или в настройках каталога

2. **Формат FOLDER_ID:**
   - Должен быть 20-символьной строкой
   - Пример: `b1g4854pso9q87p5lg8p`

### 3. Настройка прав доступа

1. **Убедитесь, что у сервисного аккаунта есть роль:**
   - `ai.languageModels.user` - для использования YandexGPT
   - `ai.languageModels.admin` - для полного доступа

2. **Проверьте квоты:**
   - В разделе **AI** → **Foundation Models**
   - Убедитесь, что у вас есть доступ к YandexGPT

### 4. Настройка .env файла

Отредактируйте файл `backend/.env`:

```env
# Backend Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# YandexGPT API Configuration
YANDEX_API_KEY=AQVN0SCNpELF9pagIh5CU0Gt2UNzveLcNEuOy9Aw
YANDEX_FOLDER_ID=b1g4854pso9q87p5lg8p

# Database Configuration
DB_PATH=./data/analyses.db

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Проверка настройки

Запустите тест:

```bash
cd backend
node test-api.js
```

Ожидаемый результат:
```
✅ Соединение успешно!
🤖 Ответ: Привет! Это тестовое сообщение.
🎉 API ключи работают корректно!
```

### 6. Перезапуск сервера

После настройки перезапустите бэкенд:

```bash
# Остановите текущий процесс (Ctrl+C)
# Затем запустите заново
npm run dev
```

## 🔍 Диагностика проблем

### Ошибка 401 - Неверный API ключ
- Проверьте правильность `YANDEX_API_KEY`
- Убедитесь, что ключ не истек
- Проверьте, что ключ скопирован полностью

### Ошибка 403 - Недостаточно прав
- Убедитесь, что у сервисного аккаунта есть роль `ai.languageModels.user`
- Проверьте, что аккаунт активен

### Ошибка 404 - Неверный FOLDER_ID
- Проверьте правильность `YANDEX_FOLDER_ID`
- Убедитесь, что каталог существует и доступен

### Таймаут
- Проверьте интернет-соединение
- Попробуйте увеличить таймаут в коде

## 📚 Полезные ссылки

- [Документация YandexGPT](https://yandex.cloud/ru/docs/foundation-models/)
- [Консоль Yandex Cloud](https://console.cloud.yandex.ru/)
- [Управление API ключами](https://console.cloud.yandex.ru/iam/api-keys)
- [Настройка ролей](https://console.cloud.yandex.ru/iam/roles)