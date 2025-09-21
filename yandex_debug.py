import requests
import json

# === ВАШИ ДАННЫЕ ===
API_KEY = "AQVN0SCNpELF9pagIh5CU0Gt2UNzveLcNEuOy9Aw"
FOLDER_ID = "b1g4854pso9q87p5lg8p"

print("🔍 Диагностика подключения к YandexGPT API")
print(f"📁 FOLDER_ID: {FOLDER_ID}")
print(f"🔑 API_KEY: {API_KEY[:10]}...{API_KEY[-5:]}")
print("-" * 50)

# Тест 1: Проверка доступности API
print("1️⃣ Проверка доступности API...")
url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
headers = {
    "Authorization": f"Api-Key {API_KEY}",
    "Content-Type": "application/json"
}

# Минимальный запрос
payload = {
    "modelUri": f"gpt://{FOLDER_ID}/yandexgpt-lite",
    "completionOptions": {
        "temperature": 0.1,
        "maxTokens": 10
    },
    "messages": [
        {"role": "user", "text": "Привет"}
    ]
}

try:
    response = requests.post(url, headers=headers, json=payload, timeout=10)
    print(f"📊 Статус код: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Успешное подключение!")
        print(f"🤖 Ответ: {result['result']['alternatives'][0]['message']['text']}")
    else:
        print(f"❌ Ошибка {response.status_code}")
        try:
            error_data = response.json()
            print("📝 Детали ошибки:")
            print(json.dumps(error_data, indent=2, ensure_ascii=False))
        except:
            print("📝 Текст ошибки:")
            print(response.text)
            
except requests.exceptions.Timeout:
    print("⏰ Таймаут запроса")
except requests.exceptions.ConnectionError:
    print("🌐 Ошибка подключения к интернету")
except Exception as e:
    print(f"💥 Неожиданная ошибка: {e}")

print("\n" + "="*50)
print("🔧 Возможные решения:")
print("1. Проверьте правильность FOLDER_ID в консоли Yandex Cloud")
print("2. Убедитесь, что API ключ имеет роль 'ai.languageModels.user'")
print("3. Проверьте, что сервис YandexGPT включен в каталоге")
print("4. Убедитесь, что у вас есть активная подписка")
print("5. Попробуйте создать новый API ключ")