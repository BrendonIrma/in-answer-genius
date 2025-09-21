#!/usr/bin/env python3

import requests
import json
import time
from datetime import datetime

# === НАСТРОЙКИ ===
IAM_TOKEN = "t1.9euelZqZl8uJkJ2cnpuTlJmUx4-RkO3rnpWancaTnJqdzYmOisuKx5uRmYnl8_cTEUM5-e9WKhtv_t3z91M_QDn571YqG2_-zef1656Vms3OxpTKmZybzJuOmZ2TjI-M7_zF656Vms3OxpTKmZybzJuOmZ2TjI-M.bskZf50XAPR8ngIhlAiTejIAdEMEYWpS-Xkn5dziiInFHWVi8OHc6PHgSyhI9tMdKXpdh2ABSxpB0NVPFBGbCA"  # ← замените на реальный IAM токен
FOLDER_ID = "b1g4854pso9q87p5lg8p"

def test_yandex_gpt_with_iam():
    """Тест YandexGPT с IAM токеном"""
    
    print("🚀 Тестирование YandexGPT с IAM токеном")
    print(f"📁 FOLDER_ID: {FOLDER_ID}")
    print(f"🔑 IAM_TOKEN: {IAM_TOKEN[:10]}...{IAM_TOKEN[-5:] if len(IAM_TOKEN) > 15 else IAM_TOKEN}")
    print(f"⏰ Время: {datetime.now()}")
    print("-" * 50)
    
    url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    headers = {
        "Authorization": f"Bearer {IAM_TOKEN}",
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
                
    except requests.exceptions.Timeout:
        print("⏰ Таймаут запроса")
    except requests.exceptions.ConnectionError:
        print("🌐 Ошибка подключения к интернету")
    except Exception as e:
        print(f"💥 Неожиданная ошибка: {e}")

def get_iam_token_from_console():
    """Инструкции по получению IAM токена из консоли"""
    
    print("\n" + "="*60)
    print("📝 ИНСТРУКЦИИ ПО ПОЛУЧЕНИЮ IAM ТОКЕНА")
    print("="*60)
    print("1. Перейдите в консоль Yandex Cloud")
    print("2. Войдите в свой аккаунт")
    print("3. Перейдите в раздел 'IAM' → 'Токены'")
    print("4. Нажмите 'Создать токен'")
    print("5. Скопируйте полученный токен")
    print("6. Замените 'ваш_iam_токен' в этом скрипте на реальный токен")
    print("\n🔗 Ссылка: https://console.cloud.yandex.ru/iam/tokens")
    print("="*60)

if __name__ == "__main__":
    if IAM_TOKEN == "ваш_iam_токен":
        print("⚠️  IAM токен не настроен!")
        get_iam_token_from_console()
    else:
        test_yandex_gpt_with_iam()