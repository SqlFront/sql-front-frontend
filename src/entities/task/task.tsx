import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { MenuIcon } from "@/shared/ui/menu-icon/menu-icon";
import { MenuDrawer } from "@/entities/menu-drawer/menu-drawer";
import { Title } from "@/shared/ui/title/title";
import { Text } from "@/shared/ui/text/text";
import { TaskBlock } from "@/shared/ui/task-block/task-block";
import { getTaskClueData, getTaskExpectedResultData, runTaskQuery, submitTaskSolution } from "@/store/reducers/actions/task-actions";

import { useTaskData } from "./use-task-data";
import styles from "./task.module.scss";
import { databaseEdges, databaseNodes } from "./const";
import strings from "@/shared/consts/strings";
import { SubmissionResultType } from "@/shared/types/task-type";
import { AchievementToast } from "@/shared/ui/achievement-toast/achievement-toast";
import { tasksSlice } from "@/store/reducers/tasks-slice";
import api from "@/shared/config/axios";

const SubmitionToastText = (submission: SubmissionResultType | null, isSolved: boolean) => {
  if (submission === null) {
    return "";
  }

  if (isSolved) {
    return (
      <Text>{submission.message}</Text>
    );
  }

  if (submission.is_correct) {
    return (
      <Text>
        {strings.correctTaskQuery} +{submission.points_earned}
      </Text>
    );
  } else {
    return (
      <Text>
        {strings.incorrectTaskQuery} -{submission.points_penalty}
        {submission.hint && (
          <>
            <br />
            {submission.hint}
          </>
        )}
      </Text>
    );
  }
};

export const Task = () => {
  const dispatch = useAppDispatch();
  const { queryRun } = useAppSelector((state) => state.task);
  const { resetQueryRun } = tasksSlice.actions;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const data = useTaskData();

  useEffect(() => {
    dispatch(resetQueryRun());
  }, [dispatch, resetQueryRun, data.missionId, data.taskId]);

  useEffect(() => {
    if (data.missionId !== undefined && data.taskId !== undefined) {
      const saved = localStorage.getItem(`sql_draft_mission_${data.missionId}_task_${data.taskId}`);
      if (saved) {
        setValue(saved);
      } else {
        setValue("");
      }
    }
  }, [data.missionId, data.taskId]);
  
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, [setIsMenuOpen]);
  // Telemetry: user inactivity & tab switching
  useEffect(() => {
    if (data.missionId === undefined || data.taskId === undefined) {
      return;
    }

    let hasSentInactive = false;
    const sendInactiveTelemetry = () => {
      if (hasSentInactive) {
        return;
      }
      hasSentInactive = true;
      api.post(`/util/${data.missionId}/tasks/${data.taskId}/inactive`).catch(() => {});
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        sendInactiveTelemetry();
      } else {
        hasSentInactive = false;
      }
    };

    const handleBlur = () => {
      sendInactiveTelemetry();
    };

    const handleFocus = () => {
      hasSentInactive = false;
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [data.missionId, data.taskId]);

  // Telemetry: code paste detection (> 25 characters)
  useEffect(() => {
    if (data.missionId === undefined || data.taskId === undefined) {
      return;
    }

    const handlePaste = (e: ClipboardEvent) => {
      const pasted = e.clipboardData?.getData("text") || "";
      if (pasted.length > 25) {
        api.post(`/util/${data.missionId}/tasks/${data.taskId}/paste`, {
          length: pasted.length,
          preview: pasted.slice(0, 40),
        }).catch(() => {});
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [data.missionId, data.taskId]);


  const onChange = useCallback((val: string) => {
    setValue(val);
    if (data.missionId !== undefined && data.taskId !== undefined) {
      localStorage.setItem(`sql_draft_mission_${data.missionId}_task_${data.taskId}`, val);
    }
  }, [setValue, data.missionId, data.taskId]);

  const queryRunHandle = useCallback(() => {
    setError("");
    const clearValue = value.replace(/--.*$/gmi, "").replace(/\n/gmi, " ");

    if (!clearValue.toLocaleLowerCase().includes("select")) { //TODO: add node-sql-parser to check is 
      setError(strings.incorrectQuery);
      return;
    }

    dispatch(runTaskQuery({
      taskId: data.taskId,
      missionId: data.missionId,
      payload: { sql_query: clearValue },
    }));
  }, [dispatch, data.missionId, data.taskId, value]);

  const submitSolution = useCallback(async () => {
    try {
      const result = await dispatch(submitTaskSolution({
        taskId: data.taskId,
        missionId: data.missionId,
        payload: { sql_query: value },
      })).unwrap();

      if (result.submission?.is_correct) {
        toast.success(SubmitionToastText(result.submission, data.task.isSolved));
        result.submission.awarded_achievements.forEach((achievement) => {
          toast.custom(<AchievementToast achievement={achievement} />, { duration: 5000, });
        });
      } else {
        toast.error(SubmitionToastText(result.submission, data.task.isSolved));
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
  }, [dispatch, data.taskId, data.missionId, value, data.task?.isSolved]);

  const getClue = useCallback(() => {
    dispatch(getTaskClueData({
      taskId: data.taskId,
      missionId: data.missionId, 
    }))
      .unwrap()
      .then((response) => {
        if (response.clue.points_spent > 0) {
          toast(<Text>- {response.clue.points_spent}</Text>, { icon: "⚠️" });
        }
      })
      .catch((error) => toast(<Text>{error.detail ? error.detail : error.message}</Text>));
  }, [dispatch, data.taskId, data.missionId]);

  const getExpectedResult = useCallback(() => {
    dispatch(getTaskExpectedResultData({
      taskId: data.taskId,
      missionId: data.missionId, 
    }))
      .unwrap()
      .then((response) => {
        if (response.expectedResult.points_spent > 0) {
          toast(<Text>- {response.expectedResult.points_spent}</Text>, { icon: "⚠️" });
        }
      })
      .catch((error) => toast(<Text>{error.detail ? error.detail : error.message}</Text>));
  }, [dispatch, data.taskId, data.missionId]);

  return (
    <section className={styles.task}>
      <MenuIcon color="red" onClick={toggleMenu}/>
      <MenuDrawer isOpen={isMenuOpen} onClose={toggleMenu} currentPage="missions"/>
      
      <div className={styles.spaceBetween}>
        <Text>
          Миссия {data.missionId}.{data.taskId}
        </Text>
        <Text>
          Мои баллы: {data.totalScore}
        </Text>
      </div>

      <Title
        color="black"
        size="7vw"
        margin="6vw 0"
      >
        {data.task?.title}
        <br />
        <span style={{ fontSize: "1.8vw", verticalAlign: "middle", opacity: 0.6, whiteSpace: "nowrap", display: "inline-block", marginTop: "0.5vw" }}>
          {
            ({
              0: "Новобранец",
              1: "Специалист",
              2: "Мастер",
              3: "Специалист",
              4: "Мастер",
              5: "Эксперт",
            } as Record<number, string>)[Number(data.missionId)] || ""
          }
        </span>
      </Title>
      <TaskBlock
        type="task"
        isSolved={data.task?.isSolved}
        task={data.task?.description}
        clueData={{
          clue: data.task?.clue?.clue,
          expectedResult: data.task?.expectedResult?.expected_result,
          isUserHasClue: data.task?.isUserHasClue,
          isUserHasExpectedResult: data.task?.isUserHasExpectedResult,
          getExpectedResult: getExpectedResult,
        }}
        databaseNodes={databaseNodes}
        databaseEdges={databaseEdges}
        onChange={onChange}
        value={value}
        queryRunHandle={queryRunHandle}
        submitSolution={submitSolution}
        resultData={error ? error : queryRun.result ? queryRun.result : queryRun.queryError}
        getClue={getClue}
        nextTask={data.task?.next}
      />
    </section>
  );
};
