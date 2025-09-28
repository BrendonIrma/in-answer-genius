# Dockerfile для Timeweb Cloud - фронтенд + бэкенд
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

# Устанавливаем nginx
RUN apk add --no-cache nginx

# Копируем собранное приложение
RUN cp -r dist/in-answer-genius/browser/* /var/www/localhost/htdocs/

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Устанавливаем зависимости бэкенда
WORKDIR /opt/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Копируем код бэкенда
COPY backend/src ./src
COPY backend/package*.json ./
COPY backend/env.example ./

# Создаем директорию для базы данных
RUN mkdir -p data

# Создаем скрипт запуска
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'nginx -g "daemon off;" &' >> /start.sh && \
    echo 'cd /opt/backend && npm start' >> /start.sh && \
    chmod +x /start.sh

# Открываем порт
EXPOSE 80

# Запускаем nginx и бэкенд
CMD ["/start.sh"]