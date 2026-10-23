import { TaskDataPayloadType } from "@/shared/types/task-type";
import { QuestIds } from "@/shared/consts/quest-id";

const strings = {
  api: {
    rating: "/rating",
    ratingPersonal: "/rating/personal",
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    resetPassword: "/auth/reset-password",
    missions: "/missions",
    achievements: "/achievements",
    profile: "/profile/me",
    profileTaskTotal: "/missions/get_info",
    profileTaskProgress: "/profile/tasks_progress",
    profileAchievements: "/profile/achievements",
    task: ({ missionId, taskId }: TaskDataPayloadType) => `/missions/${missionId}/tasks/${taskId}`,
    runTask: ({ missionId, taskId }: TaskDataPayloadType) => `/missions/${missionId}/tasks/${taskId}/run`,
    submitTaskSolution: ({ missionId, taskId }: TaskDataPayloadType) => `/missions/${missionId}/tasks/${taskId}/submit`,
    clue: ({ missionId, taskId }: TaskDataPayloadType) => `/missions/${missionId}/tasks/${taskId}/clue`,
    expectedResult: ({ missionId, taskId }: TaskDataPayloadType) => `/missions/${missionId}/tasks/${taskId}/expected_result`,
    questList: "/quests",
    questProgress: ({ questId }: { questId: QuestIds }) => `/quests/${questId}/progress`,
    runQuestQuery: ({ questId }: { questId: QuestIds }) => `/quests/${questId}/run`,
    submitQuestQuery: ({ questId }: { questId: QuestIds }) => `/quests/${questId}/submit`,
  },
  unexpectedError: "Неизвестная ошибка",
  incorrectQuery: "Введите корректный SQL запрос",
  correctTaskQuery: "Задача решена",
  incorrectTaskQuery: "Задача не решена",
  questEnd: ({ questId }: { questId: QuestIds }) => `Квест ${QuestIds[questId]} успешно пройден!`,
} as const;

export default strings;
