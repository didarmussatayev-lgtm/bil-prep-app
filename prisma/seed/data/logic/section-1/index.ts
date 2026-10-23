import { SeedTopic } from "../../../types";
import t1 from "./v2/topic-1";
import t2 from "./v2/topic-2";
import t3 from "./v2/topic-3";
import t4 from "./v2/topic-4";
import t5 from "./v2/topic-5";
import t6 from "./v2/topic-6";

export const LOGIC_SECTION_1 = {
  slug: "logic-1",
  title: "Числа, буквы и таблицы",
  order: 1,
  topics: [t1, t2, t3, t4, t5, t6] as SeedTopic[],
};
