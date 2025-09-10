import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TodoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusLabels = [
    "Необязательная",
    "Второстепенная",
    "Обычная",
    "Приоритетная",
    "Срочная",
    "Макс. приоритет",
  ];

  useEffect(() => {
    fetch(`http://localhost:5000/todos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Не удалось загрузить задачу");
        return res.json();
      })
      .then((data) => {
        console.log("Полученные данные:", data);
        setTodo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSave = () => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: todo.text,
        description: todo.description,
        completed: todo.completed,
        due_date: todo.due_date,
        status: todo.status,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при сохранении");
        return res.json();
      })
      .then(() => {
        alert("Изменения сохранены!");
        navigate("/");
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!todo) return <p>Задача не найдена</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Редактирование задачи #{id}</h2>
      <label>Название:</label>
      <input
        type="text"
        value={todo.text}
        onChange={(e) => setTodo({ ...todo, text: e.target.value })}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Описание:</label>
      <textarea
        value={todo.description || ""}
        onChange={(e) => setTodo({ ...todo, description: e.target.value })}
        style={{ width: "100%", height: "100px", marginBottom: "10px" }}
      />

      <label>
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
        />
        Выполнено
      </label>

      <label>
        <input
          type="datetime-local"
          value={todo.due_date}
          onChange={(e) => setTodo({ ...todo, due_date: e.target.value })}
        />{" "}
        Дедлайн
      </label>

      <select
        value={todo.status}
        onChange={(e) => setTodo({ ...todo, status: e.target.value })}
      >
        <option value={0}>Необязательная</option>
        <option value={1}>Второстепенная</option>
        <option value={2}>Обычная</option>
        <option value={3}>Приоритетная</option>
        <option value={4}>Срочная</option>
        <option value={5}>Макс. приоритет</option>
      </select>
      <p>🔥 Приоритет: {statusLabels[todo.status] ?? "Неизвестно"}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave} style={{ marginRight: "10px" }}>
          💾 Сохранить
        </button>
        <button onClick={() => navigate("/")}>⬅ Назад</button>
      </div>
    </div>
  );
}
