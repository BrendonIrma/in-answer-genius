# Инструкция по деплою на GitHub Pages

## Автоматический деплой

1. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в Settings → Pages
   - Source: GitHub Actions
   - Сохраните настройки

2. **Настройте кастомный домен (опционально):**
   - В Settings → Pages → Custom domain введите: `inanswer.pro`
   - Включите "Enforce HTTPS"

3. **Настройте DNS для домена inanswer.pro:**
   ```
   Type: CNAME
   Name: @ (или www)
   Value: brendoni.github.io
   ```

## Ручной деплой

```bash
# Сборка проекта
npm run build

# Копирование файлов в gh-pages ветку (если используется старый метод)
# git subtree push --prefix dist origin gh-pages
```

## Проверка деплоя

После пуша в main ветку:
1. GitHub Actions автоматически соберет и задеплоит проект
2. Сайт будет доступен по адресу: `https://inanswer.pro`
3. Проверить статус можно в разделе Actions репозитория

## Устранение проблем

- **404 ошибки**: Проверьте base path в vite.config.ts
- **Проблемы с CSS**: Убедитесь, что все пути к ресурсам корректные
- **Домен не работает**: Проверьте DNS настройки и CNAME файл