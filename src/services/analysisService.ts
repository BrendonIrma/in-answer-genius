import type { AnalysisResult } from '@/components/AnalysisResults';

// Симуляция API-вызовов для демонстрации
export class AnalysisService {
  static async analyzeWebsite(url: string, query: string): Promise<AnalysisResult> {
    // Симуляция задержки API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Заглушка для демонстрации - в реальном приложении здесь будут настоящие API вызовы
    const mockResult: AnalysisResult = {
      url,
      query,
      isInAiAnswer: Math.random() > 0.5,
      citabilityScore: Math.floor(Math.random() * 6) + 3, // 3-8
      maxScore: 10,
      recommendations: this.generateRecommendations(),
      successChance: Math.floor(Math.random() * 60) + 30, // 30-90%
    };

    return mockResult;
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
    // Заглушка для Yandex Search API v2
    // В реальности: проверка упоминания targetUrl в генеративном ответе Яндекса
    return Math.random() > 0.5;
  }

  static async analyzeContentWithGPT(content: string, query: string): Promise<{
    score: number;
    recommendations: string[];
  }> {
    // Заглушка для GPT-4 анализа
    // В реальности: анализ контента на предмет цитируемости
    return {
      score: Math.floor(Math.random() * 6) + 3,
      recommendations: this.generateRecommendations()
    };
  }

  static async fetchSiteContent(url: string): Promise<string> {
    // Заглушка для получения контента сайта
    // В реальности: fetch контента и извлечение текста
    return 'Mock site content for analysis';
  }
}