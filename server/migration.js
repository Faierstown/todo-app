import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Открываем базу
async function openDb() {
  return open({
    filename: "./todos.db",
    driver: sqlite3.Database,
  });
}

// Миграция: создаём новую таблицу с нужными столбцами, переносим данные и меняем имя таблицы
async function migrate() {
  const db = await openDb();

  await db.exec(`DROP TABLE IF EXISTS todos_new;`);

  // Создаём новую таблицу с нужной структурой
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      description TEXT,
      completed INTEGER,
      created_at TEXT,
      due_date TEXT,
      status INTEGER DEFAULT 0
    );
  `);

  // Копируем данные из старой таблицы (без новых колонок)
  await db.exec(`
    INSERT INTO todos_new (id, text, description, completed)
    SELECT id, text, description, completed FROM todos;
  `);

  // Удаляем старую таблицу
  await db.exec(`DROP TABLE todos;`);

  // Переименовываем новую таблицу
  await db.exec(`ALTER TABLE todos_new RENAME TO todos;`);

  console.log("Migration completed!");
}

// Запускаем миграцию
migrate().catch((err) => {
  console.error("❌Migration failed:", err);
});
