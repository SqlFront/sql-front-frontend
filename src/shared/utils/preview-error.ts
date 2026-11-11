import { AnalysisPayloadType } from "@/shared/types/analysis-types";

export type NormalizedPreviewError = {
  message: string;
  analysis: AnalysisPayloadType | null;
};

export const normalizePreviewError = (payload: unknown): NormalizedPreviewError => {
  if (typeof payload === "string") {
    return { message: payload, analysis: null };
  }

  if (typeof payload !== "object" || payload === null || !("detail" in payload)) {
    return { message: "Не удалось выполнить SQL-запрос", analysis: null };
  }

  const detail = (payload as { detail: unknown }).detail;
  if (typeof detail === "string") {
    return { message: detail, analysis: null };
  }

  if (typeof detail === "object" && detail !== null) {
    const structured = detail as {
      message?: unknown;
      analysis?: AnalysisPayloadType;
    };
    return {
      message: typeof structured.message === "string"
        ? structured.message
        : "Запрос заблокирован анализатором",
      analysis: structured.analysis ?? null,
    };
  }

  return { message: "Не удалось выполнить SQL-запрос", analysis: null };
};
