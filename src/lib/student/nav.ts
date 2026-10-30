/** «5 класс» — отдельный раздел главного экрана, не часть «Подготовки в БИЛ»: ему крошку «Подготовка в БИЛ» не показываем. */
export const STANDALONE_SUBJECTS = ["grade5"];

export const bilCrumb = (slug: string, t: (s: string) => string): { label: string; href: string }[] =>
  STANDALONE_SUBJECTS.includes(slug) ? [] : [{ label: t("Подготовка в БИЛ"), href: "/bil" }];
