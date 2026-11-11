export type FindingLocationType = {
  line: number;
  column: number;
  end_line: number;
  end_column: number;
  snippet: string;
};

export type AnalysisFindingType = {
  code: string;
  message: string;
  severity: "error" | "warning" | "info";
  category: "syntax" | "security" | "requirement" | "style" | "efficiency";
  rule_id: string;
  blocks_execution: boolean;
  penalty_rate: number;
  location: FindingLocationType | null;
  details: Record<string, unknown>;
};

export type AnalysisPayloadType = {
  context: {
    question: string;
    difficulty: string;
    schema: Record<string, string[]>;
  };
  summary: {
    issue_count: number;
    blocking_issue_count: number;
    warning_count: number;
  };
  findings: AnalysisFindingType[];
  grading: {
    grade: "satisfactory" | "good" | "excellent";
    label: string;
    score_percent: number;
    available_points: number;
    points_after_quality: number;
    penalty_points: number;
    penalty_rate: number;
  } | null;
};
