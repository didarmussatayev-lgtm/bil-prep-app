# Формат контента (для рендерера — пункты 5–6)

## Разметка дробей в тексте (`question`, `options`, `solutionText`, `explanationContent`)
- `{a/b}` — дробь. Разбирается по **последнему** `/` внутри скобок, поэтому в числителе и знаменателе могут быть выражения:
  `{2+3/7}`, `{17·28 + 11·35 + 12·20/140}`, `{Δ/21}`.
- `{w a/b}` — смешанное число (целая часть, пробел, дробь): `{3 2/27}`. Определяется регуляркой `^\d+ \d+/\d+$`.
- Всё вне `{…}` — обычный текст. Сырого LaTeX нет; KaTeX подключается позже для сложных формул.

## Explanation (Markdown)
`###` — заголовки примеров, `**Решение:**` — жирный. Рисунок — отдельная строка `:::figure {json}` (Figure ниже).

## Figure (`Task.imageParamsJson = { figures: Figure[] }`)
| kind | поля |
|---|---|
| `fraction_bar` | `parts`, `shaded: number[]` (индексы, с 0), `caption?` |
| `circle` | `parts`, `shaded: number[]`, `caption?` |
| `grid` | `rows`, `cols`, `shaded: [row, col][]` |
| `number_line` | `from`, `to`, `divisions` (частей на единичный отрезок), `marks: {at: число | [num, denom], label?}[]` |
| `table` | `rows: string[][]` |
| `placeholder` | `description` — рисунок ещё не сделан; **UI ученика скрывает такие задачи** |

## Ответы
| answerType | correctAnswerJson |
|---|---|
| integer | `{value}` |
| decimal | `{value}` |
| fraction | `{num, denom}` |
| mixed | `{whole, num, denom}` |

Правила выбора типа в контенте: результат — целое → `integer`; правильная дробь → `fraction`; неправильная дробь, не являющаяся целым → `mixed`.
Проверка на сервере сравнивает как рациональные числа; по умолчанию несокращённая форма не засчитывается
(`allowUnreduced: true` в `correctAnswerJson` это разрешает).

Выбор из вариантов: `type = test_choice`, `options[]` (позиция = буква A–E), `correctOption`.
Сравнение «□» оформлено как `test_choice` с вариантами `<`, `>`, `=`.

## purpose
`practice` — «Закрепить тему»; `test` — вопросы теста главы (связаны через `Test`/`TestQuestion`).
