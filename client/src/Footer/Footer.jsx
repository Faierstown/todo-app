import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaTelegram, FaReddit } from "react-icons/fa";
import styles from "./Footer.module.css";
export default function Footer() {
  const links = [
    {
      id: 1,
      url: "https://t.me/Faierstown",
      ariaLabel: "Telegram",
      icon: FaTelegram,
    },
    {
      id: 2,
      url: "https://github.com/Faierstown",
      ariaLabel: "GitHub",
      icon: FaGithub,
    },
    {
      id: 3,
      url: "https://www.reddit.com/user/Bip-Bop_HomoEconomic/",
      ariaLabel: "Reddit",
      icon: FaReddit,
    },
  ];
  return (
    <footer className={styles.footer}>
      <h1 className={styles.h1}>Как с нами связаться</h1>
      <div className={styles.container}>
        <ul className={styles.linkList}>
          {links.map(({ id, url, icon: Icon, ariaLabel }) => {
            return (
              <li key={id} className={styles.linkItem}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                  className={styles.link}
                >
                  <Icon className={styles.icon} />
                  <span className={styles.ariaLabel}>{ariaLabel}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
