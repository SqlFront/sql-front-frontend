import { AnalysisPayloadType } from "@/shared/types/analysis-types";

import styles from "./analysis-feedback.module.scss";

type AnalysisFeedbackProps = {
  analysis?: AnalysisPayloadType | null;
};

export const AnalysisFeedback = ({ analysis }: AnalysisFeedbackProps) => {
  if (!analysis) {
    return null;
  }

  return (
    <section className={styles.panel} aria-live="polite">
      <div className={styles.header}>
        <span>Замечаний: {analysis.summary.issue_count}</span>
        {analysis.grading && (
          <span className={styles.grade}>
            {analysis.grading.label} · {analysis.grading.score_percent}%
          </span>
        )}
      </div>

      {analysis.findings.length === 0 ? (
        <p className={styles.clean}>Структурных замечаний к запросу не найдено.</p>
      ) : (
        <ul className={styles.list}>
          {analysis.findings.map((finding, index) => (
            <li
              key={`${finding.code}-${index}`}
              className={`${styles.item} ${finding.severity === "error" ? styles.error : ""}`}
            >
              {finding.message}
              {(finding.location || finding.penalty_rate > 0) && (
                <span className={styles.position}>
                  {finding.location
                    ? `Строка ${finding.location.line}, столбец ${finding.location.column}`
                    : "Рекомендация по качеству"}
                  {finding.penalty_rate > 0
                    ? ` · снижение ${Math.round(finding.penalty_rate * 100)}%`
                    : ""}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
