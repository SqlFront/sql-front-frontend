import React from "react";
import styles from "./bug-report-button.module.scss";
import Link from "next/link";

export const BugReportButton = () => {
  return (
    <Link
      href="https://forms.yandex.ru/u/6ad49fb0852af3e621c7a24c/"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.bugReportButton}
    >
      <span className={styles.icon}>🐛</span>
      Сообщить о баге
    </Link>
  );
};
