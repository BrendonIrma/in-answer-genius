import dotenv from 'dotenv';
import axios from 'axios';

// Загружаем переменные окружения
dotenv.config();

const API_KEY = process.env.YANDEX_API_KEY;
const FOLDER_ID = process.env.YANDEX_FOLDER_ID;
const BASE_URL = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';

console.log('🔍 Проверка конфигурации YandexGPT API...\n');

// Проверяем наличие переменных
console.log('📋 Переменные окружения:');
console.log(`YANDEX_API_KEY: ${API_KEY ? '✅ Установлен' : '❌ Не установлен'}`);
console.log(`YANDEX_FOLDER_ID: ${FOLDER_ID ? '✅ Установлен' : '❌ Не установлен'}\n`);

if (!API_KEY || !FOLDER_ID) {
  console.log('❌ Ошибка: API ключ или FOLDER_ID не настроены');
  console.log('\n📝 Инструкции по настройке:');
  console.log('1. Зайдите в консоль Yandex Cloud: https://console.cloud.yandex.ru/');
  console.log('2. Перейдите в IAM → API ключи');
  console.log('3. Создайте новый ключ или используйте существующий');
  console.log('4. Найдите FOLDER_ID в URL: console.cloud.yandex.ru/folders/{FOLDER_ID}');
  console.log('5. Отредактируйте файл .env с вашими данными');
  process.exit(1);
}

// Проверяем формат API ключа
if (!API_KEY.startsWith('AQVN')) {
  console.log('⚠️  Предупреждение: API ключ должен начинаться с "AQVN"');
}

// Проверяем формат FOLDER_ID
if (!FOLDER_ID.match(/^[a-z0-9]{20}$/)) {
  console.log('⚠️  Предупреждение: FOLDER_ID должен быть 20-символьной строкой');
}

console.log('🚀 Тестируем соединение с YandexGPT API...\n');

// Тестовый запрос
const testRequest = {
  modelUri: `gpt://${FOLDER_ID}/yandexgpt-lite`,
  completionOptions: {
    temperature: 0.3,
    maxTokens: 100
  },
  messages: [
    {
      role: 'user',
      text: 'Привет! Это тестовое сообщение. Ответь коротко.'
    }
  ]
};

try {
  console.log('📤 Отправляем тестовый запрос...');
  
  const response = await axios.post(BASE_URL, testRequest, {
    headers: {
      'Authorization': `Api-Key ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 секунд
  });

  console.log('✅ Соединение успешно!');
  console.log(`📊 Статус: ${response.status}`);
  console.log(`🤖 Ответ: ${response.data.result?.alternatives?.[0]?.message?.text || 'Нет ответа'}`);
  
  console.log('\n🎉 API ключи работают корректно!');
  console.log('Теперь ваш бэкенд может использовать YandexGPT для анализа сайтов.');

} catch (error) {
  console.log('❌ Ошибка соединения с YandexGPT API:');
  
  if (error.response) {
    console.log(`📊 Статус: ${error.response.status}`);
    console.log(`📝 Сообщение: ${JSON.stringify(error.response.data, null, 2)}`);
    
    if (error.response.status === 401) {
      console.log('\n🔑 Проблема: Неверный API ключ');
      console.log('Проверьте правильность YANDEX_API_KEY в файле .env');
    } else if (error.response.status === 403) {
      console.log('\n🚫 Проблема: Недостаточно прав');
      console.log('Убедитесь, что у сервисного аккаунта есть роль ai.languageModels.user');
    } else if (error.response.status === 404) {
      console.log('\n📁 Проблема: Неверный FOLDER_ID');
      console.log('Проверьте правильность YANDEX_FOLDER_ID в файле .env');
    }
  } else if (error.code === 'ECONNABORTED') {
    console.log('⏰ Таймаут запроса (30 секунд)');
    console.log('Попробуйте еще раз или проверьте интернет-соединение');
  } else {
    console.log(`📝 Ошибка: ${error.message}`);
  }
  
  console.log('\n📚 Дополнительная помощь:');
  console.log('- Документация YandexGPT: https://yandex.cloud/ru/docs/foundation-models/');
  console.log('- Консоль Yandex Cloud: https://console.cloud.yandex.ru/');
}