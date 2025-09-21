#!/usr/bin/env python3

import requests
import json
from datetime import datetime

# === НАСТРОЙКИ ===
API_KEY = "AQVNxYCHpohp0EZn9wHmX4fxDfRB3XA9JjP0ssyh"
FOLDER_ID = "b1g4854pso9q87p5lg8p"

def test_yandex_gpt():
    """Тест YandexGPT с записью результата в файл"""
    
    result = []
    result.append("=== ТЕСТ YANDEXGPT ===")
    result.append(f"Время: {datetime.now()}")
    result.append(f"FOLDER_ID: {FOLDER_ID}")
    result.append(f"API_KEY: {API_KEY[:10]}...{API_KEY[-5:]}")
    result.append("-" * 50)
    
    url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    headers = {
        "Authorization": f"Api-Key {API_KEY}",
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

    try:
        response = requests.post(url, headers=headers, json=payload)
        result.append(f"Статус код: {response.status_code}")
        
        if response.status_code == 200:
            answer = response.json()["result"]["alternatives"][0]["message"]["text"]
            result.append("✅ Успешно! Ответ от ИИ:")
            result.append(answer)
        else:
            result.append(f"❌ Ошибка {response.status_code}:")
            result.append(response.text)
            
    except Exception as e:
        result.append(f"💥 Исключение: {e}")
    
    # Записываем результат в файл
    with open("test_result.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(result))
    
    print("Результат записан в test_result.txt")

if __name__ == "__main__":
    test_yandex_gpt()