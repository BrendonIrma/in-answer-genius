#!/usr/bin/env python3

from yandexcloud import SDK

# === НАСТРОЙКИ ===
API_KEY = "AQVNxYCHpohp0EZn9wHmX4fxDfRB3XA9JjP0ssyh"
FOLDER_ID = "b1g4854pso9q87p5lg8p"

def test_yandex_simple():
    """Простой тест с официальным SDK Yandex Cloud"""
    
    print("🚀 Тестирование YandexGPT с простым SDK")
    print(f"📁 FOLDER_ID: {FOLDER_ID}")
    print(f"🔑 API_KEY: {API_KEY[:10]}...{API_KEY[-5:]}")
    print("-" * 50)
    
    try:
        # Создаем SDK с API ключом
        sdk = SDK(api_key=API_KEY)
        
        print("✅ SDK создан успешно")
        print(f"📊 Доступные сервисы: {dir(sdk.client())}")
        
        # Проверяем доступные методы
        ai_client = sdk.client().ai
        print(f"🤖 AI клиент: {dir(ai_client)}")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        print(f"📝 Тип ошибки: {type(e).__name__}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_yandex_simple()