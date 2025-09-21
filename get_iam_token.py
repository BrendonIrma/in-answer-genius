#!/usr/bin/env python3

import subprocess
import sys
import requests

def get_iam_token():
    """Получение IAM токена с помощью yc CLI"""
    
    print("🔑 Получение IAM токена...")
    
    try:
        # Пытаемся получить токен через yc CLI
        result = subprocess.run(
            ["yc", "iam", "create-token"], 
            capture_output=True, 
            text=True, 
            timeout=30
        )
        
        if result.returncode == 0:
            token = result.stdout.strip()
            print(f"✅ IAM токен получен: {token[:10]}...{token[-5:]}")
            return token
        else:
            print(f"❌ Ошибка yc CLI: {result.stderr}")
            return None
            
    except subprocess.TimeoutExpired:
        print("⏰ Таймаут при получении токена")
        return None
    except FileNotFoundError:
        print("❌ yc CLI не установлен")
        print("📝 Для установки выполните:")
        print("curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash")
        return None
    except Exception as e:
        print(f"💥 Ошибка: {e}")
        return None

def test_with_iam_token(token, folder_id):
    """Тест YandexGPT с IAM токеном"""
    
    print("\n🚀 Тестирование YandexGPT с IAM токеном")
    print(f"📁 FOLDER_ID: {folder_id}")
    print("-" * 50)
    
    url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "modelUri": f"gpt://{folder_id}/yandexgpt-lite",
        "completionOptions": {"temperature": 0.3, "maxTokens": 500},
        "messages": [
            {"role": "user", "text": "Что такое InAnswer.pro?"}
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            print("✅ Ответ:", response.json()["result"]["alternatives"][0]["message"]["text"])
        else:
            print("❌ Ошибка:", response.status_code, response.text)
            
    except Exception as e:
        print(f"💥 Ошибка запроса: {e}")

if __name__ == "__main__":
    FOLDER_ID = "b1g4854pso9q87p5lg8p"
    
    # Получаем IAM токен
    iam_token = get_iam_token()
    
    if iam_token:
        # Тестируем с IAM токеном
        test_with_iam_token(iam_token, FOLDER_ID)
    else:
        print("\n📝 Альтернативные способы получения IAM токена:")
        print("1. В консоли Yandex Cloud: IAM → Токены → Создать токен")
        print("2. Установить yc CLI: curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash")
        print("3. Выполнить: 
        yc init && yc iam create-token")