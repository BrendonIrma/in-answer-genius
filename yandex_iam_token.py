import requests

# === НАСТРОЙКИ ===
# Для получения IAM токена используйте команду:
# yc iam create-token
# Или получите токен через консоль Yandex Cloud

IAM_TOKEN = "ваш_iam_токен"  # ← замените на реальный IAM токен
FOLDER_ID = "b1g4854pso9q87p5lg8p"  # ← ID каталога

url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
headers = {
    "Authorization": f"Bearer {IAM_TOKEN}",
    "Content-Type": "application/json"
}
payload = {
    "modelUri": f"gpt://{FOLDER_ID}/yandexgpt-lite",
    "completionOptions": {
        "temperature": 0.3,
        "maxTokens": 100
    },
    "messages": [
        {"role": "user", "text": "Кто ты?"}
    ]
}

response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    answer = response.json()["result"]["alternatives"][0]["message"]["text"]
    print("✅ Успешно! Ответ от ИИ:")
    print(answer)
else:
    print(f"❌ Ошибка {response.status_code}:")
    print(response.text)