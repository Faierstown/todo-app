import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddTodo from "./TodoListComponents/AddTodo";
import TodoItem from "./TodoItem/TodoItem";
export default function TodoList() {
  const [todos, setTodos] = useState([]);
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

  const toggleTodo = async (todo) => {
    const res = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: todo.text,
        description: todo.description,
        completed: todo.completed ? 0 : 1,
        due_date: todo.due_date,
        status: todo.status,
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

  //Тут у нас пропс
  const handleAddTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  return (
    <div className="container">
      <AddTodo onAdd={handleAddTodo} />

      <ul>
        {todos
          .filter((todo) => todo.completed === 0)
          .map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              toggleTodo={toggleTodo}
            />
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
  );
}
