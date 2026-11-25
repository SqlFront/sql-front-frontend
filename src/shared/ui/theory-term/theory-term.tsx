import { useCallback, useEffect, useRef, useState } from "react";
import cn from "classnames";

import { TheoryTermKey, theoryTerms } from "@/shared/consts/theory-terms";

import styles from "./theory-term.module.scss";

type TheoryTermProps = {
  term: TheoryTermKey;
  children: React.ReactNode;
};

const EDGE_MARGIN = 12;

export const TheoryTerm = ({ term, children }: TheoryTermProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const data = theoryTerms[term];

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const updatePosition = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const above = rect.top;
    root.style.setProperty("--hint-space", Math.max(0, above - EDGE_MARGIN) + "px");
  }, []);

  const toggle = useCallback(() => {
    updatePosition();
    setIsOpen((prev) => !prev);
  }, [updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, close, updatePosition]);

  return (
    <span className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={cn(styles.term, { [styles.termActive]: isOpen })}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      {isOpen && (
        <span
          className={cn(styles.popover, styles.top)}
          role="dialog"
          aria-label={data.title}
        >
          <span className={styles.content} tabIndex={0}>
            <span className={styles.header}>
              <span className={styles.title}>{data.title}</span>
              <button
                type="button"
                className={styles.close}
                onClick={close}
                aria-label="Закрыть"
              >
                ×
              </button>
            </span>
            <span className={styles.text}>{data.text}</span>
            <code className={styles.syntax}>{data.syntax}</code>
            <a
              className={styles.link}
              href={data.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Подробнее в документации
            </a>
          </span>
          <span className={styles.arrow} aria-hidden="true" />
        </span>
      )}
    </span>
  );
};
