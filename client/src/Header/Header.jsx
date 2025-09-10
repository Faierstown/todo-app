import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
export default function Header() {
  const location = useLocation();
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {" "}
        <img src="To_do_list.png" alt="" /> ToDoApp{" "}
      </div>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.link} ${
              location.pathname === "/" ? styles.active : ""
            }`}
          >
            Задачи
          </Link>
          <Link
            to="/completed"
            className={`${styles.link} ${
              location.pathname === "/completed" ? styles.active : ""
            }`}
          >
            Выполненные
          </Link>
        </nav>
      </div>
    </header>
  );
}
