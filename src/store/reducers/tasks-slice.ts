import { EntityState, PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { ClueDtoType, DatabaseSchemaResponseType, ErrorRunngingQuery, ExpectedResultType, QueryRunResponseType, SubmissionResultType, TaskDataDtoType, TaskDataPayloadType, TaskQueryRunType } from "@/shared/types/task-type";
import type { Edge, Node } from "@xyflow/react";
import { DefaultStateType } from "@/shared/types/state-manager-types";

import { StateType } from "../store";

import { getDatabaseSchema, getTaskClueData, getTaskData, getTaskExpectedResultData, runTaskQuery, submitTaskSolution } from "./actions/task-actions";
import { normalizePreviewError } from "@/shared/utils/preview-error";

type TaskType = {
  taskId: number;
  missionId: number;
  title: string;
  description: string;
  isSolved: boolean;
  isUserHasClue: boolean;
  isUserHasExpectedResult: boolean;
  previous: {
    taskId: number | null;
    missionId: number | null;
  } | null;
  next: {
    taskId: number | null;
    missionId: number | null;
  } | null;
  clue?: ClueDtoType,
  expectedResult?: ExpectedResultType,
  submission: SubmissionResultType | null;
  difficulty?: string;
  userSolution?: string;
};

type TasksStateType = DefaultStateType &
  EntityState<TaskType, string> &
  { queryRun: DefaultStateType & TaskQueryRunType } &
  { schema: { nodes: Node[] | null; edges: Edge[] | null; isLoading: boolean; error: string | null } };

const tasksAdapter = createEntityAdapter<TaskType, string>({
  selectId: (task) => `${task.missionId}.${task.taskId}`,
});

const initialQueryRun = {
  query: null,
  result: null,
  queryError: null,
  analysis: null,
  isLoading: false,
  error: null,
};

const initialState: TasksStateType = tasksAdapter.getInitialState({
  queryRun: initialQueryRun,
  isLoading: false,
  error: null,
  schema: {
    nodes: null,
    edges: null,
    isLoading: false,
    error: null,
  },
});

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetQueryRun: (state) => {
      state.queryRun = initialQueryRun;
    },
  },
  extraReducers: (builder) => {
    builder
      // getTaskData
      .addCase(getTaskData.pending.type, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskData.fulfilled.type, (state, action: PayloadAction<TaskDataDtoType>) => {
        state.isLoading = false;
        state.error = null;

        const task = {
          taskId: action.payload.task_id,
          missionId: action.payload.mission_id,
          title: action.payload.title,
          description: action.payload.description,
          isSolved: action.payload.is_solved,
          isUserHasClue: action.payload.has_clue1,
          isUserHasExpectedResult: action.payload.has_clue2,
          previous: {
            taskId: action.payload.previous.task_id,
            missionId: action.payload.previous.mission_id,
          },
          next: {
            taskId: action.payload.next.task_id,
            missionId: action.payload.next.mission_id,
          },
          submission: null,
          difficulty: action.payload.difficulty,
          userSolution: action.payload.user_solution,
        };

        tasksAdapter.upsertOne(state, task);
      })
      .addCase(getTaskData.rejected.type, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //getTaskClueData
      .addCase(getTaskClueData.pending.type, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskClueData.fulfilled.type, (state, action: PayloadAction<TaskDataPayloadType & { clue: ClueDtoType }>) => {
        state.isLoading = false;
        state.error = null;

        tasksAdapter.updateOne(state, {
          id: `${action.payload.missionId}.${action.payload.taskId}`,
          changes: {
            clue: action.payload.clue,
            isUserHasClue: true,
          }
        });
      })
      .addCase(getTaskClueData.rejected.type, (state, action: PayloadAction<string | ErrorRunngingQuery>) => {
        state.isLoading = false;
        state.error = normalizePreviewError(action.payload).message;
      })

      //getTaskExpectedResultData
      .addCase(getTaskExpectedResultData.pending.type, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskExpectedResultData.fulfilled.type, (state, action: PayloadAction<TaskDataPayloadType & { expectedResult: ExpectedResultType }>) => {
        state.isLoading = false;
        state.error = null;

        tasksAdapter.updateOne(state, {
          id: `${action.payload.missionId}.${action.payload.taskId}`,
          changes: {
            expectedResult: action.payload.expectedResult,
            isUserHasExpectedResult: true,
          }
        });
      })
      .addCase(getTaskExpectedResultData.rejected.type, (state, action: PayloadAction<string | ErrorRunngingQuery>) => {
        state.isLoading = false;
        state.error = normalizePreviewError(action.payload).message;
      })

      //runTaskQuery
      .addCase(runTaskQuery.pending.type, (state) => {
        state.queryRun.isLoading = true;
        state.queryRun.queryError = null;
        state.queryRun.analysis = null;
      })
      .addCase(runTaskQuery.fulfilled.type, (state, action: PayloadAction<QueryRunResponseType>) => {
        state.queryRun.isLoading = false;
        state.queryRun.error = null;

        state.queryRun = {
          isLoading: false,
          error: null,
          query: action.payload.payload.sql_query,
          result: action.payload.response,
          queryError: null,
          analysis: action.payload.response.analysis ?? null,
        };
      })
      .addCase(runTaskQuery.rejected.type, (state, action: PayloadAction<string | ErrorRunngingQuery>) => {
        state.queryRun.isLoading = false;
        state.queryRun.result = null;


        const previewError = normalizePreviewError(action.payload);
        state.queryRun.queryError = previewError.message;
        state.queryRun.analysis = previewError.analysis;
        state.queryRun.error = null;
      })

      //submitTaskSolution
      .addCase(submitTaskSolution.pending.type, (state) => {
        state.queryRun.isLoading = true;
      })
      .addCase(submitTaskSolution.fulfilled.type, (state, action: PayloadAction<TaskDataPayloadType & { submission: SubmissionResultType }>) => {
        state.queryRun.isLoading = false;
        state.queryRun.error = null;
        state.queryRun.queryError = null;
        state.queryRun.analysis = action.payload.submission.analysis ?? null;

        tasksAdapter.updateOne(state, {
          id: `${action.payload.missionId}.${action.payload.taskId}`,
          changes: {
            submission: action.payload.submission,
            isSolved: action.payload.submission.is_correct,
          }
        });
        
        if (action.payload.submission.columns && action.payload.submission.data && action.payload.submission.data.length > 0) {
          state.queryRun.result = {
            columns: action.payload.submission.columns,
            data: action.payload.submission.data,
            row_count: action.payload.submission.data.length,
          };
        } else if (action.payload.submission.is_correct) {
          state.queryRun.result = {
            columns: ["Статус операции"],
            data: [[action.payload.submission.hint || "Решение успешно проверено и принято"]],
            row_count: 1,
          };
          state.queryRun.queryError = null;
        } else {
          state.queryRun.result = null;
          state.queryRun.queryError = action.payload.submission.hint || action.payload.submission.message;
        }
      })
      .addCase(submitTaskSolution.rejected.type, (state, action: PayloadAction<string | ErrorRunngingQuery>) => {
        state.queryRun.isLoading = false;
        state.queryRun.result = null;


        const previewError = normalizePreviewError(action.payload);
        state.queryRun.queryError = previewError.message;
        state.queryRun.analysis = previewError.analysis;
        state.queryRun.error = null;
      })
      .addCase(getDatabaseSchema.pending.type, (state) => {
        state.schema.isLoading = true;
        state.schema.error = null;
      })
      .addCase(getDatabaseSchema.fulfilled.type, (state, action: PayloadAction<DatabaseSchemaResponseType>) => {
        state.schema.isLoading = false;
        state.schema.nodes = action.payload.nodes;
        state.schema.edges = action.payload.edges;
        state.schema.error = null;
      })
      .addCase(getDatabaseSchema.rejected.type, (state, action: PayloadAction<string>) => {
        state.schema.isLoading = false;
        state.schema.error = typeof action.payload === "string" ? action.payload : "Не удалось загрузить схему БД";
      });
  },
});

export const tasksSelectors = tasksAdapter.getSelectors<StateType>(
  (state) => state.task,
);

export default tasksSlice.reducer;
