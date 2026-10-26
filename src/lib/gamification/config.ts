// Конфигурация геймификации. Без server-only: используется и на сервере, и в клиентских компонентах.
import type { Lang } from "@/lib/i18n/config";

export const TZ = "Asia/Almaty";
/** Дневная цель в «очках»: задача закрепления = 1, изученная тема = 5, завершённый тест = 5. */
export const DAILY_GOAL = 5;
export const POINTS = { task: 1, topic: 5, test: 5 } as const;

/** XP начисляется один раз за задачу / тему / попытку теста (см. XpEvent). */
export const XP = {
  task: 10, // первое верное решение задачи
  fix: 15, // сам решил задачу, отмеченную «не смог решить» (сверх обычных 10)
  topic: 30, // тема изучена
  testPerCorrect: 2, // за каждый верный ответ теста
  test80: 30, // бонус за тест от 80%
  test90: 50, // вместо test80 при 90%+
  achievement: 50,
} as const;

/** Для уровня L нужно 50·(L−1)·L XP: 100, 300, 600, 1000, 1500… */
export const xpForLevel = (level: number) => 50 * (level - 1) * level;
export function levelFromXp(xp: number) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level += 1;
  const from = xpForLevel(level), to = xpForLevel(level + 1);
  return { level, from, to, into: xp - from, need: to - from };
}

const TITLES: [number, { ru: string; kk: string }][] = [
  [18, { ru: "Легенда", kk: "Аңыз" }],
  [12, { ru: "Эксперт", kk: "Сарапшы" }],
  [8, { ru: "Мастер", kk: "Шебер" }],
  [5, { ru: "Знаток", kk: "Білгір" }],
  [3, { ru: "Исследователь", kk: "Зерттеуші" }],
  [1, { ru: "Новичок", kk: "Жаңадан бастаушы" }],
];
export const levelTitle = (level: number, lang: Lang) => (TITLES.find(([min]) => level >= min) ?? TITLES[TITLES.length - 1])[1][lang];

export type AchDef = {
  key: string; icon: string; ru: string; kk: string; descRu: string; descKk: string;
  notify?: boolean; // сообщать учителю в Telegram
};

export const ACHIEVEMENTS: AchDef[] = [
  { key: "first_topic", icon: "🌱", ru: "Первый шаг", kk: "Алғашқы қадам", descRu: "Изучить первую тему", descKk: "Алғашқы тақырыпты оқу" },
  { key: "topics_10", icon: "📚", ru: "Десять тем", kk: "Он тақырып", descRu: "Изучить 10 тем", descKk: "10 тақырыпты оқу" },
  { key: "topics_50", icon: "🏛️", ru: "Пятьдесят тем", kk: "Елу тақырып", descRu: "Изучить 50 тем", descKk: "50 тақырыпты оқу", notify: true },
  { key: "tasks_10", icon: "✏️", ru: "Десять задач", kk: "Он есеп", descRu: "Верно решить 10 задач", descKk: "10 есепті дұрыс шығару" },
  { key: "tasks_100", icon: "💪", ru: "Сотня задач", kk: "Жүз есеп", descRu: "Верно решить 100 задач", descKk: "100 есепті дұрыс шығару" },
  { key: "tasks_500", icon: "🚀", ru: "Пятьсот задач", kk: "Бес жүз есеп", descRu: "Верно решить 500 задач", descKk: "500 есепті дұрыс шығару", notify: true },
  { key: "streak_3", icon: "🔥", ru: "Серия 3 дня", kk: "3 күн қатарынан", descRu: "Заниматься 3 дня подряд", descKk: "3 күн қатарынан оқу" },
  { key: "streak_7", icon: "🔥", ru: "Неделя подряд", kk: "Бір апта қатарынан", descRu: "Заниматься 7 дней подряд", descKk: "7 күн қатарынан оқу", notify: true },
  { key: "streak_30", icon: "🌋", ru: "Месяц подряд", kk: "Бір ай қатарынан", descRu: "Заниматься 30 дней подряд", descKk: "30 күн қатарынан оқу", notify: true },
  { key: "test_first", icon: "📝", ru: "Первый тест", kk: "Алғашқы тест", descRu: "Пройти первый тест", descKk: "Алғашқы тестті тапсыру" },
  { key: "test_80", icon: "🎯", ru: "Точно в цель", kk: "Дәл нысанаға", descRu: "Набрать 80% и больше в тесте", descKk: "Тестте 80% және одан көп жинау" },
  { key: "test_90", icon: "🏆", ru: "Отличный результат", kk: "Тамаша нәтиже", descRu: "Набрать 90% и больше в тесте", descKk: "Тестте 90% және одан көп жинау", notify: true },
  { key: "test_perfect", icon: "💎", ru: "Без единой ошибки", kk: "Бірде-бір қатесіз", descRu: "Пройти тест на 100%", descKk: "Тестті 100% тапсыру", notify: true },
  { key: "fix_mistake", icon: "🛠️", ru: "Работа над ошибками", kk: "Қатемен жұмыс", descRu: "Самому решить задачу, которую раньше отметил «не смог»", descKk: "Бұрын «шеше алмадым» деп белгілеген есепті өзі шығару" },
  { key: "comeback", icon: "🔄", ru: "С возвращением!", kk: "Қайта оралуыңмен!", descRu: "Вернуться к занятиям после перерыва в неделю и больше", descKk: "Бір апта және одан ұзақ үзілістен кейін оқуға оралу" },
];
// Динамические: book_done:<subjectId>:<level> («Книга пройдена»), lvl:<N> («Новый уровень»)
export const BOOK_DONE = "book_done:";
export const LEVEL_UP = "lvl:";
export const NOTIFY_LEVELS = (n: number) => n % 5 === 0;
