import { SeedTopic } from "../../../types";
import t1 from "./topic-1";
import t2 from "./topic-2";
import t3 from "./topic-3";

export const LOGIC_SECTION_1 = {
  slug: "logic-1",
  title: "Числа, буквы и таблицы",
  order: 1,
  topics: [t1, t2, t3] as SeedTopic[],
};
