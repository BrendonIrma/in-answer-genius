import yandexGPTService from './yandexGPTService.js';
import { getDatabase } from '../config/database.js';

class AnalysisService {
  async analyzeWebsite(url, query) {
    try {
      // Кэширование отключено для тестирования
      // const cachedResult = await this.getCachedResult(url, query);
      // if (cachedResult) {
      //   console.log('Результат получен из кэша');
      //   return cachedResult;
      // }
      
      console.log('🔄 Кэширование отключено - каждый запрос идет к YandexGPT API');

      // Проверяем, настроены ли API ключи
      if (!process.env.YANDEX_API_KEY || !process.env.YANDEX_FOLDER_ID) {
        console.log('YandexGPT API не настроен, используем демо-данные');
        return this.generateDemoResult(url, query);
      }

      // Выполняем анализ через YandexGPT с timeout
      console.log('🔍 Выполняем анализ через YandexGPT...');
      console.log('🔑 API Key:', process.env.YANDEX_API_KEY ? 'Set' : 'Not set');
      console.log('📁 Folder ID:', process.env.YANDEX_FOLDER_ID ? 'Set' : 'Not set');
      console.log('🌐 URL для анализа:', url);
      console.log('❓ Запрос:', query);
      
      const analysis = await Promise.race([
        yandexGPTService.analyzeWebsite(url, query),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('YandexGPT API timeout')), 10000)
        )
      ]);
      console.log('YandexGPT анализ завершен:', analysis);
      
      // Рассчитываем шанс успеха
      const successChance = Math.min(90, Math.max(30, 
        analysis.score * 10 + (analysis.isInAiAnswer ? 20 : 0)
      ));

      const result = {
        url,
        query,
        isInAiAnswer: analysis.isInAiAnswer,
        citabilityScore: analysis.score,
        maxScore: 10,
        recommendations: analysis.recommendations,
        successChance,
        content: analysis.content
      };

      // Сохраняем в базу данных
      await this.saveAnalysis(result);
      
      // Кэширование отключено для тестирования
      // await this.cacheResult(url, query, result);

      return result;
    } catch (error) {
      console.error('Ошибка при анализе сайта:', error);
      
      // Fallback к демо-данным при ошибке
      console.log('Используем демо-данные из-за ошибки API');
      return this.generateDemoResult(url, query);
    }
  }

  async saveAnalysis(analysis) {
    try {
      const db = getDatabase();
      const sql = `
        INSERT INTO analyses 
        (url, query, is_in_ai_answer, citability_score, max_score, success_chance, recommendations)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        analysis.url,
        analysis.query,
        analysis.isInAiAnswer ? 1 : 0,
        analysis.citabilityScore,
        analysis.maxScore,
        analysis.successChance,
        JSON.stringify(analysis.recommendations)
      ];

      const result = db.prepare(sql).run(params);
          console.log('Анализ сохранен в базу данных, ID:', result.lastInsertRowid);
      return result.lastInsertRowid;
    } catch (error) {
      console.error('Ошибка сохранения анализа:', error);
      throw error;
    }
  }

  async getCachedResult(url, query) {
    try {
      const db = getDatabase();
      const cacheKey = this.generateCacheKey(url, query);
      
      const sql = `
        SELECT data FROM cache 
        WHERE cache_key = ? AND expires_at > datetime('now')
        ORDER BY created_at DESC LIMIT 1
      `;
      
      const row = db.prepare(sql).get(cacheKey);
      
      if (row) {
        try {
          const data = JSON.parse(row.data);
          return data;
        } catch (parseErr) {
          console.error('Ошибка парсинга кэша:', parseErr);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Ошибка получения из кэша:', error);
      return null;
    }
  }

  async cacheResult(url, query, result) {
    try {
      const db = getDatabase();
      const cacheKey = this.generateCacheKey(url, query);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут
      
      const sql = `
        INSERT OR REPLACE INTO cache (cache_key, data, expires_at)
        VALUES (?, ?, ?)
      `;
      
      const params = [
        cacheKey,
        JSON.stringify(result),
        expiresAt.toISOString()
      ];

      db.prepare(sql).run(params);
          console.log('Результат сохранен в кэш');
    } catch (error) {
      console.error('Ошибка сохранения в кэш:', error);
      throw error;
    }
  }

  generateCacheKey(url, query) {
    return `analysis_${Buffer.from(url + query).toString('base64')}`;
  }

  async getAnalysisHistory(limit = 10) {
    try {
      const db = getDatabase();
      const sql = `
        SELECT * FROM analyses 
        ORDER BY created_at DESC 
        LIMIT ?
      `;
      
      const rows = db.prepare(sql).all(limit);
      
      const analyses = rows.map(row => ({
        id: row.id,
        url: row.url,
        query: row.query,
        isInAiAnswer: Boolean(row.is_in_ai_answer),
        citabilityScore: row.citability_score,
        maxScore: row.max_score,
        successChance: row.success_chance,
        recommendations: JSON.parse(row.recommendations),
        createdAt: row.created_at
      }));
      
      return analyses;
    } catch (error) {
      console.error('Ошибка получения истории:', error);
      throw error;
    }
  }

  // Генерируем демо-результат для тестирования
  generateDemoResult(url, query) {
    const recommendations = [
      'Добавьте четкий ответ на вопрос в первый абзац статьи. ИИ-поисковики предпочитают сайты с прямыми ответами в начале контента.',
      'Создайте раздел FAQ с популярными вопросами и краткими ответами. Это увеличивает шансы попадания в генеративные ответы.',
      'Добавьте структурированные данные (JSON-LD) для лучшего понимания контента поисковыми системами.',
      'Включите упоминание города или региона в заголовки и первые абзацы для локальных запросов.',
      'Добавьте таблицы и списки - структурированная информация лучше воспринимается ИИ.'
    ];

    const strengths = [
      'Хорошая структура контента',
      'Релевантная информация',
      'Понятное изложение'
    ];

    const weaknesses = [
      'Недостаточно примеров',
      'Слабая экспертность',
      'Устаревшая информация'
    ];

    // Случайные данные для демонстрации
    const isInAiAnswer = Math.random() > 0.5;
    const citabilityScore = Math.floor(Math.random() * 6) + 3; // 3-8
    const maxScore = 10;
    const successChance = Math.floor(Math.random() * 40) + 40; // 40-80

    return {
      url,
      query,
      isInAiAnswer,
      citabilityScore,
      maxScore,
      criteria: {
        relevance: Math.floor(Math.random() * 4) + 6, // 6-9
        completeness: Math.floor(Math.random() * 4) + 5, // 5-8
        structure: Math.floor(Math.random() * 4) + 6, // 6-9
        authority: Math.floor(Math.random() * 4) + 4, // 4-7
        freshness: Math.floor(Math.random() * 4) + 5, // 5-8
        readability: Math.floor(Math.random() * 4) + 6 // 6-9
      },
      strengths: strengths.slice(0, Math.floor(Math.random() * 3) + 1),
      weaknesses: weaknesses.slice(0, Math.floor(Math.random() * 3) + 1),
      recommendations: recommendations.slice(0, 3),
      successChance
    };
  }
}

export default new AnalysisService();