import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { questSlice } from "@/store/reducers/quests-slice";
import { MenuDrawer } from "@/entities/menu-drawer/menu-drawer";
import { MenuIcon } from "@/shared/ui/menu-icon/menu-icon";
import { TaskBlock } from "@/shared/ui/task-block/task-block";
import { isQuestId } from "@/shared/utils/is-quest-id";
import { getQuestProgress, runQuestQuery, submitQuestQuery } from "@/store/reducers/actions/quest-action";
import { Text } from "@/shared/ui/text/text";
import strings from "@/shared/consts/strings";

import { useSceneData } from "./use-scene-data";
import { LegendBlock } from "./legend-block";
import { databaseEdges, databaseNodes } from "./const";
import styles from "./scene.module.scss";
import { SubmitQueryResultType } from "@/shared/types/quest-types";
import { AchievementToast } from "@/shared/ui/achievement-toast/achievement-toast";
import { ImageSceneBackground } from "@/shared/ui/image--scene-background/image--scene-background";

const SubmitionToastText = (submission: SubmitQueryResultType | null) => {
  if (submission === null) {
    return "";
  }

  if (submission.is_correct) {
    return (
      <Text>
        {strings.correctTaskQuery} +{submission.points.earned}
      </Text>
    );
  } else {
    return (
      <Text>
        {strings.incorrectTaskQuery} -{submission.points.penalty}
      </Text>
    );
  }
};

export const Scene = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const data = useSceneData();
  const dispatch = useAppDispatch();
  const { queryRun } = useAppSelector((state) => state.quest);
  const { goToTask, resetSceneData } = questSlice.actions;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (data?.questId !== undefined && data?.sceneId !== undefined) {
      const saved = localStorage.getItem(`sql_draft_quest_${data.questId}_scene_${data.sceneId}`);
      if (saved) {
        setValue(saved);
      } else {
        setValue("");
      }
    }
  }, [data?.questId, data?.sceneId]);

  const onChange = useCallback((val: string) => {
    setValue(val);
    if (data?.questId !== undefined && data?.sceneId !== undefined) {
      localStorage.setItem(`sql_draft_quest_${data.questId}_scene_${data.sceneId}`, val);
    }
  }, [setValue, data?.questId, data?.sceneId]);

  const handleRunQuery = useCallback(() => {
    if (!data) {
      return;
    }

    if (!data.questId && !isQuestId(data.questId)) {
      return;
    }

    if (!data.sceneId) {
      return;
    }

    setError("");
    const clearValue = value.replace(/--.*$/gmi, "").replace(/\n/gmi, " ");

    if (
      !clearValue.toLocaleLowerCase().includes("select") &&
      !clearValue.toLocaleLowerCase().includes("update")
    ) { //TODO: add node-sql-parser to check is 
      setError(strings.incorrectQuery);
      return;
    }

    dispatch(runQuestQuery({
      questId: data.questId,
      payload: {
        scene_id: data?.sceneId,
        sql_query: clearValue,
      },
    }));
  }, [dispatch, data, value]);

  const handleSubmitSolution = useCallback(async () => {
    if (!data) {
      return;
    }

    if (!data.questId && !isQuestId(data.questId)) {
      return;
    }

    if (!data.sceneId) {
      return;
    }

    try {
      const result = await dispatch(submitQuestQuery({
        questId: data.questId,
        payload: {
          scene_id: data?.sceneId,
          sql_query: value,
        },
      })).unwrap();
      
      if (result.response.is_correct) {
        toast.success(SubmitionToastText(result.response));
        result.response.awarded_achievements.forEach((achievement) => {
          toast.custom(<AchievementToast achievement={achievement} />, { duration: 5000, });
        });

        setValue("");
        dispatch(resetSceneData());

        if (result.response.is_quest_completed) {
          toast.success(<Text>{strings.questEnd({ questId: data.questId })}</Text>);
          router.replace("/quest");
          return;
        }

        dispatch(getQuestProgress(data.questId));
      } else {
        toast.error(SubmitionToastText(result.response));
      }
    } catch (err: unknown) {
      const errorMsg =
        typeof err === "object" && err !== null && "detail" in err
          ? String((err as { detail: unknown }).detail)
          : typeof err === "string"
          ? err
          : strings.unexpectedError;
      toast.error(errorMsg);
    }
  }, [dispatch, resetSceneData, data, value, router]);

  const onLegendEnds = useCallback(() => {
    if (!data?.questId && !isQuestId(data?.questId)) {
      return;
    }

    if (!data.sceneId) {
      return;
    }

    const isQuestHasTask = !!(data.task);

    if (isQuestHasTask) {
      dispatch(goToTask(data.questId));
      return;
    }

    if (!isQuestId(data.questId)) {
      return;
    }
    
    if (!isQuestHasTask) {
      handleSubmitSolution();
    }

    dispatch(getQuestProgress(data.questId));
  }, [
    dispatch,
    handleSubmitSolution,
    goToTask,
    data?.questId,
    data?.task,
    data?.sceneId
  ]);

  if (!data || !data.sceneId) {
    return null;
  }

  return (
    <section className={styles.section}>
      <MenuIcon color="red" onClick={toggleMenu}/>
      <MenuDrawer isOpen={isMenuOpen} onClose={toggleMenu} currentPage="quest" />
      
      <ImageSceneBackground
        questId={data.questId}
        sceneId={data.sceneId}
        isTask={data.sceneProgress === "task"}
      />
      {/*//TODO: add screen when sceneData is undefined */}
      {
        data.sceneProgress === "legend" && data.legend
          ? <LegendBlock
              key={data.sceneId}
              text={data.legend}
              onEnds={onLegendEnds}
            />
          : data.task
            && <div style={{width: "80vw", zIndex: "1" }}>
                <TaskBlock
                  type="quest"
                  task={data.task}
                  sceneId={data.sceneId}
                  clueData={{
                    isUserHasClue: false, //TODO: are we need this?
                    isQuestHasClue: data.isQuestHasClue, //TODO: are we need this?
                  }}
                  databaseNodes={databaseNodes}
                  databaseEdges={databaseEdges}
                  onChange={onChange}
                  value={value}

                  queryRunHandle={handleRunQuery}
                  submitSolution={handleSubmitSolution}
                  resultData={error ? error : queryRun.result ? queryRun.result : queryRun.queryError}
                  getClue={() => { return; }} // TODO: add clue handle
                />
              </div>
      }
    </section>
  );
};
