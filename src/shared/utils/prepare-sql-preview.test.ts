import { describe, expect, it } from "vitest";

import { prepareSqlPreview } from "./prepare-sql-preview";

describe("prepareSqlPreview", () => {
  it("передаёт SELECT на backend без клиентской проверки синтаксиса", () => {
    const result = prepareSqlPreview("  SELECT id FROM soldier;  ");

    expect(result).toEqual({
      sql: "SELECT id FROM soldier;",
      error: null,
    });
  });

  it("не блокирует CREATE FUNCTION на клиенте", () => {
    const sql = `CREATE OR REPLACE FUNCTION answer(p_id INT)
RETURNS INT AS $$ BEGIN RETURN p_id; END; $$ LANGUAGE plpgsql;`;

    expect(prepareSqlPreview(sql)).toEqual({ sql, error: null });
  });

  it("отклоняет пустой ввод и строку только с комментариями", () => {
    expect(prepareSqlPreview("   ").error).toBe("Введите корректный SQL запрос");
    expect(prepareSqlPreview("-- только комментарий\n/* и ещё один */").error)
      .toBe("Введите корректный SQL запрос");
  });
});
