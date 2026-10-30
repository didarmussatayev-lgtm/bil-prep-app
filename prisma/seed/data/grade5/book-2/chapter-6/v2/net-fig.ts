import type { Figure } from "../../../../../types";

/**
 * Помощники для тем 6.5 и 6.6: развёртки куба/параллелепипеда, картинки кубов и склейка рёбер.
 * Все подписи в рисунках — буквы, цифры или цвета (без русского текста), поэтому те же рисунки
 * годятся и для казахского перевода. Ответы к задачам вычисляются настоящей «сборкой» развёртки в 3D.
 */
type It = Record<string, unknown>;

/** Ячейка развёртки: x вправо, y вниз, l — подпись грани (если начинается с «~», на рисунке не показывается), f — цвет 0-5. */
export type Cell = { x: number; y: number; l: string; f?: number };
export type Net = Cell[];

/** Развёртка из строк: «.» — пусто, любой другой символ — подпись грани. */
export function parseNet(rows: string[], fills: Record<string, number> = {}): Net {
  const out: Net = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch !== "." && ch !== " ") out.push({ x, y, l: ch, ...(fills[ch] !== undefined ? { f: fills[ch] } : {}) });
    });
  });
  return out;
}

/* ---------- 3D-сборка куба ---------- */
type V = [number, number, number];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const neg = (a: V): V => [-a[0], -a[1], -a[2]];
const key = (a: V) => a.join(",");

type Frame = { n: V; R: V; D: V; O: V };

/** Складывает развёртку (надписи снаружи). Возвращает null, если это не развёртка куба. */
export function fold(net: Net): { faces: Map<string, string>; frames: Map<string, Frame> } | null {
  if (net.length !== 6) return null;
  const at = new Map<string, Cell>();
  net.forEach((c) => at.set(`${c.x},${c.y}`, c));
  const frames = new Map<string, Frame>();
  const root = net[0];
  frames.set(`${root.x},${root.y}`, { n: [0, 0, 1], R: [1, 0, 0], D: [0, -1, 0], O: [0, 1, 1] });
  const queue = [root];
  while (queue.length) {
    const c = queue.shift()!;
    const f = frames.get(`${c.x},${c.y}`)!;
    const dirs: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dx, dy] of dirs) {
      const nb = at.get(`${c.x + dx},${c.y + dy}`);
      if (!nb || frames.has(`${nb.x},${nb.y}`)) continue;
      let g: Frame;
      if (dx === 1) g = { n: f.R, R: neg(f.n), D: f.D, O: add(f.O, f.R) };
      else if (dx === -1) { const Rp = f.n; g = { n: neg(f.R), R: Rp, D: f.D, O: add(f.O, neg(Rp)) }; }
      else if (dy === 1) g = { n: f.D, R: f.R, D: neg(f.n), O: add(f.O, f.D) };
      else { const Dp = f.n; g = { n: neg(f.D), R: f.R, D: Dp, O: add(f.O, neg(Dp)) }; }
      frames.set(`${nb.x},${nb.y}`, g);
      queue.push(nb);
    }
  }
  if (frames.size !== 6) return null; // не связная
  const faces = new Map<string, string>(); // ключ нормали → подпись
  for (const c of net) {
    const f = frames.get(`${c.x},${c.y}`)!;
    if (faces.has(key(f.n))) return null; // две клетки на одной грани
    faces.set(key(f.n), c.l);
  }
  return { faces, frames };
}

export const isCubeNet = (net: Net) => fold(net) !== null;

/** Подпись грани, противоположной грани с подписью l. */
export function opposite(net: Net, l: string): string {
  const r = fold(net);
  if (!r) throw new Error("не развёртка куба");
  for (const [k, lab] of r.faces) {
    if (lab === l) {
      const n = k.split(",").map(Number) as V;
      return r.faces.get(key(neg(n)))!;
    }
  }
  throw new Error("нет грани " + l);
}

/** Пары противоположных граней. */
export function oppositePairs(net: Net): [string, string][] {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  for (const c of net) {
    if (seen.has(c.l)) continue;
    const o = opposite(net, c.l);
    seen.add(c.l); seen.add(o);
    out.push([c.l, o]);
  }
  return out;
}

/* Все 24 поворота куба: отображение нормалей. */
type M = (v: V) => V;
const rotX: M = ([x, y, z]) => [x, -z, y];
const rotZ: M = ([x, y, z]) => [-y, x, z];
function allRotations(): M[] {
  const res: M[] = [];
  const seen = new Set<string>();
  const probe = (m: M) => [m([1, 0, 0]), m([0, 1, 0]), m([0, 0, 1])].map(key).join("|");
  const q: M[] = [(v) => v];
  seen.add(probe(q[0]));
  while (q.length) {
    const m = q.shift()!;
    res.push(m);
    for (const g of [rotX, rotZ]) {
      const m2: M = (v) => g(m(v));
      const p = probe(m2);
      if (!seen.has(p)) { seen.add(p); q.push(m2); }
    }
  }
  return res;
}
const ROTS = allRotations();

/** Три видимые грани куба: сверху, слева (передняя), справа. Можно ли так увидеть собранную развёртку? */
export function showsView(net: Net, top: string, left: string, right: string): boolean {
  const r = fold(net);
  if (!r) throw new Error("не развёртка куба");
  const labelAt = (m: M, v: V) => {
    // грань, которая после поворота оказалась в позиции v: берём прообраз
    for (const [k, lab] of r.faces) {
      const n = k.split(",").map(Number) as V;
      if (key(m(n)) === key(v)) return lab;
    }
    return "";
  };
  return ROTS.some((m) => labelAt(m, [0, 0, 1]) === top && labelAt(m, [0, -1, 0]) === left && labelAt(m, [1, 0, 0]) === right);
}

/** Склейка рёбер: нумерованные внешние стороны развёртки → какие из них склеятся. */
export type Side = { id: number; cell: string; dir: "U" | "D" | "L" | "R"; a: [number, number]; b: [number, number] };

/** Внешние стороны (не склеенные внутри развёртки) в порядке обхода клеток; возвращает также 3D-ключи рёбер. */
export function boundarySides(net: Net): { sides: Side[]; edgeKey: string[] } {
  const r = fold(net);
  if (!r) throw new Error("не развёртка куба");
  const at = new Set(net.map((c) => `${c.x},${c.y}`));
  const sides: Side[] = [];
  const edgeKey: string[] = [];
  const corners = (f: Frame, i: number, j: number): V => add(f.O, add(f.R.map((v) => v * i) as V, f.D.map((v) => v * j) as V));
  let id = 1;
  for (const c of net) {
    const f = r.frames.get(`${c.x},${c.y}`)!;
    const sideDefs: { dir: Side["dir"]; dx: number; dy: number; p: [number, number]; q: [number, number] }[] = [
      { dir: "U", dx: 0, dy: -1, p: [0, 0], q: [1, 0] },
      { dir: "D", dx: 0, dy: 1, p: [0, 1], q: [1, 1] },
      { dir: "L", dx: -1, dy: 0, p: [0, 0], q: [0, 1] },
      { dir: "R", dx: 1, dy: 0, p: [1, 0], q: [1, 1] },
    ];
    for (const s of sideDefs) {
      if (at.has(`${c.x + s.dx},${c.y + s.dy}`)) continue;
      const P = corners(f, s.p[0], s.p[1]);
      const Q = corners(f, s.q[0], s.q[1]);
      const k = [key(P), key(Q)].sort().join("~");
      sides.push({ id: id++, cell: c.l, dir: s.dir, a: [c.x + s.p[0], c.y + s.p[1]], b: [c.x + s.q[0], c.y + s.q[1]] });
      edgeKey.push(k);
    }
  }
  return { sides, edgeKey };
}

/** С какой стороной склеится сторона № id (по порядку обхода boundarySides). */
export function glued(net: Net, id: number): number {
  const { sides, edgeKey } = boundarySides(net);
  const i = sides.findIndex((s) => s.id === id);
  const j = edgeKey.findIndex((k, idx) => idx !== i && k === edgeKey[i]);
  if (j < 0) throw new Error("нет пары");
  return sides[j].id;
}

/* ---------- Рисунки ---------- */
const tx = (x: number, y: number, s: string, extra: It = {}): It => ({ t: "text", x, y, s, anchor: "middle", ...extra });
const shown = (l: string) => (l.startsWith("~") ? "" : l);

type Block = { items: It[]; w: number; h: number };

/** Развёртка как блок; если sideLabels — подписывает внешние стороны цифрами 1, 2, … */
export function netBlock(net: Net, opts: { sideLabels?: boolean; fill?: number; sideNumbers?: number[]; hide?: boolean } = {}): Block {
  const items: It[] = [];
  const maxX = Math.max(...net.map((c) => c.x)) + 1;
  const maxY = Math.max(...net.map((c) => c.y)) + 1;
  for (const c of net) {
    const fill = c.f !== undefined ? c.f : opts.fill ?? 1;
    items.push({ t: "rect", x: c.x, y: c.y, w: 1, h: 1, fill, label: opts.hide ? undefined : shown(c.l) || undefined });
  }
  if (opts.sideLabels) {
    const { sides } = boundarySides(net);
    sides.forEach((s) => {
      // номер стоит внутри квадрата у своей стороны, чтобы не путаться в «впадинах» контура
      const mx = (s.a[0] + s.b[0]) / 2, my = (s.a[1] + s.b[1]) / 2;
      const off = 0.2;
      const dx = s.dir === "L" ? off : s.dir === "R" ? -off : 0;
      const dy = s.dir === "U" ? off : s.dir === "D" ? -off : 0;
      items.push(tx(mx + dx, my + dy + 0.12, String(opts.sideNumbers ? opts.sideNumbers[s.id - 1] : s.id), { color: 2, size: 11 }));
    });
  }
  return { items, w: maxX, h: maxY };
}

/** Куб в изометрии: три видимые грани (подпись и/или цвет). */
export type CubeFace = { l?: string; f?: number };
export function cubeBlock(top: CubeFace, left: CubeFace, right: CubeFace, ox = 0, oy = 0): Block {
  const w = 0.9;
  const cx = ox + w, cy = oy;
  const items: It[] = [
    { t: "poly", pts: [[cx, cy], [cx + w, cy + 0.5], [cx, cy + 1], [cx - w, cy + 0.5]], fill: top.f ?? 1 },
    { t: "poly", pts: [[cx - w, cy + 0.5], [cx, cy + 1], [cx, cy + 2], [cx - w, cy + 1.5]], fill: left.f ?? 1 },
    { t: "poly", pts: [[cx, cy + 1], [cx + w, cy + 0.5], [cx + w, cy + 1.5], [cx, cy + 2]], fill: right.f ?? 1 },
  ];
  if (top.l) items.push(tx(cx, cy + 0.62, top.l));
  if (left.l) items.push(tx(cx - w / 2, cy + 1.32, left.l));
  if (right.l) items.push(tx(cx + w / 2, cy + 1.32, right.l));
  return { items, w: 2 * w, h: 2 };
}

const shift = (items: It[], dx: number, dy: number): It[] =>
  items.map((it) => {
    const o: It = { ...it };
    if (typeof o.x === "number") o.x = (o.x as number) + dx;
    if (typeof o.y === "number") o.y = (o.y as number) + dy;
    if (Array.isArray(o.pts)) o.pts = (o.pts as [number, number][]).map(([a, b]) => [a + dx, b + dy]);
    return o;
  });

/** Несколько блоков с буквами-названиями в сетке cols столбцов. */
export function gallery(blocks: Block[], names: string[], cols: number, scale = 24, gap = 1.2): Figure {
  const cw = Math.max(...blocks.map((b) => b.w)) + gap;
  const ch = Math.max(...blocks.map((b) => b.h)) + 1.5;
  const items: It[] = [];
  blocks.forEach((b, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x0 = col * cw, y0 = row * ch + 0.9;
    items.push(tx(x0 + b.w / 2, y0 - 0.25, names[i], { size: 15, color: 3 }));
    items.push(...shift(b.items, x0, y0));
  });
  const rows = Math.ceil(blocks.length / cols);
  return { kind: "scene", width: Math.min(cols, blocks.length) * cw - gap, height: rows * ch, items, scale };
}

export function netFigure(net: Net, opts: { sideLabels?: boolean; fill?: number; scale?: number; caption?: string; hide?: boolean } = {}): Figure {
  const b = netBlock(net, opts);
  return { kind: "scene", width: b.w, height: b.h, items: b.items, scale: opts.scale ?? (opts.sideLabels ? 40 : 30), ...(opts.caption ? { caption: opts.caption } : {}) };
}

export function cubeFigure(top: CubeFace, left: CubeFace, right: CubeFace, caption?: string): Figure {
  const b = cubeBlock(top, left, right);
  return { kind: "scene", width: b.w, height: b.h, items: b.items, scale: 34, ...(caption ? { caption } : {}) };
}

/** Три куба рядом (как три положения одного кубика в учебнике). */
export function cubesRow(views: [CubeFace, CubeFace, CubeFace][], scale = 28, caption?: string): Figure {
  const blocks = views.map((v) => cubeBlock(v[0], v[1], v[2]));
  const items: It[] = [];
  blocks.forEach((b, i) => items.push(...shift(b.items, i * 2.4, 0)));
  return { kind: "scene", width: views.length * 2.4 - 0.6, height: 2, items, scale, ...(caption ? { caption } : {}) };
}

/** Рисунок «развёртка + отмеченные клетки-кандидаты» для вопросов «куда добавить грань». */
export function netWithCandidates(net: Net, cand: { x: number; y: number; l: string }[], scale = 30): Figure {
  const all = [...net, ...cand];
  const minX = Math.min(...all.map((c) => c.x)), minY = Math.min(...all.map((c) => c.y));
  const maxX = Math.max(...all.map((c) => c.x)) + 1, maxY = Math.max(...all.map((c) => c.y)) + 1;
  const items: It[] = [];
  for (const c of net) items.push({ t: "rect", x: c.x - minX, y: c.y - minY, w: 1, h: 1, fill: 1 });
  for (const c of cand) items.push({ t: "rect", x: c.x - minX, y: c.y - minY, w: 1, h: 1, fill: null, dash: true, label: c.l });
  return { kind: "scene", width: maxX - minX, height: maxY - minY, items, scale };
}

export const L5 = ["A", "B", "C", "D", "E"] as const;

/** Выбор «куда поставить» и прочие помощники для составления вариантов ответа. */
export function place<T>(correct: T, wrongs: T[], pos: number): { options: T[]; letter: (typeof L5)[number] } {
  const options = [...wrongs];
  options.splice(pos, 0, correct);
  return { options, letter: L5[pos] };
}

/** Все допустимые тройки (сверху, слева, справа) для данной развёртки. */
export function allViews(net: Net): [string, string, string][] {
  const ls = net.map((c) => c.l);
  const out: [string, string, string][] = [];
  for (const a of ls) for (const b of ls) for (const c of ls) {
    if (a === b || b === c || a === c) continue;
    if (showsView(net, a, b, c)) out.push([a, b, c]);
  }
  return out;
}

/** Подбирает порядок (сверху, слева, справа) для набора из трёх граней, где сверху — top. */
export function view(net: Net, top: string, x: string, y: string): [string, string, string] {
  if (showsView(net, top, x, y)) return [top, x, y];
  if (showsView(net, top, y, x)) return [top, y, x];
  throw new Error(`грани ${top},${x},${y} не сходятся в одной вершине`);
}

/** Развёртка прямоугольного параллелепипеда a×b×c на клетчатой бумаге (клетка — 1 см); на гранях подписаны их размеры. */
export function boxNetFigure(a: number, b: number, c: number): Figure {
  const items: It[] = [];
  const faces: [number, number, number, number][] = [
    [0, b, a, c], [a, b, b, c], [a + b, b, a, c], [2 * a + b, b, b, c], // боковые грани
    [0, 0, a, b], [0, b + c, a, b], // верх и низ
  ];
  faces.forEach(([x, y, w, h], i) => items.push({ t: "rect", x, y, w, h, fill: i < 4 ? 1 : 0, label: `${w}×${h}` }));
  return { kind: "scene", width: 2 * a + 2 * b, height: 2 * b + c, items, scale: 22 };
}

/* ---------- Постройки из кубиков (heights[r][c] — высота стопки) ---------- */
export const polyCount = (h: number[][]) => h.flat().reduce((s, v) => s + v, 0);
/** Число пар соприкасающихся (по грани) кубиков. */
export function polyContacts(h: number[][]): number {
  const g = (r: number, c: number) => h[r]?.[c] ?? 0;
  let k = 0;
  for (let r = 0; r < h.length; r++) for (let c = 0; c < h[r].length; c++) {
    const v = g(r, c);
    if (v > 0) k += v - 1; // стопка
    k += Math.min(v, g(r, c + 1)) + Math.min(v, g(r + 1, c));
  }
  return k;
}
/** Площадь поверхности (в гранях кубиков), включая нижнюю грань. Считается двумя способами и сверяется. */
export function polySurface(h: number[][]): number {
  const g = (r: number, c: number) => h[r]?.[c] ?? 0;
  let cells = 0, sides = 0;
  for (let r = 0; r < h.length; r++) for (let c = 0; c < h[r].length; c++) {
    const v = g(r, c);
    if (v > 0) cells++;
    sides += Math.max(0, v - g(r - 1, c)) + Math.max(0, v - g(r + 1, c)) + Math.max(0, v - g(r, c - 1)) + Math.max(0, v - g(r, c + 1));
  }
  const s1 = 2 * cells + sides;
  const s2 = 6 * polyCount(h) - 2 * polyContacts(h);
  if (s1 !== s2) throw new Error("polySurface: способы не совпали");
  return s1;
}
