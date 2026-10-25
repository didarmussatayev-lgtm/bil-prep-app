import { SeedTopic } from "../../../types";
import t21 from "./v2/topic-2-1";
import t22 from "./v2/topic-2-2";
import t23 from "./v2/topic-2-3";
import t24 from "./v2/topic-2-4";
import t25 from "./v2/topic-2-5";
import t26 from "./v2/topic-2-6";

export const SECTION_2 = {
  slug: "math-2",
  title: "Математика 1. II раздел. Степень, делимость, НОД и НОК",
  level: 1,
  order: 2,
  topics: [t21, t22, t23, t24, t25, t26] as SeedTopic[],
};
