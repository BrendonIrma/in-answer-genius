import express from 'express';
import Joi from 'joi';
import analysisService from '../services/analysisService.js';

const router = express.Router();

// Схема валидации для анализа
const analysisSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .messages({
      'string.uri': 'URL должен быть валидным',
      'any.required': 'URL обязателен'
    }),
  query: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Запрос должен содержать минимум 3 символа',
      'string.max': 'Запрос не должен превышать 200 символов',
      'any.required': 'Запрос обязателен'
    })
});

// Middleware валидации
const validateAnalysis = (req, res, next) => {
  const { error, value } = analysisSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Ошибка валидации',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedData = value;
  next();
};

// POST /api/analysis - Анализ сайта
router.post('/', validateAnalysis, async (req, res) => {
  try {
    const { url, query } = req.validatedData;
    
    console.log(`🔍 Начинаем анализ: ${url} для запроса "${query}"`);
    
    const result = await analysisService.analyzeWebsite(url, query);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ошибка анализа:', error);
    
    res.status(500).json({
      success: false,
      error: 'Ошибка при выполнении анализа',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/analysis/history - История анализов
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    if (limit > 100) {
      return res.status(400).json({
        error: 'Лимит не может превышать 100 записей'
      });
    }
    
    const history = await analysisService.getAnalysisHistory(limit);
    
    res.json({
      success: true,
      data: history,
      count: history.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ошибка получения истории:', error);
    
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении истории анализов',
      message: error.message
    });
  }
});

// GET /api/analysis/stats - Статистика
router.get('/stats', async (req, res) => {
  try {
    // Здесь можно добавить статистику из базы данных
    res.json({
      success: true,
      data: {
        totalAnalyses: 0, // TODO: реализовать подсчет
        averageScore: 0,  // TODO: реализовать подсчет
        successRate: 0    // TODO: реализовать подсчет
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении статистики',
      message: error.message
    });
  }
});

export default router;