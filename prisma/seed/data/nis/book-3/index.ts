import { SeedTopic } from "../../../types";
import t31 from "./topic-3-1";
import t32 from "./topic-3-2";
import t33 from "./topic-3-3";

export const NIS_BOOK_3 = {
  slug: "nis-3",
  title: "Естествознание 3. Живые организмы (биология)",
  level: 3,
  order: 3,
  topics: [t31, t32, t33] as SeedTopic[],
};
