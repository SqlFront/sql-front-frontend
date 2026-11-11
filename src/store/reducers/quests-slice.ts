import { EntityState, PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { QuestListDataType, QuestProgressType, RunQuestQueryResponseType, SceneProgressType, SubmitQueryResultResponseType, SubmitQueryResultType } from "@/shared/types/quest-types";
import { QuestIds } from "@/shared/consts/quest-id";

import { getQuestList, getQuestProgress, runQuestQuery, submitQuestQuery } from "./actions/quest-action";
import { StateType } from "../store";
import { DefaultStateType } from "@/shared/types/state-manager-types";
import { ErrorRunngingQuery, TaskQueryRunType } from "@/shared/types/task-type";
import { normalizePreviewError } from "@/shared/utils/preview-error";

type QuestStateType = {
  questId: QuestIds;
  sceneId: string | null;
  sceneProgress: SceneProgressType;
  legend: string | null;
  task: string | null;
  isQuestHasClue: boolean;
  // isUserHasClue: boolean; // TODO: are we really need this?
  // clue?: ClueDtoType; //TODO: have we this?
};

type QuestsStateType = DefaultStateType &
  EntityState<QuestStateType, QuestIds> &
  { queryRun: DefaultStateType & TaskQueryRunType } &
  { submission: DefaultStateType & SubmitQueryResultType } &
  { questList: DefaultStateType & { data: QuestListDataType } };

const questsAdapter = createEntityAdapter<QuestStateType, QuestIds>({
  selectId: (quest) => quest.questId,
});

const initialQueryRun = {
  query: null,
  result: null,
  queryError: null,
  analysis: null,
  isLoading: false,
  error: null,
};

const initialSubmission = {
  is_correct: false,
  points: {
    earned: 0,
    penalty: 0,
  },
  is_quest_completed: false,
  awarded_achievements: [],
  isLoading: false,
  error: null,
};

const initialState: QuestsStateType = questsAdapter.getInitialState({
  queryRun: initialQueryRun,
  submission: initialSubmission,
  questList: {
    data: [],
    isLoading: false,
    error: null,
  },
  isLoading: false,
  error: null,
});

export const questSlice = createSlice({
  name: "quest",
  initialState,
  reducers: {
    goToTask: (state, action: PayloadAction<QuestIds>) => {
      questsAdapter.updateOne(state, {
        id: action.payload,
        changes: {
          sceneProgress: "task",
        },
      });
    },
    resetSceneData: (state) => {
      state.queryRun = initialQueryRun;
      state.submission = initialSubmission;
    },
  },
  extraReducers: (builder) => {
    builder
      //getQuestList
      .addCase(getQuestList.pending.type, (state) => {
        state.questList.isLoading = true;
      })
      .addCase(getQuestList.fulfilled.type, (state, action: PayloadAction<QuestListDataType>) => {
        state.questList.isLoading = false;
        state.questList.error = null;
        state.questList.data = action.payload;
      })
      .addCase(getQuestList.rejected.type, (state, action: PayloadAction<string>) => {
        state.questList.isLoading = false;
        state.questList.error = action.payload;
      })

      //getQuestProgress
      .addCase(getQuestProgress.pending.type, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuestProgress.fulfilled.type, (state, action: PayloadAction<QuestProgressType & { questId: QuestIds }>) => {
        state.isLoading = false;
        state.error = null;

        const quest: QuestStateType = {
          questId: action.payload.questId,
          sceneId: action.payload.scene_id,
          sceneProgress: "legend",
          legend: action.payload.legend,
          task: action.payload.task,
          isQuestHasClue: action.payload.has_clue,
        };

        questsAdapter.upsertOne(state, quest);
      })
      .addCase(getQuestProgress.rejected.type, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //runQuestQuery
      .addCase(runQuestQuery.pending.type, (state) => {
        state.isLoading = true;
        state.queryRun.queryError = null;
        state.queryRun.analysis = null;
      })
      .addCase(runQuestQuery.fulfilled.type, (state, action: PayloadAction<RunQuestQueryResponseType>) => {
        state.isLoading = false;
        state.error = null;

        state.queryRun = {
          isLoading: false,
          error: null,
          query: action.payload.sql_query,
          result: action.payload.response,
          queryError: null,
          analysis: action.payload.response.analysis ?? null,
        };
      })
      .addCase(runQuestQuery.rejected.type, (state, action: PayloadAction<string | ErrorRunngingQuery>) => {
        state.queryRun.isLoading = false;
        state.queryRun.result = null;

        const previewError = normalizePreviewError(action.payload);
        state.queryRun.queryError = previewError.message;
        state.queryRun.analysis = previewError.analysis;
        state.queryRun.error = null;
      })

      //submitQuestQuery
      .addCase(submitQuestQuery.pending.type, (state) => {
        state.isLoading = true;
      })
      .addCase(submitQuestQuery.fulfilled.type, (state, action: PayloadAction<SubmitQueryResultResponseType>) => {
        state.isLoading = false;
        state.error = null;

        state.submission = {
          isLoading: false,
          error: null,
          ...action.payload.response,
        };
      })
      .addCase(submitQuestQuery.rejected.type, (state, action: PayloadAction<string | ErrorRunngingQuery>) => {
        state.queryRun.isLoading = false;
        state.queryRun.result = null;

        const previewError = normalizePreviewError(action.payload);
        state.queryRun.queryError = previewError.message;
        state.queryRun.analysis = previewError.analysis;
        state.queryRun.error = null;
      });
    }
});

export const questsSelectors = questsAdapter.getSelectors(
  (state: StateType) => state.quest,
);

export default questSlice.reducer;
