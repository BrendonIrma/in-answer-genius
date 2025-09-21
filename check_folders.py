#!/usr/bin/env python3

import requests
import json

# === НАСТРОЙКИ ===
IAM_TOKEN = "t1.9euelZqVnY-SlZ6ek8vKlpWQis_Lne3rnpWancaTnJqdzYmOisuKx5uRmYnl8_cUFEM5-e8_fEtY_d3z91RCQDn57z98S1j9zef1656VmsuOm43LyJGXnJfOjJuNnpXL7_zF656VmsuOm43LyJGXnJfOjJuNnpXL.QsE6F8EH_L4DxUKtHDd1hAONAgFVTEkk4dscljjYFCOwYxXjwA9B5jwOo0WkV0gIdRm1TCV6XtSLEDRMydALCw"

def list_folders():
    """Получение списка доступных каталогов"""
    
    print("📁 Получение списка доступных каталогов...")
    print(f"🔑 IAM_TOKEN: {IAM_TOKEN[:10]}...{IAM_TOKEN[-5:]}")
    print("-" * 50)
    
    url = "https://resource-manager.api.cloud.yandex.net/resource-manager/v1/folders"
    headers = {
        "Authorization": f"Bearer {IAM_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        
        print(f"📊 Статус код: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            folders = result.get("folders", [])
            
            print(f"✅ Найдено каталогов: {len(folders)}")
            print("\n📋 Доступные каталоги:")
            
            for folder in folders:
                folder_id = folder.get("id")
                folder_name = folder.get("name", "Без имени")
                status = folder.get("status", "UNKNOWN")
                
                print(f"  📁 {folder_name}")
                print(f"     ID: {folder_id}")
                print(f"     Статус: {status}")
                print()
                
            return [f["id"] for f in folders]
        else:
            print(f"❌ Ошибка получения каталогов: {response.status_code}")
            try:
                error_data = response.json()
                print("📝 Детали ошибки:", json.dumps(error_data, indent=2, ensure_ascii=False))
            except:
                print("📝 Текст ошибки:", response.text)
            return []
            
    except Exception as e:
        print(f"💥 Ошибка: {e}")
        return []

def test_yandexgpt_with_folder(folder_id):
    """Тест YandexGPT с указанным каталогом"""
    
    print(f"\n🚀 Тестирование YandexGPT с каталогом: {folder_id}")
    print("-" * 50)
    
    url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    headers = {
        "Authorization": f"Bearer {IAM_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "modelUri": f"gpt://{folder_id}/yandexgpt-lite",
        "completionOptions": {
            "temperature": 0.3,
            "maxTokens": 100
        },
        "messages": [
            {"role": "user", "text": "Привет!"}
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
            return True
        else:
            print(f"❌ Ошибка {response.status_code}")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2, ensure_ascii=False))
            except:
                print(response.text)
            return False
            
    except Exception as e:
        print(f"💥 Ошибка запроса: {e}")
        return False

if __name__ == "__main__":
    # Получаем список каталогов
    folders = list_folders()
    
    if folders:
        print(f"\n🔍 Тестируем YandexGPT для каждого каталога...")
        
        for folder_id in folders:
            success = test_yandexgpt_with_folder(folder_id)
            if success:
                print(f"\n🎉 Успех! Рабочий каталог: {folder_id}")
                break
            print()
    else:
        print("❌ Не удалось получить список каталогов")