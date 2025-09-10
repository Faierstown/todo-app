import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
export default function CompletedTodos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");

  const statusLabels = [
    "Необязательная",
    "Второстепенная",
    "Обычная",
    "Приоритетная",
    "Срочная",
    "Макс. приоритет",
  ];

  useEffect(() => {
    fetch("http://localhost:5000/todos/completed")
      .then((res) => res.json())
      .then((data) => {
        const completed = data;
        setTodos(completed);
      });
  }, []);

  if (todos.length === 0) return <p>Нет выполненных задач</p>;

  const backTodo = async (todo) => {
    const updaterCompleted = todo.completed === 1 ? 0 : 1;
    const res = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: todo.text,
        description: todo.description,
        completed: updaterCompleted,
      }),
    });

    if (!res.ok) {
      alert("Ошибка при обновлении задачи");
      return;
    }

    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, completed: updaterCompleted } : t
      )
    );
  };

  return (
    <div className="container">
      <h1>✅ Выполненные задачи</h1>
      <ul>
        {todos
          .filter((todo) => todo.completed === 1)
          .map((todo) => (
            <li key={todo.id}>
              {todo.text} — {todo.description}
              <div style={{ fontSize: "0.85em", color: "#ccc" }}>
                ⏰{" "}
                {todo.due_date
                  ? new Date(todo.due_date).toLocaleString()
                  : "Без срока"}{" "}
                |🔥Приоритет: {statusLabels[todo.status] ?? "Неизвестно"}
                Дата создания:{" "}
                {todo.created_at
                  ? new Date(todo.created_at).toLocaleString("ru-RU")
                  : "—"}
              </div>
              <button onClick={() => backTodo(todo)}>Возобновить</button>
            </li>
          ))}
        <button onClick={() => navigate("/")}>⬅ Список Задач</button>
      </ul>
    </div>
  );
}
