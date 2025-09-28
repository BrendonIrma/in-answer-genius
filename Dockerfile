# Dockerfile для Timeweb Cloud - фронтенд + бэкенд
FROM node:18-alpine

# Устанавливаем nginx
RUN apk add --no-cache nginx

# ===== ФРОНТЕНД =====
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Копируем фронтенд в nginx
RUN cp -r dist/in-answer-genius/browser/* /usr/share/nginx/html/

# ===== БЭКЕНД =====
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --only=production

# Копируем код бэкенда
COPY backend/src ./src

# Создаем директорию для БД
RUN mkdir -p data

# ===== NGINX КОНФИГУРАЦИЯ =====
COPY nginx.conf /etc/nginx/nginx.conf

# ===== СКРИПТ ЗАПУСКА =====
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'nginx -g "daemon off;" &' >> /start.sh && \
    echo 'cd /app/backend' >> /start.sh && \
    echo 'export YANDEX_API_KEY=${YANDEX_API_KEY}' >> /start.sh && \
    echo 'export YANDEX_FOLDER_ID=${YANDEX_FOLDER_ID}' >> /start.sh && \
    echo 'export NODE_ENV=production' >> /start.sh && \
    echo 'export PORT=3001' >> /start.sh && \
    echo 'export DB_PATH=/app/backend/data/analyses.db' >> /start.sh && \
    echo 'npm start' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]