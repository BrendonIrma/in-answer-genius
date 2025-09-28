import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Используем переменную окружения DB_PATH или путь по умолчанию
const dbPath = process.env.DB_PATH || join(__dirname, '../../data/analyses.db');

console.log('DB_PATH from env:', process.env.DB_PATH);
console.log('Final dbPath:', dbPath);

// Создаем директорию для базы данных
import { mkdirSync } from 'fs';
const dbDir = dirname(dbPath);
try {
  mkdirSync(dbDir, { recursive: true });
  console.log('Database directory created:', dbDir);
} catch (err) {
  // Директория уже существует
  console.log('Database directory already exists:', dbDir);
}

let db;

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export async function initDatabase() {
  try {
    const database = getDatabase();
    
    // Создаем таблицу для хранения анализов
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        query TEXT NOT NULL,
        is_in_ai_answer BOOLEAN NOT NULL,
        citability_score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        success_chance INTEGER NOT NULL,
        recommendations TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Создаем таблицу для кэширования
    const createCacheTableSQL = `
      CREATE TABLE IF NOT EXISTS cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cache_key TEXT UNIQUE NOT NULL,
        data TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    database.exec(createTableSQL);
          console.log('Таблица analyses создана');
    
    database.exec(createCacheTableSQL);
    console.log('Таблица cache создана');
    
    return Promise.resolve();
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw error;
  }
}

export function closeDatabase() {
  if (db) {
    try {
      db.close();
        console.log('База данных закрыта');
    } catch (err) {
      console.error('Ошибка закрытия базы данных:', err);
    }
  }
}