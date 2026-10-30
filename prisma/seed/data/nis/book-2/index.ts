import { SeedTopic } from "../../../types";
import t21 from "./topic-2-1";
import t22 from "./topic-2-2";
import t23 from "./topic-2-3";
import t24 from "./topic-2-4";

export const NIS_BOOK_2 = {
  slug: "nis-2",
  title: "Естествознание 2. Вещества и материалы (физика и химия)",
  level: 2,
  order: 2,
  topics: [t21, t22, t23, t24] as SeedTopic[],
};
