import { SeedTopic } from "../../../types";
import t21 from "./topic-2-1";
import t22 from "./topic-2-2";

export const NIS_BOOK_2 = {
  slug: "nis-2",
  title: "Естествознание 2. Вещества и материалы (физика и химия)",
  level: 2,
  order: 2,
  topics: [t21, t22] as SeedTopic[],
};
