from yandex_cloud_ml_sdk import YandexGPT
import asyncio

# === НАСТРОЙКИ ===
API_KEY = "AQVNxYCHpohp0EZn9wHmX4fxDfRB3XA9JjP0ssyh"
FOLDER_ID = "b1g4854pso9q87p5lg8p"

def test_yandex_gpt_sync():
    """Синхронный тест YandexGPT"""
    
    print("🚀 Тестирование YandexGPT (синхронная версия)")
    print(f"📁 FOLDER_ID: {FOLDER_ID}")
    print(f"🔑 API_KEY: {API_KEY[:10]}...{API_KEY[-5:]}")
    print("-" * 50)
    
    try:
        # Создаем клиент
        client = YandexGPT(api_key=API_KEY, folder_id=FOLDER_ID)
        
        # Создаем event loop для синхронного вызова
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Отправляем запрос
        response = loop.run_until_complete(
            client.completion(
                model="yandexgpt-lite",
                messages=[
                    {"role": "user", "text": "Кто ты?"}
                ],
                temperature=0.3,
                max_tokens=100
            )
        )
        
        print("✅ Успешно! Ответ от ИИ:")
        print(response.choices[0].message.content)
        
        loop.close()
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        print(f"📝 Тип ошибки: {type(e).__name__}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_yandex_gpt_sync()