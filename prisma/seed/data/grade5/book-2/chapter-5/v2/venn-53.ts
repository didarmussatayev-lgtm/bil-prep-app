import type { Figure } from "../../../../../types";

/**
 * Помощники для диаграмм Эйлера–Венна темы 5.3 (рисуются через kind:"scene").
 * Элементы — короткие строки (числа, буквы, имена); всё, что в рисунке подписано, — не русский текст,
 * поэтому те же рисунки годятся и для казахского перевода.
 */
type It = Record<string, unknown>;

const BLUE = "#9ec9f5";
const YELLOW = "#ffe27a";
const GREEN = "#b6e3a8";
const PINK = "#f6b3c4";

const text = (x: number, y: number, s: string, extra: It = {}): It => ({ t: "text", x, y, s, anchor: "middle", ...extra });

/** Раскладывает элементы колонкой (или двумя колонками) вокруг точки (cx, cy). */
function place(items: string[], cx: number, cy: number, dx: number): It[] {
  const n = items.length;
  if (n === 0) return [];
  const out: It[] = [];
  const two = n > 4;
  const rows = two ? Math.ceil(n / 2) : n;
  const step = 0.95;
  items.forEach((s, i) => {
    const col = two ? i % 2 : 0;
    const row = two ? Math.floor(i / 2) : i;
    const x = two ? cx + (col === 0 ? -dx : dx) : cx;
    const y = cy + (row - (rows - 1) / 2) * step + 0.2;
    out.push(text(x, y, s));
  });
  return out;
}

export type Venn2 = {
  /** только в A */ a: string[];
  /** в A и в B */ ab: string[];
  /** только в B */ b: string[];
  /** вне A и B (внутри универсума) */ out?: string[];
  names?: [string, string];
  /** какую область закрасить */ shade?: "A" | "B" | "AB" | "A-B" | "B-A" | "AuB";
  /** множества не пересекаются (рисуются отдельно) */ disjoint?: boolean;
  scale?: number;
};

export function venn2(o: Venn2): Figure {
  const r = 3.2;
  const [nA, nB] = o.names ?? ["A", "B"];
  const hasOut = !!(o.out && o.out.length);
  const yc = 3.8;
  const ax = 3.5;
  const bx = o.disjoint ? 3.5 + 7.6 : 7.1;
  const d = bx - ax;
  const xm = (ax + bx) / 2;
  const h = o.disjoint ? 0 : Math.sqrt(r * r - (d / 2) * (d / 2));
  const T: [number, number] = [xm, yc - h];
  const Bt: [number, number] = [xm, yc + h];
  const items: It[] = [];
  const W = o.disjoint ? bx + r + 0.3 : bx + r + (hasOut ? 3.4 : 0.3);
  const H = 2 * yc + 0.1;
  if (hasOut) items.push({ t: "rect", x: 0, y: -0.75, w: W, h: 8.25, fill: null });
  const f = (a: number, b: number, c: number, e: number) => `${a} ${b} ${c} ${e}`;
  void f;
  const shade = (fill: string, d2: string) => items.push({ t: "path", d: d2, fill, color: fill, w: 0.1 });
  if (o.shade && !o.disjoint) {
    const rr = r;
    const A_only = `M ${T[0]} ${T[1]} A ${rr} ${rr} 0 1 0 ${Bt[0]} ${Bt[1]} A ${rr} ${rr} 0 0 1 ${T[0]} ${T[1]} Z`;
    const B_only = `M ${T[0]} ${T[1]} A ${rr} ${rr} 0 1 1 ${Bt[0]} ${Bt[1]} A ${rr} ${rr} 0 0 0 ${T[0]} ${T[1]} Z`;
    const lens = `M ${T[0]} ${T[1]} A ${rr} ${rr} 0 0 1 ${Bt[0]} ${Bt[1]} A ${rr} ${rr} 0 0 1 ${T[0]} ${T[1]} Z`;
    if (o.shade === "A-B") shade(YELLOW, A_only);
    if (o.shade === "B-A") shade(YELLOW, B_only);
    if (o.shade === "AB") shade(YELLOW, lens);
    if (o.shade === "A") { shade(YELLOW, A_only); shade(YELLOW, lens); }
    if (o.shade === "B") { shade(YELLOW, B_only); shade(YELLOW, lens); }
    if (o.shade === "AuB") { shade(YELLOW, A_only); shade(YELLOW, B_only); shade(YELLOW, lens); }
  } else if (o.shade && o.disjoint) {
    if (o.shade === "A" || o.shade === "AuB") items.push({ t: "circle", cx: ax, cy: yc, r, fill: YELLOW });
    if (o.shade === "B" || o.shade === "AuB") items.push({ t: "circle", cx: bx, cy: yc, r, fill: YELLOW });
  }
  items.push({ t: "circle", cx: ax, cy: yc, r, fill: null });
  items.push({ t: "circle", cx: bx, cy: yc, r, fill: null });
  items.push(text(ax - 1.9, 0.05, nA, { size: 16 }));
  items.push(text(bx + 1.9, 0.05, nB, { size: 16 }));
  if (o.disjoint) {
    items.push(...place(o.a, ax, yc, 1.0), ...place(o.b, bx, yc, 1.0));
  } else {
    items.push(...place(o.a, ax - 1.5, yc, 0.9), ...place(o.ab, xm, yc, 0.65), ...place(o.b, bx + 1.5, yc, 0.9));
  }
  if (hasOut) items.push(...place(o.out!, bx + r + 1.5, yc, 0.55));
  return { kind: "scene", width: W, height: H, items, scale: o.scale ?? 26 };
}

/** Одно множество (овал-круг) с элементами; при out — внутри прямоугольника-универсума. */
export function venn1(o: { name?: string; items: string[]; out?: string[]; scale?: number }): Figure {
  const r = 3.2, yc = 3.8, cx = 3.5;
  const hasOut = !!(o.out && o.out.length);
  const W = hasOut ? cx + r + 3.4 : 2 * cx;
  const items: It[] = [];
  if (hasOut) items.push({ t: "rect", x: 0, y: -0.75, w: W, h: 8.25, fill: null });
  items.push({ t: "circle", cx, cy: yc, r, fill: BLUE });
  items.push(text(cx - 2.2, 0.15, o.name ?? "A", { size: 16 }));
  items.push(...place(o.items, cx, yc, 1.1));
  if (hasOut) items.push(...place(o.out!, cx + r + 1.5, yc, 0.55));
  return { kind: "scene", width: W, height: 2 * yc + 0.1, items, scale: o.scale ?? 26 };
}

/** Вложенные множества: B внутри A. aOnly — элементы только из A, bIn — элементы из B. */
export function vennNested(o: { names?: [string, string]; aOnly: string[]; bIn: string[]; scale?: number }): Figure {
  const [nA, nB] = o.names ?? ["A", "B"];
  const yc = 3.8;
  const items: It[] = [
    { t: "circle", cx: 4.2, cy: yc, r: 3.6, fill: BLUE },
    { t: "circle", cx: 5.4, cy: yc, r: 2.0, fill: YELLOW },
    text(1.0, 0.7, nA, { size: 16 }),
    text(5.4, yc - 2.35, nB, { size: 16 }),
    ...place(o.aOnly, 2.6, yc, 0.55),
    ...place(o.bIn, 5.4, yc, 0.7),
  ];
  return { kind: "scene", width: 8.4, height: 2 * yc + 0.1, items, scale: o.scale ?? 26 };
}

/** Три непересекающихся множества рядом. */
export function vennRow(sets: { name: string; items: string[] }[], scale = 22): Figure {
  const r = 2.6;
  const items: It[] = [];
  sets.forEach((s, i) => {
    const cx = r + i * (2 * r + 0.8);
    items.push({ t: "circle", cx, cy: 3.2, r, fill: [BLUE, GREEN, PINK, YELLOW][i % 4] });
    items.push(text(cx, 0.1, s.name, { size: 16 }));
    items.push(...place(s.items, cx, 3.2, 0.9));
  });
  return { kind: "scene", width: sets.length * (2 * r + 0.8) - 0.8, height: 6.5, items, scale };
}

/** Круг K, вложенный в M, и частично пересекающийся с M круг N (для задач про K ⊂ M). */
export function vennThree(o: { kIn: string[]; mOnly: string[]; mn: string[]; nOnly: string[]; scale?: number }): Figure {
  const yc = 3.8;
  const items: It[] = [
    { t: "circle", cx: 3.7, cy: yc, r: 3.4, fill: BLUE },
    { t: "circle", cx: 8.2, cy: yc, r: 2.7, fill: PINK },
    { t: "circle", cx: 2.5, cy: yc - 0.2, r: 1.5, fill: YELLOW },
    text(0.6, 0.55, "M", { size: 16 }),
    text(9.9, 0.7, "N", { size: 16 }),
    text(2.5, yc - 1.95, "K", { size: 16 }),
    ...place(o.kIn, 2.5, yc - 0.2, 0.5),
    ...place(o.mOnly, 4.0, yc + 1.9, 0.5),
    ...place(o.mn, 6.1, yc, 0.4),
    ...place(o.nOnly, 8.7, yc, 0.5),
  ];
  return { kind: "scene", width: 11, height: 2 * yc + 0.1, items, scale: o.scale ?? 26 };
}
