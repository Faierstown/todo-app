import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [openDescId, setOpenDescId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);
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

  const toggleTodo = async (id, completed) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: completed ? 0 : 1 }),
    });
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: completed ? 0 : 1 } : t
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
          {todos.map((todo) => (
            <li key={todo.id}>
              <Link to={`/todo/${todo.id}`}>{todo.text}</Link>
              <button onClick={() => deleteTodo(todo.id)}>❌</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
