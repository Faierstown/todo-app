import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к SQLite
const dbPromise = await open({
  filename: "./todos.db",
  driver: sqlite3.Database,
});

// Создаём таблицу при старте
(async () => {
  const db = await dbPromise;
  await db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    description TEXT,
    completed INTEGER
  )`);
})();

// Получить все задачи
app.get("/todos", async (req, res) => {
  const db = await dbPromise;
  const todos = await db.all("SELECT * FROM todos");
  res.json(todos);
});

//Маршрут для получения количества задач: всего, активных и выполненных
app.get("/todos/counts", async (req, res) => {
  try {
    const db = await dbPromise;
    const total = await db.get("SELECT COUNT(completed) as count FROM todos");
    const active = await db.get(
      "SELECT COUNT(completed) as count FROM todos WHERE completed = 0"
    );
    const completed = await db.get(
      "SELECT COUNT(completed) as count FROM todos WHERE completed = 1"
    );
    res.json({
      total: total.count,
      active: active.count,
      completed: completed.count,
    });
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Получить одну задачу (детали, описание задачи)
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await dbPromise;
    const row = await db.get("SELECT * FROM todos WHERE id = ?", id);
    if (!row) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(row);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Добавить задачу
app.post("/todos", async (req, res) => {
  const { text, description } = req.body;
  const db = await dbPromise;
  const result = await db.run(
    "INSERT INTO todos (text, description, completed) VALUES (?, ?, ?)",
    [text, description, 0]
  );
  res.json({ id: result.lastID, text, description, completed: 0 });
});

// Переключить статус задачи и редактировать
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed, text, description } = req.body;
  const db = await dbPromise;
  await db.run(
    "UPDATE todos SET completed = ?, text = ?, description = ? WHERE id = ?",
    [completed, text, description, id]
  );
  const updated = await db.get("SELECT * FROM todos WHERE id = ?", id);
  res.json(updated);
});

// Удалить задачу
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const db = await dbPromise;
  await db.run("DELETE FROM todos WHERE id = ?", id);
  res.json({ id });
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
