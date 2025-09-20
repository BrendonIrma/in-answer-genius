# Настройка YandexGPT для InAnswer Genius

## Обзор

Проект интегрирован с YandexGPT API для анализа сайтов и генерации рекомендаций по оптимизации для ИИ-поисковиков.

## Быстрый старт

### 1. Настройка переменных окружения

1. Скопируйте файл `env.example` в `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Отредактируйте `.env.local` и добавьте ваши данные:
   ```env
   VITE_YANDEX_API_KEY=AQVN0SCNpELF9pagIh5CU0Gt2UNzveLcNEuOy9Aw
   VITE_YANDEX_FOLDER_ID=b1g4854pso9q87p5lg8p
   ```

### 2. Получение API ключа

1. Войдите в консоль Yandex Cloud: https://console.cloud.yandex.ru/
2. Перейдите в **IAM → API ключи**
3. Создайте новый ключ или используйте существующий
4. Скопируйте ключ в переменную `VITE_YANDEX_API_KEY`

### 3. Получение FOLDER_ID

1. В консоли Yandex Cloud выберите нужный каталог
2. ID каталога будет в URL: `console.cloud.yandex.ru/folders/{FOLDER_ID}`
3. Скопируйте ID в переменную `VITE_YANDEX_FOLDER_ID`

### 4. Настройка прав доступа

Убедитесь, что у сервисного аккаунта есть роль `ai.languageModels.user`:

1. В консоли Yandex Cloud перейдите в **IAM → Роли**
2. Найдите ваш сервисный аккаунт
3. Назначьте роль `ai.languageModels.user` для каталога

### 5. Запуск приложения

```bash
npm install
npm run dev
```

## Файлы интеграции

- `src/services/yandexGPTService.ts` - основной сервис для работы с YandexGPT API
- `src/services/analysisService.ts` - обновленный сервис анализа с интеграцией YandexGPT
- `env.example` - пример файла с переменными окружения

## Функциональность

### YandexGPTService

- `generateCompletion(prompt, options)` - генерация ответа по промпту
- `analyzeText(text)` - анализ текста
- `answerQuestion(question, context)` - ответ на вопрос с контекстом

### AnalysisService

- `analyzeWebsite(url, query)` - полный анализ сайта
- `checkYandexAiAnswer(query, targetUrl)` - проверка попадания в ИИ-ответ
- `analyzeContentWithGPT(content, query)` - анализ контента
- `fetchSiteContent(url)` - получение контента сайта

## Тестирование

Для тестирования API созданы скрипты:

```bash
# Тест с API ключом
python3 yandex_simple.py

# Тест с IAM токеном
python3 yandex_iam_direct.py

# Диагностика
python3 yandex_debug.py
```

## Устранение неполадок

### Ошибка 403 "Permission denied"

- Проверьте права доступа сервисного аккаунта
- Убедитесь, что роль `ai.languageModels.user` назначена
- Проверьте правильность FOLDER_ID

### Ошибка 401 "Unauthorized"

- Проверьте правильность API ключа
- Убедитесь, что ключ не истек

### Сервис YandexGPT не включен

- В консоли Yandex Cloud убедитесь, что сервис YandexGPT включен в каталоге
- Проверьте наличие активной подписки

## Безопасность

- Никогда не коммитьте API ключи в git
- Используйте переменные окружения для хранения секретов
- Регулярно ротируйте API ключи

## Поддержка

При возникновении проблем:
1. Проверьте логи в консоли браузера
2. Убедитесь в правильности настройки переменных окружения
3. Проверьте статус сервисов Yandex Cloud