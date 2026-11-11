import strings from "@/shared/consts/strings";

export type PreparedSqlPreview = {
  sql: string;
  error: string | null;
};

const withoutComments = (value: string) => value
  .replace(/--.*$/gmu, "")
  .replace(/\/\*[\s\S]*?\*\//gu, "")
  .trim();

/** Проверяет только пустой ввод; допустимый вид SQL определяет backend-анализатор. */
export const prepareSqlPreview = (value: string): PreparedSqlPreview => {
  if (!withoutComments(value)) {
    return { sql: "", error: strings.incorrectQuery };
  }

  return { sql: value.trim(), error: null };
};
