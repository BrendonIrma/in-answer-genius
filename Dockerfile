# Dockerfile для Timeweb Cloud - только фронтенд
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /opt/build

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Используем nginx для раздачи статических файлов
FROM nginx:alpine

# Устанавливаем curl для health check
RUN apk add --no-cache curl

# Копируем собранное приложение
COPY --from=0 /opt/build/dist/in-answer-genius/browser /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 80

# Добавляем health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]