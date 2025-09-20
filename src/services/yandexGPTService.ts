interface YandexGPTMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
}

interface YandexGPTCompletionOptions {
  temperature?: number;
  maxTokens?: number;
}

interface YandexGPTRequest {
  modelUri: string;
  completionOptions: YandexGPTCompletionOptions;
  messages: YandexGPTMessage[];
}

interface YandexGPTResponse {
  result: {
    alternatives: Array<{
      message: {
        text: string;
      };
    }>;
  };
}

export class YandexGPTService {
  private apiKey: string;
  private folderId: string;
  private baseUrl = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';

  constructor() {
    // Получаем данные из переменных окружения
    this.apiKey = import.meta.env.VITE_YANDEX_API_KEY || '';
    this.folderId = import.meta.env.VITE_YANDEX_FOLDER_ID || '';
    
    if (!this.apiKey || !this.folderId) {
      console.error('YandexGPT: API ключ или FOLDER_ID не настроены');
    }
  }

  /**
   * Отправка запроса к YandexGPT API
   */
  async generateCompletion(
    prompt: string,
    options: YandexGPTCompletionOptions = {}
  ): Promise<string> {
    if (!this.apiKey || !this.folderId) {
      throw new Error('YandexGPT API не настроен. Проверьте переменные окружения.');
    }

    const request: YandexGPTRequest = {
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
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Api-Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`YandexGPT API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data: YandexGPTResponse = await response.json();
      
      if (data.result?.alternatives?.[0]?.message?.text) {
        return data.result.alternatives[0].message.text;
      } else {
        throw new Error('Неожиданный формат ответа от YandexGPT API');
      }

    } catch (error) {
      console.error('Ошибка при обращении к YandexGPT API:', error);
      throw error;
    }
  }

  /**
   * Анализ текста с помощью YandexGPT
   */
  async analyzeText(text: string): Promise<string> {
    const prompt = `Проанализируй следующий текст и дай краткий анализ:

Текст: "${text}"

Дай анализ в формате:
1. Основная тема
2. Ключевые моменты
3. Общий вывод

Ответ должен быть кратким и структурированным.`;

    return this.generateCompletion(prompt, {
      temperature: 0.3,
      maxTokens: 500
    });
  }

  /**
   * Генерация ответа на вопрос
   */
  async answerQuestion(question: string, context?: string): Promise<string> {
    let prompt = `Ответь на вопрос: "${question}"`;
    
    if (context) {
      prompt += `\n\nКонтекст: ${context}`;
    }

    return this.generateCompletion(prompt, {
      temperature: 0.3,
      maxTokens: 800
    });
  }
}

// Экспортируем singleton instance
export const yandexGPTService = new YandexGPTService();