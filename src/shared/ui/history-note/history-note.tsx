import { useCallback, useState } from "react";
import cn from "classnames";

import { HistoryNote as HistoryNoteType } from "@/shared/consts/history-notes";

import styles from "./history-note.module.scss";

type HistoryNoteProps = {
  note: HistoryNoteType;
};

export const HistoryNote = ({ note }: HistoryNoteProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <section className={styles.card} aria-label="Историческая справка">
      <button
        type="button"
        className={styles.header}
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className={styles.label}>Историческая справка</span>
        <svg
          className={cn(styles.chevron, { [styles.chevronOpen]: isOpen })}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className={cn(styles.body, { [styles.bodyOpen]: isOpen })}>
        <div className={styles.inner}>
          <h2 className={styles.title}>{note.title}</h2>
          <span className={styles.dates}>{note.dates}</span>
          <p className={styles.text}>{note.text}</p>
          <a
            className={styles.link}
            href={note.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isOpen ? 0 : -1}
          >
            Подробнее
          </a>
        </div>
      </div>
    </section>
  );
};
