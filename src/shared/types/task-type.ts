import type { Edge, Node } from "@xyflow/react";
import { AchievementSubmitType } from "./achievements-types";
import { AnalysisPayloadType } from "./analysis-types";

export type ResultQueryDataType = {
  columns: string[],
  data: (number | string)[][],
  row_count: number,
  analysis?: AnalysisPayloadType,
};

export type TaskQueryRunType = {
  query: string | null;
  result: ResultQueryDataType | null;
  queryError: string | null;
  analysis: AnalysisPayloadType | null;
};

export type ErrorRunngingQuery = {
  detail: string | {
    message: string;
    analysis: AnalysisPayloadType;
  },
};

export type TaskDataPayloadType = {
  taskId: string,
  missionId: string,
};

export type QueryRunType = {
  payload: { sql_query: string };
};

export type QueryRunResponseType = TaskDataPayloadType & QueryRunType & { response: ResultQueryDataType };

export type TaskDataDtoType = {
  task_id: number,
  mission_id: number,
  title: string,
  description: string,
  is_solved: boolean,
  has_clue1: boolean,
  has_clue2: boolean,
  previous: {
    mission_id: number | null,
    task_id: number | null,
  },
  next: {
    mission_id: number | null,
    task_id: number | null,
  },
  difficulty?: string,
  user_solution?: string,
};

export type ClueDtoType = {
  points_spent: number;
  total_score: number;
  clue: string;
};

export type ExpectedResultType = {
  points_spent: number;
  total_score: number;
  expected_result: ResultQueryDataType,
};

export type TaskClueData = {
  clue?: string;
  expectedResult?: ResultQueryDataType,
  isUserHasClue: boolean;
  isUserHasExpectedResult: boolean;
  getExpectedResult: () => void;
};

export type SubmissionResultType = {
  is_correct: boolean;
  message: string;
  was_solved_before: boolean;
  points_earned: number;
  points_penalty: number;
  current_points: number;
  awarded_achievements: AchievementSubmitType[];
  columns?: string[];
  data?: (number | string)[][];
  hint?: string;
  analysis?: AnalysisPayloadType | null;
};

export type DatabaseSchemaResponseType = {
  nodes: Node[];
  edges: Edge[];
};
