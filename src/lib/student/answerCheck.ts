import "server-only";

/**
 * Сравнение ответа ученика с эталоном как рациональных чисел (а не строкой) —
 * портировано из src/lib/_future/answerCheck.ts под реальные типы схемы
 * (Task.answerType: "integer"|"decimal"|"fraction"|"mixed", см. prisma/schema.prisma
 * и content-schemas.ts). Выполняется только на сервере — эталон сюда приходит
 * из БД, на клиент эта функция не попадает.
 */

export type AnswerType = "integer" | "decimal" | "fraction" | "mixed";

export type AnswerValue =
  | { value: number } // integer | decimal
  | { num: number; denom: number } // fraction
  | { whole: number; num: number; denom: number }; // mixed

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Приводит любой из четырёх видов ответа к паре [числитель, знаменатель] неправильной дроби. */
function toImproperFraction(type: AnswerType, value: AnswerValue): { num: number; denom: number } {
  switch (type) {
    case "fraction": {
      const v = value as { num: number; denom: number };
      return { num: v.num, denom: v.denom };
    }
    case "mixed": {
      const v = value as { whole: number; num: number; denom: number };
      const sign = v.whole < 0 || v.num < 0 ? -1 : 1;
      return { num: sign * (Math.abs(v.whole) * v.denom + Math.abs(v.num)), denom: v.denom };
    }
    case "integer": {
      const v = value as { value: number };
      return { num: v.value, denom: 1 };
    }
    case "decimal": {
      // Переводим в обыкновенную дробь с фиксированной точностью, чтобы сравнивать единообразно.
      const v = value as { value: number };
      const denom = 1_000_000;
      return { num: Math.round(v.value * denom), denom };
    }
  }
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

/** Проверяет, что JSON пришедшего ответа имеет форму, ожидаемую для этого типа (без этого — просто неверный формат, не 500). */
export function isWellFormedAnswer(type: AnswerType, value: unknown): value is AnswerValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  if (type === "integer" || type === "decimal") return isFiniteNumber(v.value);
  if (type === "fraction") return isFiniteNumber(v.num) && isFiniteNumber(v.denom) && v.denom !== 0;
  if (type === "mixed") return isFiniteNumber(v.whole) && isFiniteNumber(v.num) && isFiniteNumber(v.denom) && v.denom !== 0;
  return false;
}

/**
 * true/false — совпадает ли ответ ученика с эталоном (оба приведены к рациональным числам).
 * allowUnreduced: если false, дробь/смешанное число от ученика должны быть уже сокращены
 * (2/4 не засчитается вместо 1/2).
 */
export function checkAnswer(params: {
  answerType: AnswerType;
  studentValue: AnswerValue;
  correctValue: AnswerValue;
  allowUnreduced: boolean;
}): boolean {
  const { answerType, studentValue, correctValue, allowUnreduced } = params;
  const student = toImproperFraction(answerType, studentValue);
  const correct = toImproperFraction(answerType, correctValue);
  if (student.denom === 0) return false;

  if (!allowUnreduced && (answerType === "fraction" || answerType === "mixed") && gcd(student.num, student.denom) !== 1) {
    return false;
  }

  if (answerType === "decimal") {
    return Math.abs(student.num / student.denom - correct.num / correct.denom) < 1e-4;
  }
  // Сравнение как рациональных чисел: a/b === c/d  <=>  a*d === c*b — без потери точности на плавающей точке.
  return student.num * correct.denom === correct.num * student.denom;
}

/** Человекочитаемая форма эталона — для показа после «Показать решение». */
export function formatAnswer(type: AnswerType, value: AnswerValue): string {
  switch (type) {
    case "integer":
      return String((value as { value: number }).value);
    case "decimal":
      return String((value as { value: number }).value).replace(".", ",");
    case "fraction": {
      const v = value as { num: number; denom: number };
      return `${v.num}/${v.denom}`;
    }
    case "mixed": {
      const v = value as { whole: number; num: number; denom: number };
      return `${v.whole} ${v.num}/${v.denom}`;
    }
  }
}
