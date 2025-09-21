import type { AnalysisResult } from '@/components/AnalysisResults';
import { yandexGPTService } from './yandexGPTService';

// Сервис анализа сайтов с интеграцией YandexGPT
export class AnalysisService {
  static async analyzeWebsite(url: string, query: string): Promise<AnalysisResult> {
    try {
      // Объединяем все API вызовы в один комплексный запрос
      const analysisResult = await this.performComprehensiveAnalysis(url, query);
      
      return analysisResult;
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

  // Новый метод для комплексного анализа одним запросом
  private static async performComprehensiveAnalysis(url: string, query: string): Promise<AnalysisResult> {
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

    const response = await yandexGPTService.generateCompletion(prompt, {
      temperature: 0.3,
      maxTokens: 1000
    });

    try {
      // Парсим JSON ответ
      const analysis = JSON.parse(response);
      
      // Рассчитываем шанс успеха
      const successChance = Math.min(90, Math.max(30, analysis.score * 10 + (analysis.isInAiAnswer ? 20 : 0)));

      return {
        url,
        query,
        isInAiAnswer: analysis.isInAiAnswer || false,
        citabilityScore: Math.min(10, Math.max(1, analysis.score || 5)),
        maxScore: 10,
        recommendations: analysis.recommendations || this.generateRecommendations(),
        successChance,
      };
    } catch (parseError) {
      console.error('Ошибка парсинга ответа YandexGPT:', parseError);
      
      // Fallback к простому анализу
      return this.performSimpleAnalysis(url, query);
    }
  }

  // Простой анализ как fallback
  private static async performSimpleAnalysis(url: string, query: string): Promise<AnalysisResult> {
    const simplePrompt = `Оцени сайт ${url} для запроса "${query}" по шкале 1-10. Ответь только числом.`;
    
    try {
      const scoreResponse = await yandexGPTService.generateCompletion(simplePrompt, {
        temperature: 0.1,
        maxTokens: 10
      });
      
      const score = parseInt(scoreResponse) || 5;
      
      return {
        url,
        query,
        isInAiAnswer: score >= 7,
        citabilityScore: Math.min(10, Math.max(1, score)),
        maxScore: 10,
        recommendations: this.generateRecommendations(),
        successChance: Math.min(90, Math.max(30, score * 10)),
      };
    } catch (error) {
      console.error('Ошибка простого анализа:', error);
      throw error;
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

  // Методы для будущего расширения:
  // - Вызов Yandex Search API v2
  // - Анализ контента сайта через fetch
  // - Интеграция с другими ИИ-сервисами
}