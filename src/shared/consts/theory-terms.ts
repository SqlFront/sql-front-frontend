export type TheoryTerm = {
  title: string;
  text: string;
  syntax: string;
  docsUrl: string;
};

const DOCS = "https://postgrespro.ru/docs/postgresql/current";

export const theoryTerms = {
  select: {
    title: "SELECT",
    text: "Выбирает из таблицы нужные столбцы. Названия столбцов перечисляют через запятую, а чтобы взять все столбцы сразу, пишут *.",
    syntax: "SELECT столбец1, столбец2 FROM таблица;",
    docsUrl: `${DOCS}/tutorial-select`,
  },
  where: {
    title: "WHERE",
    text: "Оставляет в результате только строки, которые подходят под условие. Остальные строки отбрасываются. Для сравнения используются =, <>, <, >, <=, >=.",
    syntax: "SELECT столбец FROM таблица WHERE столбец = 'значение';",
    docsUrl: `${DOCS}/queries-table-expressions#QUERIES-WHERE`,
  },
  count: {
    title: "COUNT",
    text: "Считает, сколько строк попало в результат. Чтобы дать вычисленному столбцу понятное имя, после него пишут AS и название.",
    syntax: "SELECT COUNT(*) AS имя_столбца FROM таблица;",
    docsUrl: `${DOCS}/functions-aggregate`,
  },
  order_by: {
    title: "ORDER BY",
    text: "Сортирует строки результата по указанному столбцу. По умолчанию — по возрастанию; чтобы отсортировать по убыванию, после столбца пишут DESC.",
    syntax: "SELECT столбец1, столбец2 FROM таблица ORDER BY столбец2 DESC;",
    docsUrl: `${DOCS}/queries-order`,
  },
  join: {
    title: "JOIN",
    text: "Соединяет строки двух таблиц в одну по общему полю. После ON указывается, какие столбцы должны совпадать.",
    syntax: [
      "SELECT таблица1.столбец, таблица2.столбец",
      "FROM таблица1",
      "JOIN таблица2 ON таблица1.ключ = таблица2.внешний_ключ;",
    ].join("\n"),
    docsUrl: `${DOCS}/queries-table-expressions#QUERIES-JOIN`,
  },
  like: {
    title: "LIKE",
    text: "Ищет строки по шаблону: % заменяет любое количество символов, _ — ровно один символ. Регистр букв учитывается.",
    syntax: "SELECT столбец FROM таблица WHERE столбец LIKE 'Начало%';",
    docsUrl: `${DOCS}/functions-matching#FUNCTIONS-LIKE`,
  },
  ilike: {
    title: "ILIKE",
    text: "Работает как LIKE, но не различает большие и маленькие буквы: «Слово», «слово» и «СЛОВО» считаются одинаковыми.",
    syntax: "SELECT столбец FROM таблица WHERE столбец ILIKE '%слово%';",
    docsUrl: `${DOCS}/functions-matching#FUNCTIONS-LIKE`,
  },
  regex: {
    title: "~ (регулярные выражения)",
    text: "Проверяет, подходит ли строка под регулярное выражение; шаблон ищется в любом месте строки. ~* — то же без учёта регистра, !~ и !~* — «не подходит».",
    syntax: "SELECT столбец FROM таблица WHERE столбец ~ 'шаблон';",
    docsUrl: `${DOCS}/functions-matching#FUNCTIONS-POSIX-REGEXP`,
  },
  or: {
    title: "OR",
    text: "Объединяет условия: строка попадает в результат, если выполнено хотя бы одно из них.",
    syntax: [
      "SELECT столбец FROM таблица",
      "WHERE столбец = 'значение1' OR столбец = 'значение2';",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-logical`,
  },
  not: {
    title: "NOT",
    text: "Переворачивает условие: в результат попадают строки, для которых условие НЕ выполняется. Часто используется вместе с LIKE.",
    syntax: "SELECT столбец FROM таблица WHERE столбец NOT LIKE '%слово%';",
    docsUrl: `${DOCS}/functions-logical`,
  },
  group_by: {
    title: "GROUP BY",
    text: "Собирает строки с одинаковыми значениями в группы, чтобы посчитать что-то для каждой группы — например, количество.",
    syntax: "SELECT столбец, COUNT(*) FROM таблица GROUP BY столбец;",
    docsUrl: `${DOCS}/queries-table-expressions#QUERIES-GROUP`,
  },
  avg: {
    title: "AVG",
    text: "Считает среднее значение по столбцу. Внутри можно писать не только столбец, но и выражение с арифметикой: +, -, *, /.",
    syntax: "SELECT AVG(столбец) AS имя_столбца FROM таблица;",
    docsUrl: `${DOCS}/functions-aggregate`,
  },
  sum: {
    title: "SUM",
    text: "Складывает значения столбца.",
    syntax: "SELECT SUM(столбец) AS имя_столбца FROM таблица;",
    docsUrl: `${DOCS}/functions-aggregate`,
  },
  min_max: {
    title: "MIN / MAX",
    text: "MIN находит наименьшее значение, MAX — наибольшее. Работают с числами, датами и строками.",
    syntax: "SELECT MIN(столбец), MAX(столбец) FROM таблица;",
    docsUrl: `${DOCS}/functions-aggregate`,
  },
  concat: {
    title: "Склейка строк ||",
    text: "Оператор || склеивает строки в одну, между ними можно вставлять свой текст в одинарных кавычках.",
    syntax: "SELECT столбец1 || ' — ' || столбец2 AS имя_столбца FROM таблица;",
    docsUrl: `${DOCS}/functions-string`,
  },
  distinct: {
    title: "DISTINCT",
    text: "Убирает повторяющиеся строки из результата. COUNT(DISTINCT столбец) считает, сколько в столбце разных значений.",
    syntax: "SELECT COUNT(DISTINCT столбец) FROM таблица;",
    docsUrl: `${DOCS}/queries-select-lists#QUERIES-DISTINCT`,
  },
  variance: {
    title: "VARIANCE",
    text: "Считает дисперсию — насколько сильно значения разбросаны вокруг среднего. Чем больше число, тем сильнее разброс.",
    syntax: "SELECT VARIANCE(столбец) FROM таблица;",
    docsUrl: `${DOCS}/functions-aggregate#FUNCTIONS-AGGREGATE-STATISTICS-TABLE`,
  },
  case: {
    title: "CASE",
    text: "Работает как «если — то — иначе»: проверяет условия по порядку и возвращает значение для первого подходящего. Если ни одно не подошло — значение из ELSE.",
    syntax: [
      "SELECT столбец,",
      "       CASE WHEN условие1 THEN 'значение1'",
      "            WHEN условие2 THEN 'значение2'",
      "            ELSE 'значение3'",
      "       END AS имя_столбца",
      "FROM таблица;",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-conditional#FUNCTIONS-CASE`,
  },
  extract: {
    title: "EXTRACT",
    text: "Достаёт из даты нужную часть: YEAR — год, MONTH — месяц, DAY — день.",
    syntax: "SELECT EXTRACT(YEAR FROM столбец_с_датой) AS год FROM таблица;",
    docsUrl: `${DOCS}/functions-datetime#FUNCTIONS-DATETIME-EXTRACT`,
  },
  round: {
    title: "ROUND",
    text: "Округляет число. Второй аргумент — сколько оставить знаков после запятой; без него число округляется до целого.",
    syntax: "SELECT ROUND(AVG(столбец), 2) FROM таблица;",
    docsUrl: `${DOCS}/functions-math`,
  },
  date_diff: {
    title: "Разница дат",
    text: "Если из одной даты вычесть другую, получится число дней между ними.",
    syntax: "SELECT дата_конца - дата_начала AS дней FROM таблица;",
    docsUrl: `${DOCS}/functions-datetime`,
  },
  subquery: {
    title: "Подзапрос",
    text: "Запрос можно вложить в другой запрос в круглых скобках. Если подзапрос возвращает одно значение, с ним сравнивают через =, <, >. Подзапрос может ссылаться на столбцы внешнего запроса.",
    syntax: [
      "SELECT столбец FROM таблица",
      "WHERE число = (SELECT MAX(число) FROM таблица);",
    ].join("\n"),
    docsUrl: `${DOCS}/sql-expressions#SQL-SYNTAX-SCALAR-SUBQUERIES`,
  },
  is_null: {
    title: "IS NULL",
    text: "NULL означает, что значения нет. Проверить его через = нельзя — для этого пишут IS NULL, а для «значение есть» — IS NOT NULL.",
    syntax: "SELECT столбец FROM таблица WHERE столбец IS NULL;",
    docsUrl: `${DOCS}/functions-comparison`,
  },
  and: {
    title: "AND",
    text: "Объединяет условия: строка попадает в результат, только если выполнены все условия сразу.",
    syntax: [
      "SELECT столбец FROM таблица",
      "WHERE столбец1 = 'значение' AND столбец2 > 10;",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-logical`,
  },
  having: {
    title: "HAVING",
    text: "Фильтрует группы после GROUP BY. WHERE отбирает отдельные строки до группировки, а HAVING — уже готовые группы, например по COUNT или SUM.",
    syntax: [
      "SELECT столбец, COUNT(*) FROM таблица",
      "GROUP BY столбец HAVING COUNT(*) > 5;",
    ].join("\n"),
    docsUrl: `${DOCS}/queries-table-expressions#QUERIES-GROUP`,
  },
  window_rank: {
    title: "Оконные функции, DENSE_RANK",
    text: "Оконная функция считает значение для каждой строки, но, в отличие от GROUP BY, не склеивает строки. DENSE_RANK() выдаёт место в рейтинге по порядку из OVER (ORDER BY …). Чтобы оставить только первые N строк, в конце запроса пишут LIMIT N.",
    syntax: [
      "SELECT столбец, DENSE_RANK() OVER (ORDER BY число DESC) AS ранг",
      "FROM таблица",
      "ORDER BY ранг LIMIT 5;",
    ].join("\n"),
    docsUrl: `${DOCS}/tutorial-window`,
  },
  in: {
    title: "IN",
    text: "Проверяет, есть ли значение в списке. Короче, чем несколько условий через OR.",
    syntax: [
      "SELECT столбец FROM таблица",
      "WHERE столбец IN ('значение1', 'значение2');",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-comparisons#FUNCTIONS-COMPARISONS-IN-SCALAR`,
  },
  partition_by: {
    title: "PARTITION BY",
    text: "Делит строки на группы внутри оконной функции: рейтинг или счёт начинается заново в каждой группе.",
    syntax: [
      "SELECT столбец1, столбец2,",
      "       DENSE_RANK() OVER (PARTITION BY столбец1 ORDER BY число DESC) AS ранг",
      "FROM таблица;",
    ].join("\n"),
    docsUrl: `${DOCS}/tutorial-window`,
  },
  string_agg: {
    title: "STRING_AGG",
    text: "Склеивает значения группы в одну строку через указанный разделитель.",
    syntax: [
      "SELECT столбец1, STRING_AGG(столбец2, ', ')",
      "FROM таблица GROUP BY столбец1;",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-aggregate`,
  },
  first_last_value: {
    title: "FIRST_VALUE",
    text: "Оконная функция: берёт значение из первой строки окна по порядку из ORDER BY. Чтобы получить последнее значение, проще отсортировать в обратном порядке (DESC).",
    syntax: [
      "SELECT столбец1,",
      "       FIRST_VALUE(столбец2) OVER (PARTITION BY столбец1 ORDER BY дата) AS первый",
      "FROM таблица;",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-window`,
  },
  cte: {
    title: "CTE (WITH)",
    text: "WITH задаёт временную именованную выборку, к которой основной запрос обращается как к обычной таблице. Помогает разбить сложный запрос на понятные шаги.",
    syntax: [
      "WITH имя AS (",
      "  SELECT столбец, COUNT(*) AS количество FROM таблица GROUP BY столбец",
      ")",
      "SELECT * FROM имя WHERE количество > 5;",
    ].join("\n"),
    docsUrl: `${DOCS}/queries-with`,
  },
  date_literal: {
    title: "Даты в запросе",
    text: "Дату в запросе пишут в одинарных кавычках в формате 'ГГГГ-ММ-ДД'. Её можно сравнивать с датами в таблице через =, <, >.",
    syntax: "SELECT столбец FROM таблица WHERE дата = '1941-06-22';",
    docsUrl: `${DOCS}/datatype-datetime`,
  },
  between: {
    title: "BETWEEN",
    text: "Проверяет, попадает ли значение в диапазон. Обе границы включаются: BETWEEN 10 AND 20 — это от 10 до 20 включительно.",
    syntax: "SELECT столбец FROM таблица WHERE число BETWEEN 10 AND 20;",
    docsUrl: `${DOCS}/functions-comparison`,
  },
  window_frame: {
    title: "Рамка окна (ROWS BETWEEN)",
    text: "Ограничивает, какие строки видит оконная функция: N PRECEDING — N строк перед текущей, CURRENT ROW — текущая. Обычные AVG и SUM тоже можно писать с OVER.",
    syntax: [
      "SELECT дата, AVG(число) OVER (",
      "         ORDER BY дата ROWS BETWEEN 1 PRECEDING AND CURRENT ROW",
      "       ) AS среднее",
      "FROM таблица;",
    ].join("\n"),
    docsUrl: `${DOCS}/sql-expressions#SYNTAX-WINDOW-FUNCTIONS`,
  },
  running_total: {
    title: "Накопительный итог",
    text: "SUM с OVER (ORDER BY …) складывает значения от первой строки до текущей — в каждой строке получается сумма «на этот момент». Строки с одинаковым значением в ORDER BY считаются вместе.",
    syntax: "SELECT дата, SUM(число) OVER (ORDER BY дата) AS итог FROM таблица;",
    docsUrl: `${DOCS}/tutorial-window`,
  },
  self_join: {
    title: "Самосоединение",
    text: "Таблицу можно соединить саму с собой. Для этого ей дают два разных коротких имени (псевдонима) и обращаются к столбцам через них.",
    syntax: [
      "SELECT a.столбец, b.столбец",
      "FROM таблица a",
      "JOIN таблица b ON a.столбец2 = b.столбец2 AND a.ключ <> b.ключ;",
    ].join("\n"),
    docsUrl: `${DOCS}/tutorial-join`,
  },
  subquery_in: {
    title: "Подзапрос в IN",
    text: "Вместо списка значений в IN можно подставить подзапрос: строка попадёт в результат, если её значение есть среди результатов подзапроса.",
    syntax: [
      "SELECT столбец FROM таблица1",
      "WHERE ключ IN (SELECT внешний_ключ FROM таблица2 WHERE столбец = 'значение');",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-subquery#FUNCTIONS-SUBQUERY-IN`,
  },
  interval: {
    title: "INTERVAL",
    text: "INTERVAL — промежуток времени: '10 days', '1 month', '2 years'. Его можно прибавлять к дате и вычитать из неё.",
    syntax: "SELECT дата + INTERVAL '1 month' FROM таблица;",
    docsUrl: `${DOCS}/functions-datetime`,
  },
  union: {
    title: "UNION",
    text: "Объединяет результаты двух запросов в один, строки идут друг за другом. UNION убирает повторы, UNION ALL — оставляет. Количество и типы столбцов в запросах должны совпадать.",
    syntax: [
      "SELECT столбец FROM таблица1",
      "UNION ALL",
      "SELECT столбец FROM таблица2;",
    ].join("\n"),
    docsUrl: `${DOCS}/queries-union`,
  },
  rank_vs_dense: {
    title: "RANK",
    text: "RANK, в отличие от DENSE_RANK, при одинаковых значениях пропускает следующие места: 1, 1, 3 вместо 1, 1, 2.",
    syntax: [
      "SELECT столбец,",
      "       RANK() OVER (ORDER BY число DESC),",
      "       DENSE_RANK() OVER (ORDER BY число DESC)",
      "FROM таблица;",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-window`,
  },
  row_number: {
    title: "ROW_NUMBER",
    text: "Нумерует строки по порядку из ORDER BY: 1, 2, 3… Номера не повторяются, даже если значения одинаковые.",
    syntax: [
      "SELECT столбец1, столбец2,",
      "       ROW_NUMBER() OVER (PARTITION BY столбец1 ORDER BY дата) AS номер",
      "FROM таблица;",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-window`,
  },
  lag_lead: {
    title: "LAG / LEAD",
    text: "LAG берёт значение из предыдущей строки, LEAD — из следующей (по порядку из ORDER BY). У первой и последней строки соседа нет — там будет NULL.",
    syntax: [
      "SELECT дата,",
      "       LAG(дата) OVER (ORDER BY дата) AS предыдущая,",
      "       LEAD(дата) OVER (ORDER BY дата) AS следующая",
      "FROM таблица;",
    ].join("\n"),
    docsUrl: `${DOCS}/functions-window`,
  },
  percent_rank: {
    title: "PERCENT_RANK",
    text: "Показывает относительное место строки в рейтинге — число от 0 (первая) до 1 (последняя).",
    syntax: "SELECT столбец, PERCENT_RANK() OVER (ORDER BY число) FROM таблица;",
    docsUrl: `${DOCS}/functions-window`,
  },
  left_join: {
    title: "LEFT JOIN и COALESCE",
    text: "LEFT JOIN оставляет все строки левой таблицы, даже если пары в правой не нашлось — тогда её столбцы будут пустыми (NULL). COALESCE(значение, запасное) подставляет запасное значение вместо NULL.",
    syntax: [
      "SELECT таблица1.столбец, COALESCE(таблица2.столбец, 'нет')",
      "FROM таблица1",
      "LEFT JOIN таблица2 ON таблица1.ключ = таблица2.внешний_ключ;",
    ].join("\n"),
    docsUrl: `${DOCS}/queries-table-expressions#QUERIES-JOIN`,
  },
  stddev: {
    title: "STDDEV",
    text: "Стандартное отклонение — корень из дисперсии (VARIANCE): показывает разброс в тех же единицах, что и сами значения. Работает и как оконная функция с OVER.",
    syntax: "SELECT STDDEV(число) FROM таблица;",
    docsUrl: `${DOCS}/functions-aggregate#FUNCTIONS-AGGREGATE-STATISTICS-TABLE`,
  },
  generate_series: {
    title: "generate_series",
    text: "Создаёт ряд чисел (или дат) от начала до конца — как будто таблицу из одного столбца.",
    syntax: "SELECT * FROM generate_series(1, 5) AS n;",
    docsUrl: `${DOCS}/functions-srf`,
  },
  create_schema: {
    title: "CREATE SCHEMA",
    text: "Схема — это «папка» для таблиц внутри базы данных. К таблице из схемы обращаются так: схема.таблица.",
    syntax: "CREATE SCHEMA имя_схемы;",
    docsUrl: `${DOCS}/ddl-schemas`,
  },
  alter_database: {
    title: "ALTER DATABASE … SET",
    text: "Задаёт настройку по умолчанию для всех новых подключений к базе. timezone — часовой пояс, search_path — в каких схемах и в каком порядке искать таблицы, если схема не указана.",
    syntax: [
      "ALTER DATABASE имя_базы SET timezone TO 'Europe/Moscow';",
      "ALTER DATABASE имя_базы SET search_path TO схема1, схема2;",
    ].join("\n"),
    docsUrl: `${DOCS}/sql-alterdatabase`,
  },
  create_table: {
    title: "CREATE TABLE",
    text: "Создаёт таблицу. В скобках перечисляют столбцы и их типы. integer — целое число, varchar(n) — строка длиной до n символов, char(n) — строка фиксированной длины: короткие значения дополняются пробелами. PRIMARY KEY однозначно определяет строку. NOT NULL запрещает хранить NULL в столбце.",
    syntax: [
      "CREATE TABLE схема.таблица (",
      "  код char(2) PRIMARY KEY,",
      "  название varchar(100) NOT NULL,",
      "  количество integer",
      ");",
    ].join("\n"),
    docsUrl: `${DOCS}/ddl-basics`,
  },
  check: {
    title: "CHECK",
    text: "CHECK отклоняет строку, если условие даёт FALSE. Если результат условия неизвестен из-за NULL, строка проходит проверку. Чтобы запретить NULL, добавьте NOT NULL. К существующей таблице проверку добавляют через ALTER TABLE … ADD CONSTRAINT.",
    syntax: [
      "ALTER TABLE схема.таблица",
      "  ADD CONSTRAINT имя_ограничения CHECK (число BETWEEN 1 AND 10);",
    ].join("\n"),
    docsUrl: `${DOCS}/ddl-constraints#DDL-CONSTRAINTS-CHECK-CONSTRAINTS`,
  },
  foreign_key: {
    title: "FOREIGN KEY",
    text: "Внешний ключ требует, чтобы значение столбца существовало в другой таблице. ON DELETE задаёт, что делать при удалении строки, на которую ссылаются: RESTRICT — запретить, CASCADE — удалить и ссылающиеся строки.",
    syntax: [
      "ALTER TABLE схема.таблица1",
      "  ADD CONSTRAINT имя_ключа FOREIGN KEY (столбец)",
      "  REFERENCES схема.таблица2 (ключ) ON DELETE CASCADE;",
    ].join("\n"),
    docsUrl: `${DOCS}/ddl-constraints#DDL-CONSTRAINTS-FK`,
  },
  insert: {
    title: "INSERT",
    text: "Добавляет строки в таблицу: в скобках — столбцы, после VALUES — значения в том же порядке. Несколько строк перечисляют через запятую.",
    syntax: [
      "INSERT INTO схема.таблица (ключ, название)",
      "VALUES (1, 'значение1'), (2, 'значение2');",
    ].join("\n"),
    docsUrl: `${DOCS}/dml-insert`,
  },
  default: {
    title: "DEFAULT",
    text: "DEFAULT задаёт значение, которое база подставит сама, если при добавлении строки столбец не указан: current_date — сегодняшняя дата (тип date). Внешний ключ внутри CREATE TABLE пишут прямо у столбца через REFERENCES.",
    syntax: [
      "CREATE TABLE таблица1 (",
      "  ключ integer PRIMARY KEY,",
      "  столбец integer REFERENCES таблица2 (ключ),",
      "  статус varchar(20) DEFAULT 'новый'",
      ");",
    ].join("\n"),
    docsUrl: `${DOCS}/ddl-default`,
  },
  add_column: {
    title: "ADD COLUMN",
    text: "Добавляет в существующую таблицу новый столбец. В уже имеющихся строках он будет пустым (NULL).",
    syntax: "ALTER TABLE схема.таблица ADD COLUMN столбец varchar(20);",
    docsUrl: `${DOCS}/ddl-alter#DDL-ALTER-ADDING-A-COLUMN`,
  },
  index: {
    title: "CREATE INDEX",
    text: "Индекс — «указатель» по столбцу: с ним база находит нужные строки быстрее, не перебирая всю таблицу. Обычный индекс повторяющиеся значения не запрещает.",
    syntax: "CREATE INDEX имя_индекса ON схема.таблица (столбец);",
    docsUrl: `${DOCS}/indexes-intro`,
  },
  view: {
    title: "CREATE VIEW",
    text: "Представление — это сохранённый запрос, к которому обращаются как к таблице. Имена его столбцов можно задать в скобках после названия.",
    syntax: [
      "CREATE VIEW схема.имя (столбец1, количество) AS",
      "SELECT столбец1, COUNT(*) FROM таблица GROUP BY столбец1;",
    ].join("\n"),
    docsUrl: `${DOCS}/sql-createview`,
  },
  composite_pk: {
    title: "Составной первичный ключ",
    text: "Первичный ключ может состоять из нескольких столбцов: тогда уникальной должна быть их комбинация, а не каждый столбец по отдельности. Его записывают отдельной строкой: PRIMARY KEY (столбец1, столбец2).",
    syntax: [
      "CREATE TABLE таблица (",
      "  столбец1 integer,",
      "  столбец2 integer,",
      "  PRIMARY KEY (столбец1, столбец2)",
      ");",
    ].join("\n"),
    docsUrl: `${DOCS}/ddl-constraints#DDL-CONSTRAINTS-PRIMARY-KEYS`,
  },
  unique: {
    title: "UNIQUE",
    text: "UNIQUE запрещает повторяющиеся значения в столбце. Тип text — строка любой длины, timestamp — дата со временем; now() — текущий момент.",
    syntax: [
      "CREATE TABLE таблица (",
      "  ключ integer PRIMARY KEY,",
      "  код text NOT NULL UNIQUE",
      ");",
    ].join("\n"),
    docsUrl: `${DOCS}/ddl-constraints#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS`,
  },
  role: {
    title: "CREATE ROLE",
    text: "Роль — именованный набор прав. По умолчанию войти в систему под ролью нельзя — она служит группой.",
    syntax: "CREATE ROLE имя_роли;",
    docsUrl: `${DOCS}/sql-createrole`,
  },
  grant: {
    title: "GRANT",
    text: "Выдаёт права роли. Чтобы работать с таблицами схемы, сначала нужно право USAGE на саму схему, затем права на таблицы; ALL PRIVILEGES — все права сразу.",
    syntax: [
      "GRANT USAGE ON SCHEMA схема TO роль;",
      "GRANT SELECT ON схема.таблица TO роль;",
    ].join("\n"),
    docsUrl: `${DOCS}/sql-grant`,
  },
  privileges: {
    title: "Виды прав на таблицу",
    text: "SELECT — читать строки, INSERT — добавлять, UPDATE — изменять, DELETE — удалять. В одном GRANT права можно перечислить через запятую.",
    syntax: "GRANT SELECT, INSERT ON схема.таблица TO роль;",
    docsUrl: `${DOCS}/ddl-priv`,
  },
  revoke_columns: {
    title: "REVOKE и права на столбцы",
    text: "REVOKE отбирает права (FROM роль); ALL работает как в GRANT. Право можно выдать и только на отдельные столбцы — их перечисляют в скобках после названия права.",
    syntax: [
      "REVOKE INSERT ON схема.таблица FROM роль;",
      "GRANT UPDATE (столбец1, столбец2) ON схема.таблица TO роль;",
    ].join("\n"),
    docsUrl: `${DOCS}/sql-revoke`,
  },
  rls: {
    title: "Защита строк (RLS) и политики",
    text: "Защита строк позволяет показывать роли не всю таблицу, а только подходящие строки. Сначала её включают на таблице, затем создают политику: для какого действия, какой роли и с каким условием в USING.",
    syntax: [
      "ALTER TABLE схема.таблица ENABLE ROW LEVEL SECURITY;",
      "CREATE POLICY имя_политики ON схема.таблица",
      "  FOR UPDATE TO роль USING (столбец > 10);",
    ].join("\n"),
    docsUrl: `${DOCS}/ddl-rowsecurity`,
  },
  login_member: {
    title: "LOGIN и членство в роли",
    text: "LOGIN разрешает входить под ролью — получается учётная запись. GRANT роль_группа TO имя включает её в группу: она получает все права группы.",
    syntax: [
      "CREATE ROLE имя LOGIN;",
      "GRANT роль_группа TO имя;",
    ].join("\n"),
    docsUrl: `${DOCS}/role-membership`,
  },
  public_role: {
    title: "PUBLIC",
    text: "PUBLIC — это «все роли сразу», включая будущие. Права, отобранные у PUBLIC, не затрагивают права, выданные конкретным ролям отдельно.",
    syntax: "REVOKE SELECT ON схема.таблица FROM PUBLIC;",
    docsUrl: `${DOCS}/sql-grant`,
  },
  default_privileges: {
    title: "ALTER DEFAULT PRIVILEGES",
    text: "Обычный GRANT действует только на уже существующие таблицы. ALTER DEFAULT PRIVILEGES задаёт права заранее — для таблиц, которые будут созданы потом той же ролью, что выполнила команду.",
    syntax: [
      "ALTER DEFAULT PRIVILEGES IN SCHEMA схема",
      "  GRANT INSERT ON TABLES TO роль;",
    ].join("\n"),
    docsUrl: `${DOCS}/sql-alterdefaultprivileges`,
  },
  grant_option: {
    title: "WITH GRANT OPTION",
    text: "Если выдать право с WITH GRANT OPTION, роль сможет сама передавать это право другим ролям.",
    syntax: "GRANT UPDATE ON схема.таблица TO роль WITH GRANT OPTION;",
    docsUrl: `${DOCS}/sql-grant`,
  },
  force_rls: {
    title: "FORCE ROW LEVEL SECURITY",
    text: "Обычно политики защиты строк не действуют на владельца таблицы. FORCE заставляет их работать и для владельца тоже.",
    syntax: "ALTER TABLE схема.таблица FORCE ROW LEVEL SECURITY;",
    docsUrl: `${DOCS}/ddl-rowsecurity`,
  },
  function: {
    title: "Функция на PL/pgSQL",
    text: "Функция принимает параметры и возвращает одно значение (RETURNS тип); OR REPLACE — заменить, если такая уже есть. Тело на языке plpgsql пишут между $$ и $$: в DECLARE — переменные, между BEGIN и END — команды. SELECT … INTO кладёт результат в переменную, RETURN возвращает ответ.",
    syntax: [
      "CREATE OR REPLACE FUNCTION имя(p_параметр INT) RETURNS INT AS $$",
      "DECLARE",
      "  v_результат INT;",
      "BEGIN",
      "  SELECT COUNT(*) INTO v_результат FROM таблица WHERE столбец = p_параметр;",
      "  RETURN v_результат;",
      "END;",
      "$$ LANGUAGE plpgsql;",
    ].join("\n"),
    docsUrl: `${DOCS}/plpgsql-structure`,
  },
  table_function: {
    title: "Табличная функция",
    text: "Возвращает целую таблицу: после RETURNS TABLE перечисляют её столбцы, а RETURN QUERY отдаёт результат запроса. Если эти имена совпадают со столбцами таблицы, в запросе пишите столбцы через псевдоним (t.столбец) — иначе будет ошибка неоднозначности.",
    syntax: [
      "CREATE OR REPLACE FUNCTION имя(p_параметр VARCHAR)",
      "RETURNS TABLE (столбец1 VARCHAR, столбец2 INT) AS $$",
      "BEGIN",
      "  RETURN QUERY SELECT t.столбец1, t.столбец2 FROM таблица t WHERE t.столбец3 = p_параметр;",
      "END;",
      "$$ LANGUAGE plpgsql;",
    ].join("\n"),
    docsUrl: `${DOCS}/plpgsql-control-structures#PLPGSQL-STATEMENTS-RETURNING`,
  },
  procedure: {
    title: "Процедура",
    text: "Процедура не возвращает значение через RETURN — она выполняет действия с данными и запускается через CALL. UPDATE … SET изменяет уже существующие строки.",
    syntax: [
      "CREATE OR REPLACE PROCEDURE имя(p_параметр INT) AS $$",
      "BEGIN",
      "  UPDATE таблица SET столбец = 'значение' WHERE ключ = p_параметр;",
      "  INSERT INTO таблица (столбец1, столбец2) VALUES (p_параметр, 'значение');",
      "END;",
      "$$ LANGUAGE plpgsql;",
      "",
      "CALL имя(1);",
    ].join("\n"),
    docsUrl: `${DOCS}/sql-createprocedure`,
  },
  trigger: {
    title: "Триггер",
    text: "Триггер сам запускает функцию при изменении таблицы. Триггерная функция возвращает TRIGGER, новая строка доступна в ней как NEW, а заканчивают её RETURN NEW. CREATE TRIGGER привязывает функцию к таблице: BEFORE или AFTER, на какое действие, FOR EACH ROW — для каждой строки.",
    syntax: [
      "CREATE OR REPLACE FUNCTION имя_функции() RETURNS TRIGGER AS $$",
      "BEGIN",
      "  UPDATE таблица2 SET столбец = 'значение' WHERE ключ = NEW.ключ;",
      "  RETURN NEW;",
      "END;",
      "$$ LANGUAGE plpgsql;",
      "",
      "CREATE TRIGGER имя_триггера AFTER UPDATE ON таблица1",
      "FOR EACH ROW EXECUTE FUNCTION имя_функции();",
    ].join("\n"),
    docsUrl: `${DOCS}/plpgsql-trigger`,
  },
  raise_exception: {
    title: "IF и RAISE EXCEPTION",
    text: "IF … THEN … END IF выполняет команды только при условии. RAISE EXCEPTION прерывает операцию с сообщением об ошибке — в BEFORE-триггере так не дают сохранить неправильную строку.",
    syntax: [
      "IF NEW.число < 0 THEN",
      "  RAISE EXCEPTION 'Текст ошибки';",
      "END IF;",
      "RETURN NEW;",
    ].join("\n"),
    docsUrl: `${DOCS}/plpgsql-errors-and-messages`,
  },
} as const satisfies Record<string, TheoryTerm>;

export type TheoryTermKey = keyof typeof theoryTerms;
