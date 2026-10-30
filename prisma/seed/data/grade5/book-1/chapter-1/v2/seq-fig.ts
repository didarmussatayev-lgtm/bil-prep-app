import type { Figure } from "../../../../../types";

type Item = Record<string, unknown>;

/** Фигуры из точек: "square" — n×n точек, "triangle" — ряды 1, 2, …, n. Подпись под каждой: «n = k». */
export function dotPattern(shape: "square" | "triangle", ns: number[], caption?: string): Figure {
  const items: Item[] = [];
  let x = 0.5;
  const maxN = Math.max(...ns);
  for (const n of ns) {
    for (let r = 0; r < n; r++) {
      const cnt = shape === "square" ? n : r + 1;
      const off = shape === "square" ? 0 : (n - cnt) / 2;
      for (let c = 0; c < cnt; c++) items.push({ t: "circle", cx: x + off + c + 0.5, cy: r + 0.5, r: 0.32, fill: shape === "square" ? 0 : 2 });
    }
    items.push({ t: "text", x: x + n / 2, y: maxN + 1.1, s: `n = ${n}`, anchor: "middle" });
    x += n + 1.6;
  }
  return { kind: "scene", width: x - 0.6, height: maxN + 1.6, items, scale: 24, caption };
}

/** Цепочка из спичечных квадратов или треугольников; на каждой строке — свой шаг (1, 2, 3, …). word — «шаг». */
export function matchChain(shape: "square" | "triangle", steps: number[], word: string, caption?: string): Figure {
  const items: Item[] = [];
  const S = 2; // сторона
  const h = Math.sqrt(3) * S / 2;
  const rowH = (shape === "square" ? S : h) + 1;
  steps.forEach((k, ri) => {
    const y0 = ri * rowH + 0.4;
    items.push({ t: "text", x: 0, y: y0 + (shape === "square" ? S : h) / 2 + 0.3, s: `${word} ${k}`, anchor: "start" });
    const ox = 3.6;
    if (shape === "square") {
      for (let i = 0; i < k; i++) items.push({ t: "rect", x: ox + i * S, y: y0, w: S, h: S, fill: null });
    } else {
      for (let i = 0; i < k; i++) {
        const left = ox + (i * S) / 2;
        const up = i % 2 === 0;
        const pts: [number, number][] = up
          ? [[left, y0 + h], [left + S, y0 + h], [left + S / 2, y0]]
          : [[left, y0], [left + S, y0], [left + S / 2, y0 + h]];
        items.push({ t: "poly", pts, fill: null });
      }
    }
  });
  const maxK = Math.max(...steps);
  const w = 3.6 + (shape === "square" ? maxK * S : ((maxK + 1) * S) / 2) + 0.5;
  return { kind: "scene", width: w, height: steps.length * rowH + 0.2, items, scale: 22, caption };
}

/** Ряд кружков с числами; над каждым — его номер в последовательности. */
export function circleRow(values: (number | string)[], idx: number[], caption?: string): Figure {
  const items: Item[] = [];
  values.forEach((v, i) => {
    const cx = 1.3 + i * 3;
    items.push({ t: "text", x: cx, y: 0.7, s: String(idx[i]), anchor: "middle", color: 5 });
    items.push({ t: "circle", cx, cy: 2.4, r: 1.05, fill: v === "?" ? 3 : 0 });
    items.push({ t: "text", x: cx, y: 2.75, s: String(v), anchor: "middle" });
  });
  return { kind: "scene", width: values.length * 3 + 0.4, height: 4, items, scale: 22, caption };
}
