# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Создаем директорию для базы данных
RUN mkdir -p data

# Открываем порт
EXPOSE 3001

# Устанавливаем переменные окружения по умолчанию
ENV NODE_ENV=production
ENV PORT=3001

# Запускаем приложение
CMD ["npm", "start"]