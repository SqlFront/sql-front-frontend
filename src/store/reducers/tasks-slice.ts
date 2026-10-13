import { EntityState, PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { ClueDtoType, ErrorRunngingQuery, ExpectedResultType, QueryRunResponseType, SubmissionResultType, TaskDataDtoType, TaskDataPayloadType, TaskQueryRunType } from "@/shared/types/task-type";
import { DefaultStateType } from "@/shared/types/state-manager-types";

import { StateType } from "../store";
import { getTaskClueData, getTaskData, getTaskExpectedResultData, runTaskQuery, submitTaskSolution } from "./actions/task-actions";

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
};

type TasksStateType = DefaultStateType &
  EntityState<TaskType, string> &
  { queryRun: DefaultStateType & TaskQueryRunType };

const tasksAdapter = createEntityAdapter<TaskType, string>({
  selectId: (task) => `${task.missionId}.${task.taskId}`,
});

const initialQueryRun = {
  query: null,
  result: null,
  queryError: null,
  isLoading: false,
  error: null,
};

const initialState: TasksStateType = tasksAdapter.getInitialState({
  queryRun: initialQueryRun,
  isLoading: false,
  error: null,
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

        const response = action.payload;

        if (typeof response !== "string" && "detail" in response) {
          state.error = response.detail;
        } else {
          state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
        }
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
        
        const response = action.payload;

        if (typeof response !== "string" && "detail" in response) {
          state.error = response.detail;
        } else {
          state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
        }
      })

      //runTaskQuery
      .addCase(runTaskQuery.pending.type, (state) => {
        state.queryRun.isLoading = true;
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
        };
      })
      .addCase(runTaskQuery.rejected.type, (state, action: PayloadAction<string | ErrorRunngingQuery>) => {
        state.queryRun.isLoading = false;
        state.queryRun.result = null;

        const response = action.payload;
        if (typeof response !== "string" && "detail" in response) {
          state.queryRun.queryError = JSON.stringify(response.detail);
          state.queryRun.error = null;
        } else {
          state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
        }
      })

      //submitTaskSolution
      .addCase(submitTaskSolution.pending.type, (state) => {
        state.queryRun.isLoading = true;
      })
      .addCase(submitTaskSolution.fulfilled.type, (state, action: PayloadAction<TaskDataPayloadType & { submission: SubmissionResultType }>) => {
        state.queryRun.isLoading = false;
        state.queryRun.error = null;
        state.queryRun.queryError = null;

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
        } else if (!action.payload.submission.is_correct) {
          state.queryRun.result = null;
          state.queryRun.queryError = action.payload.submission.hint || action.payload.submission.message;
        }
      })
      .addCase(submitTaskSolution.rejected.type, (state, action: PayloadAction<string | ErrorRunngingQuery>) => {
        state.queryRun.isLoading = false;
        state.queryRun.result = null;

        const response = action.payload;
        if (typeof response !== "string" && "detail" in response) {
          state.queryRun.queryError = JSON.stringify(response.detail);
          state.queryRun.error = null;
        } else {
          state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
        }
      });
  },
});

export const tasksSelectors = tasksAdapter.getSelectors<StateType>(
  (state) => state.task,
);

export default tasksSlice.reducer;
