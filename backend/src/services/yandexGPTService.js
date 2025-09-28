import axios from 'axios';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

class YandexGPTService {
  constructor() {
    this.apiKey = process.env.YANDEX_API_KEY;
    this.folderId = process.env.YANDEX_FOLDER_ID;
    this.baseUrl = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';
    
    if (!this.apiKey || !this.folderId) {
      console.warn('YandexGPT API ключи не настроены');
    }
  }

  async generateCompletion(prompt, options = {}) {
    if (!this.apiKey || !this.folderId) {
      throw new Error('YandexGPT API не настроен. Проверьте переменные окружения.');
    }

    const request = {
      modelUri: `gpt://${this.folderId}/yandexgpt-lite`,
      completionOptions: {
        temperature: 0.3,
        maxTokens: 1000,
        ...options
      },
      messages: [
        {
          role: 'user',
          text: prompt
        }
      ]
    };

    try {
      console.log('🚀 Отправляем запрос к YandexGPT API...');
      console.log('📡 URL:', this.baseUrl);
      console.log('🔑 API Key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'НЕ УСТАНОВЛЕН');
      console.log('📁 Folder ID:', this.folderId);
      console.log('📝 Запрос:', JSON.stringify(request, null, 2));
      
      const response = await axios.post(this.baseUrl, request, {
        headers: {
          'Authorization': `Api-Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 секунд таймаут
      });
      
      console.log('✅ Получен ответ от YandexGPT API');
      console.log('📊 Статус:', response.status);
      console.log('📄 Ответ:', JSON.stringify(response.data, null, 2));

      if (response.data?.result?.alternatives?.[0]?.message?.text) {
        return response.data.result.alternatives[0].message.text;
      } else {
        throw new Error('Неожиданный формат ответа от YandexGPT API');
      }

    } catch (error) {
      console.error('❌ Ошибка YandexGPT API:');
      console.error('📊 Статус:', error.response?.status);
      console.error('📄 Данные ошибки:', error.response?.data);
      console.error('💬 Сообщение:', error.message);
      console.error('🔗 URL:', error.config?.url);
      
      if (error.response?.status === 401) {
        throw new Error('Неверный API ключ YandexGPT');
      } else if (error.response?.status === 403) {
        throw new Error('Недостаточно прав для доступа к YandexGPT');
      } else if (error.response?.status === 429) {
        throw new Error('Превышен лимит запросов к YandexGPT');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Таймаут запроса к YandexGPT');
      } else {
        throw new Error(`Ошибка YandexGPT API: ${error.message}`);
      }
    }
  }

  async analyzeWebsite(url, query) {
    const prompt = `Проанализируй сайт для попадания в ответы ИИ-поисковиков.

URL сайта: ${url}
Запрос пользователя: "${query}"

Выполни комплексный анализ и ответь в JSON формате:
{
  "content": "краткое описание контента сайта",
  "score": число от 1 до 10 (общая оценка цитируемости),
  "isInAiAnswer": true/false (попадет ли в ответ ИИ),
  "criteria": {
    "relevance": число от 1 до 10 (релевантность запросу),
    "completeness": число от 1 до 10 (полнота ответа),
    "structure": число от 1 до 10 (структурированность),
    "authority": число от 1 до 10 (экспертность и авторитетность),
    "freshness": число от 1 до 10 (актуальность информации),
    "readability": число от 1 до 10 (читаемость и понятность)
  },
  "strengths": ["сильная сторона 1", "сильная сторона 2"],
  "weaknesses": ["слабая сторона 1", "слабая сторона 2"],
  "recommendations": ["рекомендация 1", "рекомендация 2", "рекомендация 3"]
}

Оцени по критериям:
1. Релевантность контента запросу (насколько точно отвечает на вопрос)
2. Качество и полнота ответа (исчерпывающий ли ответ)
3. Структурированность информации (заголовки, списки, таблицы)
4. Экспертность и авторитетность (квалификация автора, источники)
5. Актуальность информации (свежесть данных)
6. Читаемость и понятность (простота восприятия)`;

    try {
      const response = await this.generateCompletion(prompt, {
        temperature: 0.3,
        maxTokens: 1000
      });

      // Очищаем ответ от markdown и парсим JSON
      const cleanedResponse = this.extractJsonFromMarkdown(response);
      const analysis = JSON.parse(cleanedResponse);
      
      // Валидируем данные
      if (typeof analysis.score !== 'number' || analysis.score < 1 || analysis.score > 10) {
        analysis.score = 5;
      }
      
      if (typeof analysis.isInAiAnswer !== 'boolean') {
        analysis.isInAiAnswer = analysis.score >= 7;
      }
      
      // Валидируем критерии
      if (!analysis.criteria || typeof analysis.criteria !== 'object') {
        analysis.criteria = {
          relevance: 5,
          completeness: 5,
          structure: 5,
          authority: 5,
          freshness: 5,
          readability: 5
        };
      }
      
      // Валидируем массивы
      if (!Array.isArray(analysis.recommendations)) {
        analysis.recommendations = this.getDefaultRecommendations();
      }
      
      if (!Array.isArray(analysis.strengths)) {
        analysis.strengths = [];
      }
      
      if (!Array.isArray(analysis.weaknesses)) {
        analysis.weaknesses = [];
      }

      return analysis;
    } catch (parseError) {
      console.error('Ошибка парсинга ответа YandexGPT:', parseError);
      
      // Fallback к простому анализу
      return await this.performSimpleAnalysis(url, query);
    }
  }

  async performSimpleAnalysis(url, query) {
    const simplePrompt = `Оцени сайт ${url} для запроса "${query}" по шкале 1-10. Ответь только числом.`;
    
    try {
      const scoreResponse = await this.generateCompletion(simplePrompt, {
        temperature: 0.1,
        maxTokens: 10
      });
      
      const score = parseInt(scoreResponse) || 5;
      
      return {
        content: `Анализ сайта ${url}`,
        score: Math.min(10, Math.max(1, score)),
        isInAiAnswer: score >= 7,
        criteria: {
          relevance: score,
          completeness: score,
          structure: score,
          authority: score,
          freshness: score,
          readability: score
        },
        strengths: ['Быстрый анализ выполнен'],
        weaknesses: ['Ограниченный анализ'],
        recommendations: this.getDefaultRecommendations()
      };
    } catch (error) {
      console.error('Ошибка простого анализа:', error);
      throw error;
    }
  }

  getDefaultRecommendations() {
    return [
      'Добавьте четкий ответ на вопрос в первый абзац статьи. ИИ-поисковики предпочитают сайты с прямыми ответами в начале контента.',
      'Создайте раздел FAQ с популярными вопросами и краткими ответами. Это увеличивает шансы попадания в генеративные ответы.',
      'Добавьте структурированные данные (JSON-LD) для лучшего понимания контента поисковыми системами.'
    ];
  }

  // Извлекает JSON из markdown ответа
  extractJsonFromMarkdown(text) {
    // Убираем markdown блоки кода
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
    const matches = text.match(codeBlockRegex);
    
    if (matches && matches.length > 0) {
      // Берем первый блок кода
      const jsonText = matches[0].replace(/```(?:json)?\s*/, '').replace(/\s*```/, '');
      return jsonText.trim();
    }
    
    // Ищем JSON в тексте (начинается с { и заканчивается })
    const jsonRegex = /\{[\s\S]*\}/;
    const jsonMatch = text.match(jsonRegex);
    
    if (jsonMatch) {
      return jsonMatch[0];
    }
    
    // Если ничего не найдено, возвращаем исходный текст
    return text.trim();
  }
}

export default new YandexGPTService();