#!/usr/bin/env python3

import asyncio
from yandexcloud import SDK
from yandex.cloud.ai.foundation_models.v1.foundation_models_pb2 import CompletionOptions
from yandex.cloud.ai.foundation_models.v1.text_generation.text_generation_pb2 import CompletionRequest

# === НАСТРОЙКИ ===
API_KEY = "AQVNxYCHpohp0EZn9wHmX4fxDfRB3XA9JjP0ssyh"
FOLDER_ID = "b1g4854pso9q87p5lg8p"

async def test_yandex_official():
    """Тест с использованием официального SDK Yandex Cloud"""
    
    print("🚀 Тестирование YandexGPT с официальным SDK")
    print(f"📁 FOLDER_ID: {FOLDER_ID}")
    print(f"🔑 API_KEY: {API_KEY[:10]}...{API_KEY[-5:]}")
    print("-" * 50)
    
    try:
        # Создаем SDK с API ключом
        sdk = SDK(api_key=API_KEY)
        
        # Создаем запрос
        request = CompletionRequest(
            model_uri=f"gpt://{FOLDER_ID}/yandexgpt-lite",
            completion_options=CompletionOptions(
                temperature=0.3,
                max_tokens=100
            ),
            messages=[
                {
                    "role": "user",
                    "text": "Кто ты?"
                }
            ]
        )
        
        # Отправляем запрос
        response = await sdk.client().ai.foundation_models.text_generation.completion(request)
        
        print("✅ Успешно! Ответ от ИИ:")
        print(response.alternatives[0].message.text)
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        print(f"📝 Тип ошибки: {type(e).__name__}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_yandex_official())