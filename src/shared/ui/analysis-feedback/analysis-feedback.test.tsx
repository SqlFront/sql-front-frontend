import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnalysisPayloadType } from "@/shared/types/analysis-types";

import { AnalysisFeedback } from "./analysis-feedback";

describe("AnalysisFeedback", () => {
  it("показывает structured finding, координаты и снижение баллов", () => {
    const analysis: AnalysisPayloadType = {
      context: { question: "", difficulty: "easy", schema: {} },
      summary: { issue_count: 1, blocking_issue_count: 1, warning_count: 0 },
      findings: [{
        code: "requirement.missing_selected_columns",
        message: "Укажите обязательные столбцы явно",
        severity: "error",
        category: "requirement",
        rule_id: "query_requirements",
        blocks_execution: true,
        penalty_rate: 0.05,
        location: {
          line: 1,
          column: 8,
          end_line: 1,
          end_column: 9,
          snippet: "SELECT * FROM soldier",
        },
        details: {},
      }],
      grading: null,
    };

    render(<AnalysisFeedback analysis={analysis} />);

    expect(screen.getByText("Замечаний: 1")).toBeInTheDocument();
    expect(screen.getByText("Укажите обязательные столбцы явно")).toBeInTheDocument();
    expect(screen.getByText(/Строка 1, столбец 8/)).toHaveTextContent("снижение 5%");
    expect(screen.queryByText(/Runtime error/i)).not.toBeInTheDocument();
  });
});
