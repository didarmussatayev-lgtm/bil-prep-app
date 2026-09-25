import { SeedTopic } from "../../../types";
import t11 from "./topic-1-1";
import t12 from "./topic-1-2";
import t13 from "./topic-1-3";

export const SECTION_1 = {
  slug: "math-1",
  title: "I раздел",
  order: 1,
  topics: [t11, t12, t13] as SeedTopic[],
};
