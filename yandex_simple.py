import requests

API_KEY = "AQVN0SCNpELF9pagIh5CU0Gt2UNzveLcNEuOy9Aw"
FOLDER_ID = "b1g4854pso9q87p5lg8p"

url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
headers = {"Authorization": f"Api-Key {API_KEY}", "Content-Type": "application/json"}
payload = {
    "modelUri": f"gpt://{FOLDER_ID}/yandexgpt-lite",
    "completionOptions": {"temperature": 0.3, "maxTokens": 500},
    "messages": [
        {"role": "user", "text": "Что такое InAnswer.pro?"}
    ]
}

response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    print("✅ Ответ:", response.json()["result"]["alternatives"][0]["message"]["text"])
else:
    print("❌ Ошибка:", response.status_code, response.text)