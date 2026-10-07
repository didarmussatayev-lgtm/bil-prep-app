import { SeedTopic } from "../../../types";
import t11 from "./topic-1-1";
import t12 from "./topic-1-2";

export const M3_SECTION_1 = {
  slug: "math3-1",
  title: "Математика 3. Раздел 1",
  level: 3,
  order: 1,
  topics: [t11, t12] as SeedTopic[],
};
