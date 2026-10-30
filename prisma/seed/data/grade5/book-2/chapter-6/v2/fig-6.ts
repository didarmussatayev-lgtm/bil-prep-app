import type { Figure } from "../../../../../types";

/**
 * Помощники для рисунков главы 6 (углы, круговые диаграммы) — всё рисуется через kind:"scene".
 * Углы задаются в обычной математической мере: 0° — вправо, против часовой стрелки.
 */
type It = Record<string, unknown>;

const rad = (d: number) => (d * Math.PI) / 180;
const r2 = (v: number) => Math.round(v * 100) / 100;

export type Ray = { deg: number; name?: string; len?: number };
export type ArcSpec = { from: number; to: number; label?: string; r?: number; lr?: number; /** угол, под которым стоит подпись (по умолчанию — середина дуги) */ la?: number; fill?: number | string };
export type PointSpec = { deg: number; r: number; name: string };
export type AngleOpts = {
  vertex?: string;
  len?: number;
  rays: Ray[];
  arcs?: ArcSpec[];
  /** прямые углы: пары направлений (градусы) */
  right?: [number, number][];
  /** засечки биссектрисы: пары направлений (две маленькие дуги) */
  ticks?: [number, number][];
  points?: PointSpec[];
  scale?: number;
  caption?: string;
};

/** Рисунок с лучами из одной точки, дугами и подписями градусов. */
export function angleFig(o: AngleOpts): Figure {
  const len = o.len ?? 4.5;
  const V = { x: 0, y: 0 };
  const P = (deg: number, r: number) => ({ x: r * Math.cos(rad(deg)), y: -r * Math.sin(rad(deg)) });
  const items: It[] = [];
  const pts: { x: number; y: number }[] = [V];
  type Raw = { kind: string; [k: string]: unknown };
  const raw: Raw[] = [];

  for (const ry of o.rays) {
    const L = ry.len ?? len;
    const e = P(ry.deg, L);
    pts.push(e);
    raw.push({ kind: "line", x1: 0, y1: 0, x2: e.x, y2: e.y });
    if (ry.name) {
      const t = P(ry.deg, L + 0.6);
      pts.push(t);
      raw.push({ kind: "text", x: t.x, y: t.y + 0.2, s: ry.name });
    }
  }
  for (const a of o.arcs ?? []) {
    const r = a.r ?? 1.1;
    const sweep = a.to - a.from;
    if (a.fill !== undefined) raw.push({ kind: "sector", cx: 0, cy: 0, r, a0: 90 - a.to, a1: 90 - a.from, fill: a.fill });
    if (sweep >= 360) raw.push({ kind: "circle", cx: 0, cy: 0, r });
    else raw.push({ kind: "arc", cx: 0, cy: 0, r, a0: 90 - a.to, a1: 90 - a.from });
    if (a.label) {
      const lr = a.lr ?? r + 0.75;
      const t = P(a.la ?? (a.from + a.to) / 2, lr);
      pts.push(t);
      raw.push({ kind: "text", x: t.x, y: t.y + 0.2, s: a.label, color: 4 });
    }
  }
  for (const [d1, d2] of o.right ?? []) {
    const m = 0.5;
    const u = P(d1, m), w = P(d2, m);
    raw.push({ kind: "poly", pts: [[u.x, u.y], [u.x + w.x, u.y + w.y], [w.x, w.y]], open: true });
  }
  for (const [d1, d2] of o.ticks ?? []) {
    const m = (d1 + d2) / 2;
    for (const k of [-1, 1]) {
      const rr = 1.55;
      const a = P(m + k * 4 - 0, rr), b = P(m + k * 4, rr + 0.35);
      raw.push({ kind: "line", x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }
  for (const p of o.points ?? []) {
    const c = P(p.deg, p.r);
    const t = P(p.deg, p.r + 0.5);
    pts.push(c, t);
    raw.push({ kind: "circle", cx: c.x, cy: c.y, r: 0.1, fill: 4 });
    raw.push({ kind: "text", x: t.x, y: t.y + 0.2, s: p.name });
  }
  if (o.vertex) {
    // подпись вершины — в самом «свободном» направлении, подальше от лучей
    const dirs = o.rays.map((r) => r.deg);
    let best = 225, bestScore = -1;
    for (let c = 0; c < 360; c += 15) {
      const score = Math.min(...dirs.map((d) => { const x = Math.abs(((c - d) % 360 + 360) % 360); return Math.min(x, 360 - x); }));
      if (score > bestScore) { bestScore = score; best = c; }
    }
    const vp = P(best, 0.7);
    raw.push({ kind: "text", x: vp.x, y: vp.y + 0.2, s: o.vertex });
    pts.push(vp);
  }
  raw.push({ kind: "circle", cx: 0, cy: 0, r: 0.1, fill: 4 });

  const minX = Math.min(...pts.map((p) => p.x)) - 0.4;
  const maxX = Math.max(...pts.map((p) => p.x)) + 0.4;
  const minY = Math.min(...pts.map((p) => p.y)) - 0.4;
  const maxY = Math.max(...pts.map((p) => p.y)) + 0.4;
  const dx = -minX, dy = -minY;
  const sh = (v: number, d: number) => r2(v + d);
  for (const it of raw) {
    const { kind, ...rest } = it;
    const q: It = { t: kind, ...rest };
    if (kind === "line") { q.x1 = sh(it.x1 as number, dx); q.y1 = sh(it.y1 as number, dy); q.x2 = sh(it.x2 as number, dx); q.y2 = sh(it.y2 as number, dy); }
    else if (kind === "text") { q.x = sh(it.x as number, dx); q.y = sh(it.y as number, dy); }
    else if (kind === "poly") q.pts = (it.pts as [number, number][]).map(([x, y]) => [sh(x, dx), sh(y, dy)]);
    else { q.cx = sh(it.cx as number, dx); q.cy = sh(it.cy as number, dy); }
    if (kind === "circle" && q.fill === undefined) q.fill = null;
    items.push(q);
  }
  return { kind: "scene", width: r2(maxX - minX), height: r2(maxY - minY), items, scale: o.scale ?? 26, caption: o.caption };
}

/** Два квадрата с общей вершиной: между ними два «просвета» g1 и 180−g1; подписан g1, второй — "?" (или наоборот). */
export function squaresFig(g1: number, labelFirst: string, labelSecond: string, caption?: string): Figure {
  const L = 3;
  const s = 15; // начало первого квадрата (математические градусы)
  const items: It[] = [];
  const P = (deg: number, r: number) => [r * Math.cos(rad(deg)), -r * Math.sin(rad(deg))] as [number, number];
  const sq = (a: number, fill: number) => {
    const u = P(a, L), w = P(a + 90, L);
    return { t: "poly", pts: [[0, 0], u, [u[0] + w[0], u[1] + w[1]], w], fill };
  };
  const a1 = s, b1 = s + 90 + g1;
  const raws: It[] = [sq(a1, 0), sq(b1, 2)];
  const ar = (from: number, to: number, label: string) => {
    const m = P((from + to) / 2, 1.9);
    return [
      { t: "arc", cx: 0, cy: 0, r: 1.1, a0: 90 - to, a1: 90 - from },
      { t: "text", x: m[0], y: m[1] + 0.2, s: label, color: 4 },
    ];
  };
  raws.push(...(ar(s + 90, s + 90 + g1, labelFirst) as It[]));
  raws.push(...(ar(s + 180 + g1, s + 360, labelSecond) as It[]));
  raws.push({ t: "right", x: 0, y: 0 } as It);
  // все точки: углы квадратов и отметки
  const all: [number, number][] = [[0, 0]];
  for (const a of [a1, b1]) {
    const u = P(a, L), w = P(a + 90, L);
    all.push(u, w, [u[0] + w[0], u[1] + w[1]]);
  }
  const minX = Math.min(...all.map((p) => p[0])) - 0.8, maxX = Math.max(...all.map((p) => p[0])) + 0.8;
  const minY = Math.min(...all.map((p) => p[1])) - 0.8, maxY = Math.max(...all.map((p) => p[1])) + 0.8;
  const dx = -minX, dy = -minY;
  const out: It[] = [];
  for (const it of raws) {
    const q: It = { ...it };
    if (it.t === "poly") q.pts = (it.pts as [number, number][]).map(([x, y]) => [r2(x + dx), r2(y + dy)]);
    else if (it.t === "text") { q.x = r2((it.x as number) + dx); q.y = r2((it.y as number) + dy); }
    else if (it.t === "right") continue;
    else { q.cx = r2(dx); q.cy = r2(dy); }
    out.push(q);
  }
  out.push({ t: "circle", cx: r2(dx), cy: r2(dy), r: 0.1, fill: 4 });
  return { kind: "scene", width: r2(maxX - minX), height: r2(maxY - minY), items: out, caption };
}

export type PieSec = { deg: number; name?: string; show?: string; fill?: number };
/** Круговая диаграмма сценой: сектора по порядку по часовой стрелке от 12 часов. show — подпись внутри (градусы, %, «?»), name — название снаружи. */
export function pieFig(secs: PieSec[], o: { r?: number; caption?: string } = {}): Figure {
  const r = o.r ?? 3;
  const cx = r + 3.2, cy = r + 1.2;
  const items: It[] = [];
  let a = 0;
  secs.forEach((s, i) => {
    const a0 = a, a1 = a + s.deg;
    items.push({ t: "sector", cx, cy, r, a0, a1: Math.min(a1, 359.99), fill: s.fill ?? i });
    a = a1;
  });
  a = 0;
  secs.forEach((s) => {
    const m = a + s.deg / 2;
    const sx = Math.sin(rad(m)), cyy = -Math.cos(rad(m));
    const small = s.deg < 28;
    if (s.show) {
      const rr = small ? r + 0.55 : r * 0.62;
      const label = small && s.name ? "" : s.show;
      if (label) items.push({ t: "text", x: r2(cx + rr * sx), y: r2(cy + rr * cyy + 0.2), s: label, size: 13, color: 4 });
    }
    if (s.name) {
      const rr = r + 0.45;
      const x = cx + rr * sx;
      const anchor = Math.abs(sx) < 0.3 ? "middle" : sx > 0 ? "start" : "end";
      const nm = small && s.show ? `${s.name} ${s.show}` : s.name;
      items.push({ t: "text", x: r2(x), y: r2(cy + rr * cyy + (cyy > 0.5 ? 0.55 : cyy < -0.5 ? -0.1 : 0.2)), s: nm, anchor, size: 12 });
    }
    a += s.deg;
  });
  items.push({ t: "circle", cx, cy, r: 0.08, fill: 4 });
  return { kind: "scene", width: r2(2 * r + 6.4), height: r2(2 * r + 2.4), items, caption: o.caption };
}

export type CircleOpts = {
  r?: number;
  /** точки: deg — направление (математические градусы), r — расстояние от центра в клетках */
  points?: PointSpec[];
  center?: string;
  /** радиус/диаметр отрезками (направление в мат. градусах) */
  radius?: { deg: number; label?: string };
  diameter?: { deg: number; label?: string };
  /** дуга (жирная) между точками на окружности, мат. градусы от a до b против часовой */
  arc?: { from: number; to: number; names?: [string, string] };
  /** сектор (закрашен), мат. градусы */
  sector?: { from: number; to: number; label?: string };
  fill?: boolean;
  caption?: string;
};

/** Окружность/круг с центром, точками, радиусом, диаметром, дугой или сектором. */
export function circleFig(o: CircleOpts): Figure {
  const r = o.r ?? 3;
  const m = 1.9;
  const cx = r + m, cy = r + m;
  const P = (deg: number, d: number): [number, number] => [r2(cx + d * Math.cos(rad(deg))), r2(cy - d * Math.sin(rad(deg)))];
  const items: It[] = [];
  if (o.sector) items.push({ t: "sector", cx, cy, r, a0: 90 - o.sector.to, a1: 90 - o.sector.from, fill: 3 });
  items.push({ t: "circle", cx, cy, r, fill: o.fill ? 3 : null });
  if (o.sector) {
    for (const d of [o.sector.from, o.sector.to]) { const e = P(d, r); items.push({ t: "line", x1: cx, y1: cy, x2: e[0], y2: e[1] }); }
    if (o.sector.label) { const t = P((o.sector.from + o.sector.to) / 2, r * 0.55); items.push({ t: "text", x: t[0], y: r2(t[1] + 0.2), s: o.sector.label, color: 4 }); }
  }
  if (o.radius) {
    const e = P(o.radius.deg, r);
    items.push({ t: "line", x1: cx, y1: cy, x2: e[0], y2: e[1] });
    if (o.radius.label) { const t = P(o.radius.deg + 18, r * 0.55); items.push({ t: "text", x: t[0], y: r2(t[1] + 0.2), s: o.radius.label, color: 4 }); }
  }
  if (o.diameter) {
    const a = P(o.diameter.deg, r), b = P(o.diameter.deg + 180, r);
    items.push({ t: "line", x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
    if (o.diameter.label) { const t = P(o.diameter.deg + 180 - 12, r * 0.55); items.push({ t: "text", x: t[0], y: r2(t[1] + 0.8), s: o.diameter.label, color: 4 }); }
  }
  if (o.arc) {
    items.push({ t: "arc", cx, cy, r, a0: 90 - o.arc.to, a1: 90 - o.arc.from, color: 4, w: 5 });
    (o.arc.names ?? []).forEach((nm, i) => {
      const dg = i === 0 ? o.arc!.from : o.arc!.to;
      const e = P(dg, r + 0.55);
      items.push({ t: "circle", cx: P(dg, r)[0], cy: P(dg, r)[1], r: 0.1, fill: 4 });
      items.push({ t: "text", x: e[0], y: r2(e[1] + 0.2), s: nm });
    });
  }
  for (const p of o.points ?? []) {
    const c = P(p.deg, p.r), t = P(p.deg, p.r + 0.5);
    items.push({ t: "circle", cx: c[0], cy: c[1], r: 0.1, fill: 4 });
    items.push({ t: "text", x: t[0], y: r2(t[1] + 0.2), s: p.name });
  }
  if (o.center !== undefined) {
    items.push({ t: "circle", cx, cy, r: 0.1, fill: 4 });
    if (o.center) items.push({ t: "text", x: r2(cx - 0.4), y: r2(cy + 0.65), s: o.center });
  }
  return { kind: "scene", width: r2(2 * r + 2 * m), height: r2(2 * r + 2 * m), items, caption: o.caption };
}

/** Глубокий перевод строк рисунка по словарю (для казахских версий: числа и геометрия те же, меняются только подписи).
 *  Строка заменяется, если она целиком есть в словаре или начинается с ключа + пробел («Учителя 24°»). */
export function translateFigure<T>(fig: T, dict: Record<string, string>): T {
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
  const tr = (s: string): string => {
    if (dict[s] !== undefined) return dict[s];
    for (const k of keys) if (s.startsWith(k + " ")) return dict[k] + s.slice(k.length);
    return s;
  };
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return tr(v);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, k === "kind" || k === "t" ? x : walk(x)]));
    return v;
  };
  return walk(fig) as T;
}

/** Рисунки из explanation русской темы в порядке следования (для перевода в kk-файле). */
export function figuresOf(explanation: string): Figure[] {
  return [...explanation.matchAll(/^:::figure (\{.*\})\s*$/gm)].map((m) => JSON.parse(m[1]) as Figure);
}
