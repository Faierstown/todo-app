import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TodoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/todos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Не удалось загрузить задачу");
        return res.json();
      })
      .then((data) => {
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
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
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
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
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

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave} style={{ marginRight: "10px" }}>
          💾 Сохранить
        </button>
        <button onClick={() => navigate("/")}>⬅ Назад</button>
      </div>
    </div>
  );
}

export default TodoDetails;
