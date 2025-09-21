#!/usr/bin/env python3

import subprocess
import sys

# Запускаем наш оригинальный тест
try:
    result = subprocess.run([sys.executable, "yandex_gpt_test.py"], 
                          capture_output=True, text=True, timeout=30)
    
    print("STDOUT:")
    print(result.stdout)
    print("\nSTDERR:")
    print(result.stderr)
    print(f"\nReturn code: {result.returncode}")
    
except subprocess.TimeoutExpired:
    print("Команда превысила время ожидания")
except Exception as e:
    print(f"Ошибка: {e}")