import { SeedTopic } from "../../../types";
import t11 from "./topic-1-1";
import t12 from "./topic-1-2";
import t13 from "./topic-1-3";
import t14 from "./topic-1-4";
import t15 from "./topic-1-5";

export const NIS_BOOK_1 = {
  slug: "nis-1",
  title: "Естествознание 1. Земля и космос (география)",
  level: 1,
  order: 1,
  topics: [t11, t12, t13, t14, t15] as SeedTopic[],
};
