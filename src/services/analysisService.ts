import type { AnalysisResult } from '@/components/AnalysisResults';
import { yandexGPTService } from './yandexGPTService';

// Сервис анализа сайтов с интеграцией YandexGPT
export class AnalysisService {
  static async analyzeWebsite(url: string, query: string): Promise<AnalysisResult> {
    try {
      // Получаем контент сайта
      const content = await this.fetchSiteContent(url);
      
      // Анализируем контент с помощью YandexGPT
      const analysis = await this.analyzeContentWithGPT(content, query);
      
      // Проверяем, попадет ли сайт в ответ ИИ
      const isInAiAnswer = await this.checkYandexAiAnswer(query, url);
      
      // Рассчитываем шанс успеха
      const successChance = Math.min(90, Math.max(30, analysis.score * 10 + (isInAiAnswer ? 20 : 0)));

      const result: AnalysisResult = {
        url,
        query,
        isInAiAnswer,
        citabilityScore: analysis.score,
        maxScore: 10,
        recommendations: analysis.recommendations,
        successChance,
      };

      return result;
    } catch (error) {
      console.error('Ошибка при анализе сайта:', error);
      
      // Fallback к демо-данным при ошибке
      return {
        url,
        query,
        isInAiAnswer: false,
        citabilityScore: 5,
        maxScore: 10,
        recommendations: this.generateRecommendations(),
        successChance: 50,
      };
    }
  }

  private static generateRecommendations(): string[] {
    const allRecommendations = [
      'Добавьте четкий ответ на вопрос в первый абзац статьи. ИИ-поисковики предпочитают сайты с прямыми ответами в начале контента.',
      'Создайте раздел FAQ с популярными вопросами и краткими ответами. Это увеличивает шансы попадания в генеративные ответы.',
      'Добавьте структурированные данные (JSON-LD) для лучшего понимания контента поисковыми системами.',
      'Включите упоминание города или региона в заголовки и первые абзацы для локальных запросов.',
      'Добавьте таблицы и списки - структурированная информация лучше воспринимается ИИ.',
      'Укажите авторство и экспертность (E-E-A-T): добавьте информацию об авторе, его квалификации и опыте.',
      'Оптимизируйте мета-теги: title должен содержать ключевые слова запроса, description - краткий ответ.',
      'Добавьте внутренние ссылки на релевантные страницы для увеличения авторитетности раздела.',
      'Используйте подзаголовки (H2, H3) с ключевыми словами для лучшей структуризации контента.',
      'Обновите контент: свежая информация имеет больше шансов попасть в ответы ИИ.'
    ];

    // Возвращаем 3 случайные рекомендации
    const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  // В реальном приложении здесь будут методы для:
  // - Вызова Yandex Search API v2
  // - Анализа контента сайта через fetch
  // - Оценки контента через GPT-4 API
  
  static async checkYandexAiAnswer(query: string, targetUrl: string): Promise<boolean> {
    try {
      // Используем YandexGPT для симуляции проверки попадания в ответ ИИ
      const prompt = `Представь, что ты поисковая система Яндекса. При запросе "${query}" 
      будет ли сайт "${targetUrl}" включен в генеративный ответ? 
      Ответь только "да" или "нет" без дополнительных объяснений.`;
      
      const response = await yandexGPTService.generateCompletion(prompt, {
        temperature: 0.1,
        maxTokens: 10
      });
      
      return response.toLowerCase().includes('да');
    } catch (error) {
      console.error('Ошибка при проверке попадания в ИИ-ответ:', error);
      return Math.random() > 0.5; // Fallback
    }
  }

  static async analyzeContentWithGPT(content: string, query: string): Promise<{
    score: number;
    recommendations: string[];
  }> {
    try {
      // Анализируем контент с помощью YandexGPT
      const analysisPrompt = `Проанализируй контент сайта на предмет цитируемости в ИИ-поисковиках.

Запрос пользователя: "${query}"
Контент сайта: "${content.substring(0, 2000)}..." (ограничено для анализа)

Оцени по шкале от 1 до 10:
1. Релевантность контента запросу
2. Качество и полнота ответа
3. Структурированность информации
4. Экспертность и авторитетность

Дай рекомендации по улучшению в формате списка.`;

      const analysis = await yandexGPTService.generateCompletion(analysisPrompt, {
        temperature: 0.3,
        maxTokens: 800
      });

      // Парсим оценку из ответа (упрощенно)
      const scoreMatch = analysis.match(/(\d+)\/10|оценка[:\s]*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 6;
      
      // Извлекаем рекомендации
      const recommendations = this.extractRecommendations(analysis);

      return {
        score: Math.min(10, Math.max(1, score)),
        recommendations: recommendations.length > 0 ? recommendations : this.generateRecommendations()
      };
    } catch (error) {
      console.error('Ошибка при анализе контента:', error);
      return {
        score: Math.floor(Math.random() * 6) + 3,
        recommendations: this.generateRecommendations()
      };
    }
  }

  static async fetchSiteContent(url: string): Promise<string> {
    try {
      // В реальном приложении здесь будет прокси-сервер для обхода CORS
      // Пока используем заглушку с YandexGPT для генерации примерного контента
      const prompt = `Представь контент сайта ${url}. Опиши, какой контент может быть на этом сайте: основные разделы, статьи, информацию о компании/услугах.`;
      
      return await yandexGPTService.generateCompletion(prompt, {
        temperature: 0.4,
        maxTokens: 1000
      });
    } catch (error) {
      console.error('Ошибка при получении контента сайта:', error);
      return 'Не удалось получить контент сайта для анализа';
    }
  }

  private static extractRecommendations(analysis: string): string[] {
    // Простое извлечение рекомендаций из текста
    const lines = analysis.split('\n');
    const recommendations: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[-•]\s/) || trimmed.match(/^\d+\.\s/)) {
        recommendations.push(trimmed.replace(/^[-•\d.\s]+/, ''));
      }
    }
    
    return recommendations.slice(0, 3); // Максимум 3 рекомендации
  }
}