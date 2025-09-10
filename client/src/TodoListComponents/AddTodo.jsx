import React, { useState, useEffect } from "react";
import styles from "./AddTodo.module.css";
export default function AddTodo({ onAdd }) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [due_date, setDue_date] = useState("");
  const [status, setStatus] = useState(0);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, description, due_date, status }),
    });

    if (!res.ok) {
      alert("Ошибка при добавлении задачи");
      return;
    }

    const newTodo = await res.json();
    onAdd(newTodo);

    setText("");
    setDescription("");
    setDue_date("");
    setStatus(0);
  };

  return (
    <div>
      <h1 className={styles.h1}>➕ Добавить Задачу</h1>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новая задача..."
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание задачи..."
      />

      <label>
        Срок выполнения:{" "}
        <input
          type="datetime-local"
          value={due_date}
          onChange={(e) => setDue_date(e.target.value)}
        />
      </label>

      <select
        value={status}
        onChange={(e) => setStatus(Number(e.target.value))}
      >
        <option value={0}>Необязательная</option>
        <option value={1}>Второстепенная</option>
        <option value={2}>Обычная</option>
        <option value={3}>Приоритетная</option>
        <option value={4}>Срочная</option>
        <option value={5}>Максимальный приоритет</option>
      </select>
      <button onClick={addTodo}>Добавить</button>
    </div>
  );
}
