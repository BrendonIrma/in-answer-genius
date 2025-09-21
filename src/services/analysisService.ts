import type { AnalysisResult } from '@/components/AnalysisResults';

// Сервис анализа сайтов через бэкенд API
export class AnalysisService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  private static readonly IS_PRODUCTION = import.meta.env.PROD;

  static async analyzeWebsite(url: string, query: string): Promise<AnalysisResult> {
    // В продакшене пока используем только fallback (бэкенд не деплоен)
    if (this.IS_PRODUCTION) {
      console.log('Продакшен режим: используем fallback данные');
      return this.generateFallbackResult(url, query);
    }

    try {
      console.log('Отправляем запрос на бэкенд...');
      
      const response = await fetch(`${this.API_BASE_URL}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, query }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.message || 'Неизвестная ошибка'}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Ошибка анализа');
      }

      console.log('Получен результат от бэкенда');
      return result.data;
    } catch (error) {
      console.error('Ошибка при анализе сайта:', error);
      
      // Fallback к демо-данным при ошибке
      return this.generateFallbackResult(url, query);
    }
  }

  // Методы для получения истории и статистики (опционально)
  static async getAnalysisHistory(limit: number = 10) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/analysis/history?limit=${limit}`);
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Ошибка получения истории:', error);
      return [];
    }
  }

  static async getAnalysisStats() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/analysis/stats`);
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Ошибка получения статистики:', error);
      return null;
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

  private static generateFallbackResult(url: string, query: string): AnalysisResult {
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

  // Методы для будущего расширения:
  // - Вызов Yandex Search API v2
  // - Анализ контента сайта через fetch
  // - Интеграция с другими ИИ-сервисами
}