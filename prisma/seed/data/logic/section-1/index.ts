import { SeedTopic } from "../../../types";
import t1 from "./topic-1";
import t2 from "./topic-2";
import t3 from "./topic-3";
import t4 from "./topic-4";
import t5 from "./topic-5";
import t6 from "./topic-6";

export const LOGIC_SECTION_1 = {
  slug: "logic-1",
  title: "Числа, буквы и таблицы",
  order: 1,
  topics: [t1, t2, t3, t4, t5, t6] as SeedTopic[],
};
