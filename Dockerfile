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
COPY backend-package.json package.json
RUN npm install --only=production

# Копируем код бэкенда
COPY backend-src ./src

# Создаем директорию для базы данных
RUN mkdir -p data

# Создаем .env файл для бэкенда
RUN echo 'NODE_ENV=production' > .env && \
    echo 'PORT=3001' >> .env && \
    echo 'DB_PATH=/opt/backend/data/analyses.db' >> .env

# Создаем скрипт запуска
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'nginx -g "daemon off;" &' >> /start.sh && \
    echo 'cd /opt/backend' >> /start.sh && \
    echo 'export YANDEX_API_KEY=${YANDEX_API_KEY}' >> /start.sh && \
    echo 'export YANDEX_FOLDER_ID=${YANDEX_FOLDER_ID}' >> /start.sh && \
    echo 'export NODE_ENV=production' >> /start.sh && \
    echo 'export PORT=3001' >> /start.sh && \
    echo 'export DB_PATH=/opt/backend/data/analyses.db' >> /start.sh && \
    echo 'npm start' >> /start.sh && \
    chmod +x /start.sh

# Открываем порт
EXPOSE 80

# Запускаем nginx и бэкенд
CMD ["/start.sh"]