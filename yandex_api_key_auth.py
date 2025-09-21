#!/usr/bin/env python3

import requests
import json
import time

# === НАСТРОЙКИ ===
API_KEY_ID = "ajeh426q8gm5uqba08gu"  # Идентификатор API ключа
FOLDER_ID = "b1g4854pso9q87p5lg8p"

def get_iam_token_from_api_key():
    """Получение IAM токена с использованием API ключа"""
    
    print("🔑 Получение IAM токена через API ключ...")
    print(f"📝 API Key ID: {API_KEY_ID}")
    print(f"📁 FOLDER_ID: {FOLDER_ID}")
    print("-" * 50)
    
    # URL для получения IAM токена
    url = "https://iam.api.cloud.yandex.net/iam/v1/tokens"
    
    # Заголовки запроса
    headers = {
        "Content-Type": "application/json"
    }
    
    # Тело запроса для получения IAM токена
    payload = {
        "yandexPassportOauthToken": API_KEY_ID
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"📊 Статус код: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            iam_token = result.get("iamToken")
            expires_at = result.get("expiresAt")
            
            if iam_token:
                print("✅ IAM токен получен успешно!")
                print(f"🔑 Токен: {iam_token[:10]}...{iam_token[-5:]}")
                print(f"⏰ Истекает: {expires_at}")
                return iam_token
            else:
                print("❌ IAM токен не найден в ответе")
                print("📝 Ответ:", json.dumps(result, indent=2, ensure_ascii=False))
                return None
        else:
            print(f"❌ Ошибка получения токена: {response.status_code}")
            try:
                error_data = response.json()
                print("📝 Детали ошибки:", json.dumps(error_data, indent=2, ensure_ascii=False))
            except:
                print("📝 Текст ошибки:", response.text)
            return None
            
    except requests.exceptions.Timeout:
        print("⏰ Таймаут запроса")
        return None
    except Exception as e:
        print(f"💥 Неожиданная ошибка: {e}")
        return None

def test_yandex_gpt_with_iam_token(iam_token):
    """Тест YandexGPT с полученным IAM токеном"""
    
    print("\n🚀 Тестирование YandexGPT с IAM токеном")
    print("-" * 50)
    
    url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    headers = {
        "Authorization": f"Bearer {iam_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "modelUri": f"gpt://{FOLDER_ID}/yandexgpt-lite",
        "completionOptions": {
            "temperature": 0.3,
            "maxTokens": 500
        },
        "messages": [
            {"role": "user", "text": "Что такое InAnswer.pro?"}
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"📊 Статус код: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            answer = result["result"]["alternatives"][0]["message"]["text"]
            print("✅ Успешно! Ответ от ИИ:")
            print(f"🤖 {answer}")
        else:
            print(f"❌ Ошибка {response.status_code}:")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2, ensure_ascii=False))
            except:
                print(response.text)
                
    except Exception as e:
        print(f"💥 Ошибка запроса: {e}")

if __name__ == "__main__":
    # Получаем IAM токен
    iam_token = get_iam_token_from_api_key()
    
    if iam_token:
        # Тестируем YandexGPT с IAM токеном
        test_yandex_gpt_with_iam_token(iam_token)
    else:
        print("\n📝 Альтернативные способы:")
        print("1. Проверить правильность API Key ID")
        print("2. Получить IAM токен через веб-интерфейс консоли")
        print("3. Настроить права доступа для API ключа")