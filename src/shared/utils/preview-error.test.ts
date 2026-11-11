import { describe, expect, it } from "vitest";

import { normalizePreviewError } from "./preview-error";

describe("normalizePreviewError", () => {
  it("разделяет сообщение и structured analysis из HTTP detail", () => {
    const analysis = {
      context: { question: "", difficulty: "easy", schema: {} },
      summary: { issue_count: 1, blocking_issue_count: 1, warning_count: 0 },
      findings: [],
      grading: null,
    };

    expect(normalizePreviewError({
      detail: {
        message: "SQL-запрос заблокирован анализатором",
        analysis,
      },
    })).toEqual({
      message: "SQL-запрос заблокирован анализатором",
      analysis,
    });
  });
});
