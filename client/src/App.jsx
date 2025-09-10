import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import TodoList from "./TodoList";
import TodoDetails from "./TodoDetails";
import CompletedTodos from "./CompletedTodos";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
export default function App() {
  return (
    <Router>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/todo/:id" element={<TodoDetails />} />
          <Route path="/completed" element={<CompletedTodos />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
