import asyncio
from yandex_cloud_ml_sdk import YandexGPT

# === НАСТРОЙКИ ===
API_KEY = "AQVNxYCHpohp0EZn9wHmX4fxDfRB3XA9JjP0ssyh"
FOLDER_ID = "b1g4854pso9q87p5lg8p"

async def test_yandex_gpt():
    """Тест YandexGPT с использованием официального SDK"""
    
    print("🚀 Тестирование YandexGPT с официальным SDK")
    print(f"📁 FOLDER_ID: {FOLDER_ID}")
    print(f"🔑 API_KEY: {API_KEY[:10]}...{API_KEY[-5:]}")
    print("-" * 50)
    
    try:
        # Создаем клиент
        client = YandexGPT(api_key=API_KEY, folder_id=FOLDER_ID)
        
        # Отправляем запрос
        response = await client.completion(
            model="yandexgpt-lite",
            messages=[
                {"role": "user", "text": "Кто ты?"}
            ],
            temperature=0.3,
            max_tokens=100
        )
        
        print("✅ Успешно! Ответ от ИИ:")
        print(response.choices[0].message.content)
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        print(f"📝 Тип ошибки: {type(e).__name__}")

if __name__ == "__main__":
    asyncio.run(test_yandex_gpt())