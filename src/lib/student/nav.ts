/** Предметы раздела «Подготовка в НИШ» (страница /nis). Сами предметы открываются по тем же маршрутам /bil/<slug>. */
export const NIS_SUBJECTS = ["nis-science", "nis-english"];

/** «5 класс» и «Подготовка в НИШ» — отдельные разделы главного экрана, не часть «Подготовки в БИЛ»: в /bil их предметов нет. */
export const STANDALONE_SUBJECTS = ["grade5", ...NIS_SUBJECTS];

export const bilCrumb = (slug: string, t: (s: string) => string): { label: string; href: string }[] =>
  NIS_SUBJECTS.includes(slug)
    ? [{ label: t("Подготовка в НИШ"), href: "/nis" }]
    : STANDALONE_SUBJECTS.includes(slug) ? [] : [{ label: t("Подготовка в БИЛ"), href: "/bil" }];
