import type { Figure } from "../../../../../types";

/** Рисунок чашечных весов (в равновесии) как параметрический `scene`.
 *  Предмет: строка-подпись ("x", "5", "80 г") или { s, fill?, w? }. Неизвестное "x"/буква рисуется другим цветом. */
export type BalItem = string | { s: string; fill?: number; w?: number };

const H = 1.6; // высота блока
const GAP = 0.25;

function norm(it: BalItem) {
  const o = typeof it === "string" ? { s: it } : it;
  const unknown = /^[a-zA-Zа-я]$/.test(o.s);
  return { s: o.s, fill: o.fill ?? (unknown ? 3 : 0), w: o.w ?? Math.max(2, 0.6 * o.s.length + 1.1) };
}

function pack(items: BalItem[], maxW: number) {
  const rows: ReturnType<typeof norm>[][] = [[]];
  let cur = 0;
  for (const raw of items) {
    const it = norm(raw);
    if (cur + it.w > maxW && rows[rows.length - 1].length) { rows.push([]); cur = 0; }
    rows[rows.length - 1].push(it);
    cur += it.w + GAP;
  }
  return rows;
}

export function balance(left: BalItem[], right: BalItem[], opts: { caption?: string; maxW?: number } = {}): Figure {
  const maxW = opts.maxW ?? 9;
  const L = pack(left, maxW);
  const R = pack(right, maxW);
  const rowW = (rows: ReturnType<typeof norm>[][]) => Math.max(...rows.map((r) => r.reduce((s, i) => s + i.w + GAP, -GAP)));
  const panL = Math.max(5, rowW(L) + 1);
  const panR = Math.max(5, rowW(R) + 1);
  const rowsN = Math.max(L.length, R.length);
  const top = 0.4;
  const y0 = top + 0.8 + rowsN * (H + GAP) + 0.2; // уровень чаш
  const xL = 0.3;
  const xR = xL + panL + 2.4;
  const width = xR + panR + 0.3;
  const cx = (xL + xR + panR) / 2 + 0.0;
  const items: Record<string, unknown>[] = [];
  // коромысло и подвесы
  items.push({ t: "line", x1: xL, y1: top, x2: xR + panR, y2: top, color: 5 });
  for (const x of [xL, xL + panL, xR, xR + panR]) items.push({ t: "line", x1: x, y1: top, x2: x, y2: y0, color: 5 });
  items.push({ t: "line", x1: xL, y1: y0, x2: xL + panL, y2: y0, color: 5 });
  items.push({ t: "line", x1: xR, y1: y0, x2: xR + panR, y2: y0, color: 5 });
  // стойка и основание
  items.push({ t: "line", x1: cx, y1: top, x2: cx, y2: y0 + 1.6, color: 5 });
  items.push({ t: "poly", pts: [[cx - 1.2, y0 + 2.4], [cx + 1.2, y0 + 2.4], [cx, y0 + 1.6]], fill: 5 });
  const put = (rows: ReturnType<typeof norm>[][], x0: number, pw: number) => {
    rows.forEach((row, ri) => {
      const w = row.reduce((s, i) => s + i.w + GAP, -GAP);
      let x = x0 + (pw - w) / 2;
      const y = y0 - (ri + 1) * (H + GAP) + GAP;
      for (const it of row) {
        items.push({ t: "rect", x, y, w: it.w, h: H, fill: it.fill, label: it.s });
        x += it.w + GAP;
      }
    });
  };
  put(L, xL, panL);
  put(R, xR, panR);
  return { kind: "scene", width: Math.round(width * 10) / 10, height: y0 + 2.8, items, scale: 22, caption: opts.caption };
}

/** Строка для вставки в explanation: :::figure {json} */
export const fig = (f: Figure) => `:::figure ${JSON.stringify(f)}`;
