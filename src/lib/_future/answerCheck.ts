/**
 * Логика автопроверки ответов для задач типа OPEN_ANSWER.
 * Сравнение выполняется на сервере (в API-роуте), чтобы эталонный
 * ответ не был виден в клиентском коде.
 *
 * Поддерживаемые типы (см. enum AnswerType в prisma/schema.prisma):
 *  - INTEGER:       {value: number}
 *  - DECIMAL:       {value: number}
 *  - FRACTION:      {num: number, denom: number}
 *  - MIXED_NUMBER:  {whole: number, num: number, denom: number}
 *  - TEXT:          не проверяется автоматически
 */

export type AnswerType = "INTEGER" | "DECIMAL" | "FRACTION" | "MIXED_NUMBER" | "TEXT";

export interface IntegerAnswer {
  value: number;
}

export interface DecimalAnswer {
  value: number;
}

export interface FractionAnswer {
  num: number;
  denom: number;
}

export interface MixedNumberAnswer {
  whole: number;
  num: number;
  denom: number;
}

export type AnswerValue = IntegerAnswer | DecimalAnswer | FractionAnswer | MixedNumberAnswer;

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

/** Приводит дробь/смешанное число к паре [числитель, знаменатель] неправильной дроби */
function toImproperFraction(
  answerType: AnswerType,
  value: AnswerValue
): { num: number; denom: number } {
  switch (answerType) {
    case "FRACTION": {
      const v = value as FractionAnswer;
      return { num: v.num, denom: v.denom };
    }
    case "MIXED_NUMBER": {
      const v = value as MixedNumberAnswer;
      const sign = v.whole < 0 || v.num < 0 ? -1 : 1;
      const num = sign * (Math.abs(v.whole) * v.denom + Math.abs(v.num));
      return { num, denom: v.denom };
    }
    case "INTEGER": {
      const v = value as IntegerAnswer;
      return { num: v.value, denom: 1 };
    }
    case "DECIMAL": {
      // Переводим десятичную дробь в обыкновенную с точностью до 6 знаков,
      // чтобы можно было единообразно сравнивать как рациональные числа.
      const v = value as DecimalAnswer;
      const denom = 1_000_000;
      return { num: Math.round(v.value * denom), denom };
    }
    default:
      throw new Error(`Тип ответа ${answerType} нельзя привести к дроби`);
  }
}

/**
 * Сравнивает два ответа (студенческий и эталонный) как рациональные числа,
 * независимо от того, в каком виде каждый из них записан
 * (7/6 === 1 1/6 === 1,1666...(с допуском)).
 *
 * allowUnreduced: если false, требуется, чтобы дробь была подана в
 * несократимом виде (например, 2/4 не засчитается вместо 1/2).
 */
export function checkAnswer(params: {
  studentType: AnswerType;
  studentValue: AnswerValue;
  correctType: AnswerType;
  correctValue: AnswerValue;
  allowUnreduced?: boolean;
}): boolean {
  const { studentType, studentValue, correctType, correctValue, allowUnreduced = true } = params;

  // Текстовые ответы не проверяются автоматически
  if (correctType === "TEXT") return false;

  const student = toImproperFraction(studentType, studentValue);
  const correct = toImproperFraction(correctType, correctValue);

  if (student.denom === 0) return false;

  // Если требуется точная (сокращённая) форма и студент ввёл дробь/смешанное число —
  // проверяем, что его дробь уже сокращена.
  if (
    !allowUnreduced &&
    (studentType === "FRACTION" || studentType === "MIXED_NUMBER") &&
    gcd(student.num, student.denom) !== 1
  ) {
    return false;
  }

  // Сравнение как рациональных чисел: a/b === c/d  <=>  a*d === c*b
  // Для DECIMAL используем допуск на погрешность округления.
  if (studentType === "DECIMAL" || correctType === "DECIMAL") {
    const studentDecimal = student.num / student.denom;
    const correctDecimal = correct.num / correct.denom;
    return Math.abs(studentDecimal - correctDecimal) < 1e-4;
  }

  return student.num * correct.denom === correct.num * student.denom;
}
