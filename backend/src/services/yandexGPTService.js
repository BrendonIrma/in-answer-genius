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
      const response = await axios.post(this.baseUrl, request, {
        headers: {
          'Authorization': `Api-Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 секунд таймаут
      });

      if (response.data?.result?.alternatives?.[0]?.message?.text) {
        return response.data.result.alternatives[0].message.text;
      } else {
        throw new Error('Неожиданный формат ответа от YandexGPT API');
      }

    } catch (error) {
      console.error('Ошибка YandexGPT API:', error.response?.data || error.message);
      
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
  "score": число от 1 до 10 (оценка цитируемости),
  "isInAiAnswer": true/false (попадет ли в ответ ИИ),
  "recommendations": ["рекомендация 1", "рекомендация 2", "рекомендация 3"]
}

Оцени по критериям:
1. Релевантность контента запросу
2. Качество и полнота ответа
3. Структурированность информации
4. Экспертность и авторитетность`;

    try {
      const response = await this.generateCompletion(prompt, {
        temperature: 0.3,
        maxTokens: 1000
      });

      // Парсим JSON ответ
      const analysis = JSON.parse(response);
      
      // Валидируем данные
      if (typeof analysis.score !== 'number' || analysis.score < 1 || analysis.score > 10) {
        analysis.score = 5;
      }
      
      if (typeof analysis.isInAiAnswer !== 'boolean') {
        analysis.isInAiAnswer = analysis.score >= 7;
      }
      
      if (!Array.isArray(analysis.recommendations)) {
        analysis.recommendations = this.getDefaultRecommendations();
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
}

export default new YandexGPTService();