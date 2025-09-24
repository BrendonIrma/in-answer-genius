# Деплой на Timeweb Cloud

## 🚀 Полное руководство по развертыванию на [Timeweb Cloud](https://timeweb.cloud)

### Преимущества Timeweb Cloud:
- **Лучшие цены** среди российских IaaS-провайдеров
- **99,98% аптайм** с гарантированным SLA
- **17 дата-центров** по всему миру
- **Поддержка 24/7** на русском языке
- **Автоматическое масштабирование**
- **Простая панель управления**

---

## 📋 Подготовка проекта

### Структура проекта:
```
in-answer-genius/
├── Dockerfile                 # Фронтенд (Vite + Nginx)
├── nginx.conf                 # Конфигурация Nginx
├── docker-compose.yml         # Локальная разработка
├── env.example               # Пример переменных окружения
├── backend/
│   ├── Dockerfile            # Бэкенд (Node.js + Express)
│   ├── package.json
│   └── src/
└── src/                      # Фронтенд (React + Vite)
```

---

## 🛠️ Варианты деплоя

### Вариант 1: VDS/VPS (Рекомендуется)

#### 1. Создание сервера
1. Зайдите на [timeweb.cloud](https://timeweb.cloud)
2. Создайте аккаунт и подтвердите email
3. Перейдите в раздел "Облачные серверы"
4. Нажмите "Создать сервер"
5. Выберите конфигурацию:
   - **ОС**: Ubuntu 22.04 LTS
   - **RAM**: 2-4 GB (минимум)
   - **CPU**: 2-4 ядра
   - **SSD**: 20-40 GB
   - **Регион**: ближайший к вашим пользователям

#### 2. Подключение к серверу
```bash
# Подключение по SSH
ssh root@your-server-ip

# Обновление системы
apt update && apt upgrade -y

# Установка Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose -y

# Добавление пользователя в группу docker
usermod -aG docker $USER
```

#### 3. Загрузка проекта
```bash
# Клонирование репозитория
git clone https://github.com/your-username/in-answer-genius.git
cd in-answer-genius

# Создание файла переменных окружения
cp env.example .env
nano .env  # Заполните реальными значениями
```

#### 4. Запуск приложения
```bash
# Запуск через Docker Compose
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

#### 5. Настройка домена
1. В панели Timeweb Cloud добавьте домен
2. Настройте A-запись на IP вашего сервера
3. Обновите переменную `FRONTEND_URL` в `.env`
4. Перезапустите контейнеры: `docker-compose restart`

---

### Вариант 2: Kubernetes (Для высоких нагрузок)

#### 1. Создание кластера
1. В панели Timeweb Cloud выберите "Kubernetes"
2. Создайте новый кластер
3. Выберите конфигурацию нод

#### 2. Подготовка манифестов
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: in-answer-genius

---
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: in-answer-genius
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/in-answer-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3001"
        - name: FRONTEND_URL
          value: "https://your-domain.com"
        - name: YANDEX_API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: yandex-api-key
        - name: YANDEX_FOLDER_ID
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: yandex-folder-id

---
# k8s/backend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: in-answer-genius
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 3001
  type: ClusterIP

---
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: in-answer-genius
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/in-answer-frontend:latest
        ports:
        - containerPort: 80

---
# k8s/frontend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: in-answer-genius
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: in-answer-genius
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

#### 3. Деплой в Kubernetes
```bash
# Применение манифестов
kubectl apply -f k8s/

# Проверка статуса
kubectl get pods -n in-answer-genius
kubectl get services -n in-answer-genius
```

---

### Вариант 3: Managed Kubernetes (Самый простой)

1. Создайте Managed Kubernetes кластер в Timeweb Cloud
2. Используйте встроенные инструменты для деплоя
3. Загрузите Docker образы в Container Registry
4. Настройте Ingress и домены через веб-интерфейс

---

## 🔧 Настройка переменных окружения

### Обязательные переменные:
```bash
# API ключи YandexGPT
YANDEX_API_KEY=your_actual_api_key
YANDEX_FOLDER_ID=your_actual_folder_id

# Настройки приложения
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com

# База данных
DB_PATH=/app/data/analyses.db
```

### Получение API ключей YandexGPT:
1. Зайдите на [yandex.cloud](https://yandex.cloud)
2. Создайте сервисный аккаунт
3. Создайте API ключ
4. Получите Folder ID из консоли

---

## 📊 Мониторинг и логи

### Docker Compose:
```bash
# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f frontend

# Мониторинг ресурсов
docker stats

# Проверка здоровья
curl http://localhost:3001/api/health
curl http://localhost
```

### Kubernetes:
```bash
# Логи подов
kubectl logs -f deployment/backend -n in-answer-genius
kubectl logs -f deployment/frontend -n in-answer-genius

# Мониторинг ресурсов
kubectl top pods -n in-answer-genius
kubectl top nodes
```

---

## 🔒 Безопасность

### Настройка файрвола:
```bash
# UFW (Ubuntu)
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable

# Или iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -P INPUT DROP
```

### SSL сертификаты:
```bash
# Установка Certbot
apt install certbot python3-certbot-nginx -y

# Получение сертификата
certbot --nginx -d your-domain.com

# Автоматическое обновление
crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🚀 CI/CD с GitHub Actions

Создайте `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Timeweb Cloud

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/in-answer-genius
          git pull origin main
          docker-compose down
          docker-compose build
          docker-compose up -d
```

---

## 💰 Стоимость

### VDS/VPS (рекомендуется):
- **2 GB RAM, 2 CPU, 20 GB SSD**: ~300-500 ₽/месяц
- **4 GB RAM, 4 CPU, 40 GB SSD**: ~600-1000 ₽/месяц

### Kubernetes:
- **Managed Kubernetes**: от 1000 ₽/месяц
- **Собственный кластер**: зависит от нод

---

## 🆘 Troubleshooting

### Проблемы с подключением:
```bash
# Проверка статуса сервисов
systemctl status docker
docker-compose ps

# Проверка портов
netstat -tlnp | grep :80
netstat -tlnp | grep :3001
```

### Проблемы с базой данных:
```bash
# Проверка монтирования volumes
docker volume ls
docker volume inspect in-answer-genius_backend_data

# Резервное копирование
docker-compose exec backend cp /app/data/analyses.db /backup/
```

### Проблемы с доменом:
```bash
# Проверка DNS
nslookup your-domain.com
dig your-domain.com

# Проверка SSL
openssl s_client -connect your-domain.com:443
```

---

## 📞 Поддержка

- **Техподдержка Timeweb Cloud**: 24/7 в панели управления
- **Документация**: [docs.timeweb.cloud](https://docs.timeweb.cloud)
- **Сообщество**: Telegram чат Timeweb Cloud
- **Email поддержка**: support@timeweb.cloud

---

## ✅ Чек-лист деплоя

### Перед деплоем:
- [ ] Создан аккаунт на Timeweb Cloud
- [ ] Получены API ключи YandexGPT
- [ ] Настроен домен (опционально)
- [ ] Проект загружен на GitHub

### После деплоя:
- [ ] Сервер создан и настроен
- [ ] Docker и Docker Compose установлены
- [ ] Проект склонирован на сервер
- [ ] Переменные окружения настроены
- [ ] Приложение запущено
- [ ] Домен настроен (если используется)
- [ ] SSL сертификат установлен
- [ ] Мониторинг настроен
- [ ] Резервное копирование настроено

### Тестирование:
- [ ] Фронтенд доступен по домену
- [ ] API отвечает на `/api/health`
- [ ] Форма анализа работает
- [ ] Нет ошибок в логах
- [ ] SSL сертификат валиден