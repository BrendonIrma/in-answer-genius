import requests

# === НАСТРОЙКИ ===
IAM_TOKEN = "ваш_iam_токен"  # ← замените на реальный IAM токен
FOLDER_ID = "b1g4854pso9q87p5lg8p"

url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
headers = {
    "Authorization": f"Bearer {IAM_TOKEN}",
    "Content-Type": "application/json"
}
payload = {
    "modelUri": f"gpt://{FOLDER_ID}/yandexgpt-lite",
    "completionOptions": {"temperature": 0.3, "maxTokens": 500},
    "messages": [
        {"role": "user", "text": "Что такое InAnswer.pro?"}
    ]
}

print("🚀 Тестирование YandexGPT с IAM токеном")
print(f"📁 FOLDER_ID: {FOLDER_ID}")
print(f"🔑 IAM_TOKEN: {IAM_TOKEN[:10]}...{IAM_TOKEN[-5:] if len(IAM_TOKEN) > 15 else IAM_TOKEN}")
print("-" * 50)

response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    print("✅ Ответ:", response.json()["result"]["alternatives"][0]["message"]["text"])
else:
    print("❌ Ошибка:", response.status_code, response.text)