import React from "react";
import styles from "./TodoItem.module.css"; // подключаем как объект
import { Link } from "react-router-dom";
const statusLabels = [
  "Необязательная",
  "Второстепенная",
  "Обычная",
  "Приоритетная",
  "Срочная",
  "Макс. приоритет",
];
const statusIcons = ["📍", "🧩", "💼", "🔥", "🏆", "💎"];
export default function TodoItem({ todo, deleteTodo, toggleTodo }) {
  const statusClass = styles[`status${todo.status}`];

  const className = `${styles.todo} ${statusClass}`;

  const isBanned = () => {
    if (!todo?.due_date) return false;
    return new Date() > new Date(todo.due_date);
  };

  const timeRemaining = () => {
    if (!todo?.due_date) return "Неограниченно";
    const timeDifference = new Date(todo.due_date) - new Date();
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    const timeString = `${days}дн : ${hours
      .toString()
      .padStart(2, "0")}ч : ${minutes.toString().padStart(2, "0")}м`;
    return timeString;
  };

  return (
    <div className={className}>
      <Link to={`/todo/${todo.id}`} className={styles.title}>
        {todo.text}
      </Link>

      <div className={styles.meta}>
        <small>
          {statusIcons[todo.status]} Статус: {statusLabels[todo.status]}
        </small>
        <br />⏰{" "}
        {todo.due_date
          ? new Date(todo.due_date).toLocaleString("ru-RU")
          : "Без срока"}
        <br />
        🕓 Дата создания:{" "}
        {todo.created_at
          ? new Date(todo.created_at).toLocaleString("ru-RU")
          : "—"}
        {isBanned() ? (
          <p className={styles.banned}>Просрочена</p>
        ) : (
          <p>Осталось времени: {timeRemaining()} </p>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.Cancel} onClick={() => deleteTodo(todo.id)}>
          ❌
        </button>
        <button className={styles.Agree} onClick={() => toggleTodo(todo)}>
          ✅
        </button>
      </div>
    </div>
  );
}
