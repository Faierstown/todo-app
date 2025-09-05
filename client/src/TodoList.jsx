import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "./button.module.css";
export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [counts, setCounts] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("http://localhost:5000/todos/counts");
        const data = await res.json();
        setCounts(data);
      } catch (err) {
        console.error("Ошибка при загрузке статистики:", err);
      }
    };

    fetchCounts();
  }, [todos]);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, description }),
    });

    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText("");
    setDescription("");
  };

  const toggleTodo = async (todo) => {
    const res = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: todo.text,
        description: todo.description,
        completed: todo.completed ? 0 : 1,
      }),
    });

    if (!res.ok) {
      alert("Ошибка при обновлении задачи");
      return;
    }

    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, completed: todo.completed ? 0 : 1 } : t
      )
    );
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
        <h1>📝 To-Do List</h1>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Новая задача..."
        />
        <button onClick={addTodo}>Добавить</button>

        <ul>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание задачи..."
          />
          {todos
            .filter((todo) => todo.completed === 0)
            .map((todo) => (
              <li key={todo.id}>
                <Link to={`/todo/${todo.id}`}>{todo.text}</Link>
                <button
                  className={style.Cancel}
                  onClick={() => deleteTodo(todo.id)}
                >
                  ❌
                </button>
                <button
                  className={style.Agree}
                  onClick={() => toggleTodo(todo)}
                >
                  ✅
                </button>
              </li>
            ))}
        </ul>
        <Link to="/completed">
          {" "}
          <button>✅ Выполненные задачи</button>
        </Link>
        <p>
          <strong>🧩 Всего:</strong> {counts.total}
          <strong>🧠 Выполнено:</strong> {counts.completed}
          <strong>📌 Предстоит сделать:</strong> {counts.active}
        </p>
      </div>
    </div>
  );
}
