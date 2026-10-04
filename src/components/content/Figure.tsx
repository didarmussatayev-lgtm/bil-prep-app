import type { FigureSpec } from "@/lib/content/types";
import ui from "@/components/student/ui.module.css";
import { renderRichInline } from "@/components/content/RichText";
 
/** Прямоугольник, поделённый на равные вертикальные доли — dольные полосы (kind="fraction_bar"). */
function FractionBar({ parts, shaded }: { parts: number; shaded: number[] }) {
  const width = 220;
  const height = 44;
  const seg = width / Math.max(parts, 1);
  const isShaded = new Set(shaded);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      {Array.from({ length: parts }, (_, i) => (
        <rect
          key={i}
          x={i * seg}
          y={0}
          width={seg}
          height={height}
          fill={isShaded.has(i) ? "var(--pen, #2f5bea)" : "#fff"}
          stroke="var(--ink, #1b2a4a)"
        />
      ))}
    </svg>
  );
}
 
/** Круг, поделённый на равные секторы (kind="circle"). */
function FractionCircle({ parts, shaded }: { parts: number; shaded: number[] }) {
  const size = 96;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const isShaded = new Set(shaded);
  const sectors = Array.from({ length: parts }, (_, i) => {
    const a0 = ((-90 + (i * 360) / parts) * Math.PI) / 180;
    const a1 = ((-90 + ((i + 1) * 360) / parts) * Math.PI) / 180;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const largeArc = 360 / parts > 180 ? 1 : 0;
    const d = parts === 1 ? undefined : `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
    return (
      <path
        key={i}
        d={d ?? `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`}
        fill={isShaded.has(i) ? "var(--pen, #2f5bea)" : "#fff"}
        stroke="var(--ink, #1b2a4a)"
      />
    );
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {sectors}
    </svg>
  );
}
 
/** Прямоугольная сетка с закрашенными клетками — [строка, столбец], нумерация с 0 (kind="grid"). */
function FractionGrid({ rows, cols, shaded }: { rows: number; cols: number; shaded: [number, number][] }) {
  const cell = 26;
  const width = cols * cell;
  const height = rows * cell;
  const isShaded = new Set(shaded.map(([r, c]) => `${r}:${c}`));
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * cell}
          y={r * cell}
          width={cell}
          height={cell}
          fill={isShaded.has(`${r}:${c}`) ? "var(--pen, #2f5bea)" : "#fff"}
          stroke="var(--ink, #1b2a4a)"
        />,
      );
    }
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      {cells}
    </svg>
  );
}
 
/** Числовой луч с делениями и отмеченными точками (kind="number_line"). at может быть числом или [числитель,знаменатель]. */
function NumberLine({
  from,
  to,
  divisions,
  marks,
}: {
  from: number;
  to: number;
  divisions: number;
  marks: { at: number | [number, number]; label?: string }[];
}) {
  const width = 260;
  const height = 56;
  const pad = 18;
  const span = to - from || 1;
  const x = (v: number) => pad + ((v - from) / span) * (width - pad * 2);
  const valueOf = (at: number | [number, number]) => (Array.isArray(at) ? at[0] / at[1] : at);
 
  const ticks = Array.from({ length: divisions + 1 }, (_, i) => from + (span * i) / divisions);
 
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <line x1={pad} y1={height / 2} x2={width - pad} y2={height / 2} stroke="var(--ink, #1b2a4a)" />
      {ticks.map((v, i) => (
        <line key={i} x1={x(v)} x2={x(v)} y1={height / 2 - 5} y2={height / 2 + 5} stroke="var(--ink, #1b2a4a)" />
      ))}
      <text x={pad} y={height / 2 - 10} fontSize={11} textAnchor="middle" fill="var(--ink, #1b2a4a)">{from}</text>
      <text x={width - pad} y={height / 2 - 10} fontSize={11} textAnchor="middle" fill="var(--ink, #1b2a4a)">{to}</text>
      {marks.map((m, i) => {
        const v = valueOf(m.at);
        return (
          <g key={i}>
            <circle cx={x(v)} cy={height / 2} r={4} fill="var(--pen, #2f5bea)" />
            {m.label && (
              <text x={x(v)} y={height / 2 + 20} fontSize={11} textAnchor="middle" fill="var(--ink, #1b2a4a)">
                {m.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
 
/** Таблица (kind="table") — обычная HTML-таблица, не SVG (текстовый контент, векторизовать нечего). */
function FigureTableEl({ rows }: { rows: string[][] }) {
  return (
    <table className={ui.figureTable}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
 
/** N чисел по кругу через равные промежутки, по часовой стрелке с 12 часов (kind="circle_numbers"). */
function CircleNumbers({ values }: { values: (number | string)[] }) {
  const n = Math.max(values.length, 1);
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 18;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ink, #1b2a4a)" strokeWidth={1} />
      {values.map((v, i) => {
        const angle = ((-90 + (i * 360) / n) * Math.PI) / 180;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <g key={i}>
            <rect x={x - 16} y={y - 12} width={32} height={24} fill="#fff" stroke="var(--ink, #1b2a4a)" />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fill="var(--ink, #1b2a4a)">
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
 
/** Цепочка фигур со стрелками между ними, каждая со своим числом (kind="chain"). */
function Chain({ cells, shape = "square" }: { cells: (number | string)[]; shape?: "circle" | "square" | "hexagon" }) {
  const cellSize = 40;
  const gap = 28;
  const width = cells.length * cellSize + (cells.length - 1) * gap + 20;
  const height = 60;
  const cy = height / 2;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      {cells.map((v, i) => {
        const cx = 10 + cellSize / 2 + i * (cellSize + gap);
        const shapeEl =
          shape === "circle" ? (
            <circle cx={cx} cy={cy} r={cellSize / 2} fill="#fff" stroke="var(--ink, #1b2a4a)" />
          ) : shape === "hexagon" ? (
            <polygon
              points={Array.from({ length: 6 }, (_, k) => {
                const a = (Math.PI / 3) * k - Math.PI / 6;
                return `${cx + (cellSize / 2) * Math.cos(a)},${cy + (cellSize / 2) * Math.sin(a)}`;
              }).join(" ")}
              fill="#fff"
              stroke="var(--ink, #1b2a4a)"
            />
          ) : (
            <rect x={cx - cellSize / 2} y={cy - cellSize / 2} width={cellSize} height={cellSize} fill="#fff" stroke="var(--ink, #1b2a4a)" />
          );
        const arrow =
          i < cells.length - 1 ? (
            <line
              x1={cx + cellSize / 2 + 2}
              y1={cy}
              x2={cx + cellSize / 2 + gap - 4}
              y2={cy}
              stroke="var(--pen, #2f5bea)"
              strokeWidth={2}
              markerEnd="url(#chain-arrow)"
            />
          ) : null;
        return (
          <g key={i}>
            {shapeEl}
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fill="var(--ink, #1b2a4a)">
              {v}
            </text>
            {arrow}
          </g>
        );
      })}
      <defs>
        <marker id="chain-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--pen, #2f5bea)" />
        </marker>
      </defs>
    </svg>
  );
}
 
/** Палитра мягких, "учебниковых" цветов заливки для геометрических фигур (fill+stroke подобраны парами). */
const SHAPE_PALETTE = [
  { fill: "#FDE68A", stroke: "#B45309" }, // жёлтый
  { fill: "#BFDBFE", stroke: "#1D4ED8" }, // голубой
  { fill: "#FBCFE8", stroke: "#BE185D" }, // розовый
  { fill: "#BBF7D0", stroke: "#15803D" }, // зелёный
  { fill: "#FED7AA", stroke: "#C2410C" }, // оранжевый
  { fill: "#DDD6FE", stroke: "#6D28D9" }, // фиолетовый
];
function paletteColor(i = 0) {
  return SHAPE_PALETTE[((i % SHAPE_PALETTE.length) + SHAPE_PALETTE.length) % SHAPE_PALETTE.length];
}
 
/** Буквы вершин: для прямоугольника/квадрата "ABCD" — A слева-внизу, B справа-внизу, C справа-вверху, D слева-вверху. */
function CornerNames({ names, pts, stroke }: { names?: string; pts: [number, number][]; stroke: string }) {
  if (!names) return null;
  const off: [number, number][] = [[-12, 16], [12, 16], [12, -6], [-12, -6]];
  return (
    <>
      {pts.map((p, i) => names[i] ? (
        <text key={i} x={p[0] + (off[i] ?? [0, 0])[0]} y={p[1] + (off[i] ?? [0, 0])[1]} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{names[i]}</text>
      ) : null)}
    </>
  );
}
 
/** Прямоугольник с подписанными шириной (сверху) и высотой (слева) (kind="rectangle"). */
function RectShape({ width, height, color = 1, names }: { width?: number | string; height?: number | string; color?: number; names?: string }) {
  const w = 170, h = 104, padL = 58, padR = 34, padT = 34, padB = 34;
  const { fill, stroke } = paletteColor(color);
  return (
    <svg viewBox={`0 0 ${w + padL + padR} ${h + padT + padB}`} width={w + padL + padR} height={h + padT + padB}>
      <rect x={padL} y={padT} width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={2.5} />
      {lbl(width) && <text x={padL + w / 2} y={padT - 11} textAnchor="middle" fontSize={16} fontWeight={700} fill={stroke}>{lbl(width)}</text>}
      {lbl(height) && <text x={padL - 10} y={padT + h / 2 + 5} textAnchor="end" fontSize={16} fontWeight={700} fill={stroke}>{lbl(height)}</text>}
      <CornerNames names={names} stroke={stroke} pts={[[padL, padT + h], [padL + w, padT + h], [padL + w, padT], [padL, padT]]} />
    </svg>
  );
}
 
/** Квадрат с подписанной стороной (сверху и слева) (kind="square"). */
function SquareShape({ side, color = 0, names }: { side?: number | string; color?: number; names?: string }) {
  const s = 128, padL = 58, padR = 34, padT = 34, padB = 34;
  const { fill, stroke } = paletteColor(color);
  return (
    <svg viewBox={`0 0 ${s + padL + padR} ${s + padT + padB}`} width={s + padL + padR} height={s + padT + padB}>
      <rect x={padL} y={padT} width={s} height={s} rx={4} fill={fill} stroke={stroke} strokeWidth={2.5} />
      {lbl(side) && <text x={padL + s / 2} y={padT - 11} textAnchor="middle" fontSize={16} fontWeight={700} fill={stroke}>{lbl(side)}</text>}
      {lbl(side) && <text x={padL - 10} y={padT + s / 2 + 5} textAnchor="end" fontSize={16} fontWeight={700} fill={stroke}>{lbl(side)}</text>}
      <CornerNames names={names} stroke={stroke} pts={[[padL, padT + s], [padL + s, padT + s], [padL + s, padT], [padL, padT]]} />
    </svg>
  );
}
 
/** Треугольник с тремя подписанными сторонами (kind="triangle").
 *  Если right задан (любой из "A"|"B"|"C" — просто флаг "это прямоугольный треугольник"),
 *  рисуется прямоугольный треугольник: a и b — катеты (вертикальный и горизонтальный), c — гипотенуза.
 *  Если right не задан — рисуется обычный (равнобедренный на вид) треугольник: a — основание (низ), b — левая сторона, c — правая сторона. */
function TriangleShape({ a, b, c, right, color = 2, names }: { a?: number | string; b?: number | string; c?: number | string; right?: "A" | "B" | "C"; color?: number; names?: string }) {
  const w = 190, h = 136, pad = 34;
  const { fill, stroke } = paletteColor(color);
  if (right) {
    const pTop = [pad, pad], pBL = [pad, pad + h], pBR = [pad + w, pad + h];
    const points = `${pTop[0]},${pTop[1]} ${pBL[0]},${pBL[1]} ${pBR[0]},${pBR[1]}`;
    return (
      <svg viewBox={`0 0 ${w + pad * 2} ${h + pad * 2}`} width={w + pad * 2} height={h + pad * 2}>
        <polygon points={points} fill={fill} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
        <rect x={pTop[0]} y={pTop[1]} width={14} height={14} fill="none" stroke={stroke} strokeWidth={2} />
        {names && <text x={pTop[0] + 2} y={pTop[1] - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{names[0]}</text>}
        {names && <text x={pBL[0] - 2} y={pBL[1] + 18} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{names[1]}</text>}
        {names && <text x={pBR[0] + 10} y={pBR[1] + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{names[2]}</text>}
        {lbl(a) && <text x={pTop[0] - 12} y={(pTop[1] + pBL[1]) / 2} textAnchor="end" fontSize={16} fontWeight={700} fill={stroke}>{lbl(a)}</text>}
        {lbl(b) && <text x={(pBL[0] + pBR[0]) / 2} y={pBL[1] + 24} textAnchor="middle" fontSize={16} fontWeight={700} fill={stroke}>{lbl(b)}</text>}
        {lbl(c) && <text x={(pTop[0] + pBR[0]) / 2 + 16} y={(pTop[1] + pBR[1]) / 2 - 2} textAnchor="start" fontSize={16} fontWeight={700} fill={stroke}>{lbl(c)}</text>}
      </svg>
    );
  }
  const Ax = pad + w * 0.35, Ay = pad;
  const Bx = pad, By = pad + h;
  const Cx = pad + w, Cy = pad + h;
  return (
    <svg viewBox={`0 0 ${w + pad * 2} ${h + pad * 2}`} width={w + pad * 2} height={h + pad * 2}>
      <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill={fill} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      {lbl(a) && <text x={(Bx + Cx) / 2} y={By + 24} textAnchor="middle" fontSize={16} fontWeight={700} fill={stroke}>{lbl(a)}</text>}
      {lbl(b) && <text x={(Ax + Bx) / 2 - 14} y={(Ay + By) / 2} textAnchor="end" fontSize={16} fontWeight={700} fill={stroke}>{lbl(b)}</text>}
      {lbl(c) && <text x={(Ax + Cx) / 2 + 14} y={(Ay + Cy) / 2} textAnchor="start" fontSize={16} fontWeight={700} fill={stroke}>{lbl(c)}</text>}
      {names && <text x={Ax} y={Ay - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{names[0]}</text>}
      {names && <text x={Bx - 12} y={By + 4} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{names[1]}</text>}
      {names && <text x={Cx + 12} y={Cy + 4} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{names[2]}</text>}
    </svg>
  );
}
 
/** Круг с подписанным радиусом и/или диаметром (kind="circle_measure").
 *  square="in"  — дополнительно рисует квадрат, вписанный В круг (вершины на окружности).
 *  square="out" — дополнительно рисует квадрат, ОПИСАННЫЙ вокруг круга (круг вписан в квадрат). */
function CircleMeasure({
  radius, diameter, square, color = 1,
}: { radius?: number | string; diameter?: number | string; square?: "in" | "out"; color?: number }) {
  const r = 78, pad = square === "out" ? 20 : 30;
  const size = r * 2;
  const cx = pad + r, cy = pad + r;
  const { fill, stroke } = paletteColor(color);
  const sqColor = paletteColor(color + 1);
  return (
    <svg viewBox={`0 0 ${size + pad * 2} ${size + pad * 2}`} width={size + pad * 2} height={size + pad * 2}>
      {square === "out" && (
        <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="none" stroke={sqColor.stroke} strokeWidth={2.5} />
      )}
      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.65} stroke={stroke} strokeWidth={2.5} />
      {square === "in" && (
        <polygon
          points={[[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]].map((p) => p.join(",")).join(" ")}
          fill="none" stroke={sqColor.stroke} strokeWidth={2.5}
        />
      )}
      {lbl(radius) !== null && (
        <>
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={stroke} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={3.5} fill={stroke} />
          <text x={cx + r / 2} y={cy - 10} textAnchor="middle" fontSize={15} fontWeight={700} fill={stroke}>{lbl(radius)}</text>
        </>
      )}
      {lbl(diameter) !== null && (
        <>
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={stroke} strokeWidth={2.5} />
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize={15} fontWeight={700} fill={stroke}>{lbl(diameter)}</text>
        </>
      )}
    </svg>
  );
}
 
/** Произвольная прямоугольная ("ступенчатая") фигура, заданная последовательностью ходов
 *  (R/L/U/D + длина в условных клетках + подпись). Контур замыкается автоматически (kind="path_shape").
 *  Подписи ставятся с внешней стороны контура. */
function PathShape({
  moves, color = 3,
}: { moves: { dir: "R" | "L" | "U" | "D"; len: number; label?: string }[]; color?: number }) {
  const scale = 24;
  let x = 0, y = 0;
  const points: [number, number][] = [[0, 0]];
  const segs: { mx: number; my: number; text: string; vertical: boolean }[] = [];
  for (const m of moves) {
    const dx = m.dir === "R" ? m.len : m.dir === "L" ? -m.len : 0;
    const dy = m.dir === "D" ? m.len : m.dir === "U" ? -m.len : 0;
    const nx = x + dx, ny = y + dy;
    const t = lbl(m.label);
    if (t) segs.push({ mx: (x + nx) / 2, my: (y + ny) / 2, text: t, vertical: dx === 0 });
    x = nx; y = ny;
    points.push([x, y]);
  }
  const inside = (px: number, py: number) => {
    let c = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i], [xj, yj] = points[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const padUnits = 1.6, padX = 3.2;
  const gw = maxX - minX + padX * 2, gh = maxY - minY + padUnits * 2;
  const toSvg = (p: [number, number]): [number, number] => [(p[0] - minX + padX) * scale, (p[1] - minY + padUnits) * scale];
  const { fill, stroke } = paletteColor(color);
  const W = gw * scale, H = gh * scale;
  const dispW = Math.min(W, 360);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={dispW} height={(dispW * H) / W}>
      <polygon points={points.map((p) => toSvg(p).join(",")).join(" ")} fill={fill} fillOpacity={0.6} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      {segs.map((l, i) => {
        const e = 0.25;
        let tx = l.mx, ty = l.my, anchor: "middle" | "start" | "end" = "middle";
        if (l.vertical) {
          const rightOut = !inside(l.mx + e, l.my);
          anchor = rightOut ? "start" : "end";
          tx = l.mx + (rightOut ? 0.45 : -0.45); ty = l.my + 0.2;
        } else {
          const upOut = !inside(l.mx, l.my - e);
          ty = l.my + (upOut ? -0.45 : 0.95);
        }
        const [sx, sy] = toSvg([tx, ty]);
        return <text key={i} x={sx} y={sy} textAnchor={anchor} fontSize={13} fontWeight={700} fill={stroke}>{l.text}</text>;
      })}
    </svg>
  );
}
 
/** Подпись допустима, только если она задана и не «?» (знаков вопроса на рисунках не рисуем). */
function lbl(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (s === "" || s === "?") return null;
  return s;
}
 
/** Прямоугольный параллелепипед в псевдо-3D (kind="box3d"): три видимые грани + штриховые невидимые рёбра.
 *  units=[x,y,z] — сетка единичных кубиков на всех трёх видимых гранях (x — по ширине, y — по глубине, z — по высоте). */
function Box3D({
  width, height, depth, units, color = 1,
}: { width?: number | string; height?: number | string; depth?: number | string; units?: [number, number, number]; color?: number }) {
  const num = (v: unknown): number | null => {
    const m = String(v ?? "").replace(",", ".").match(/\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  };
  // пропорции: из units (ширина, глубина, высота в кубиках), иначе из чисел в подписях, иначе по умолчанию
  let rw = 1.4, rh = 1, rd = 0.9;
  if (units) { rw = units[0]; rd = units[1]; rh = units[2]; }
  else { const nw = num(width), nh = num(height), nd = num(depth); if (nw && nh && nd) { rw = nw; rh = nh; rd = nd; } }
  const k = 140 / Math.max(rw, rh * 1.15, rd * 1.3);
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const W = clamp(rw * k, 40, 150), H = clamp(rh * k, 34, 120), D = clamp(rd * k, 30, 100);
  const pad = 26, lab = 44;
  const skx = D * 0.55, sky = D * 0.4;
  const { fill, stroke } = paletteColor(color);
  const FBL: [number, number] = [pad, pad + sky + H];
  const FBR: [number, number] = [pad + W, pad + sky + H];
  const FTR: [number, number] = [pad + W, pad + sky];
  const FTL: [number, number] = [pad, pad + sky];
  const sh = (p: [number, number]): [number, number] => [p[0] + skx, p[1] - sky];
  const BBL = sh(FBL), BBR = sh(FBR), BTR = sh(FTR), BTL = sh(FTL);
  const pts = (a: [number, number][]) => a.map((p) => p.join(",")).join(" ");
  const totalW = W + skx + pad * 2 + lab, totalH = H + sky + pad * 2 + 8;
  const [ux, uy, uz] = units ?? [0, 0, 0];
  const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const g: React.ReactNode[] = [];
  const gl = (k: string, a: [number, number], b: [number, number]) => (
    <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={stroke} strokeWidth={1.2} opacity={0.6} />
  );
  if (units) {
    for (let i = 1; i < ux; i++) { const t = i / ux; g.push(gl(`fv${i}`, lerp(FBL, FBR, t), lerp(FTL, FTR, t))); g.push(gl(`tv${i}`, lerp(FTL, FTR, t), lerp(BTL, BTR, t))); }
    for (let i = 1; i < uz; i++) { const t = i / uz; g.push(gl(`fh${i}`, lerp(FBL, FTL, t), lerp(FBR, FTR, t))); g.push(gl(`rh${i}`, lerp(FBR, FTR, t), lerp(BBR, BTR, t))); }
    for (let i = 1; i < uy; i++) { const t = i / uy; g.push(gl(`th${i}`, lerp(FTL, BTL, t), lerp(FTR, BTR, t))); g.push(gl(`rv${i}`, lerp(FBR, BBR, t), lerp(FTR, BTR, t))); }
  }
  const wl = lbl(width), hl = lbl(height), dl = lbl(depth);
  const tx = { fontSize: 14, fontWeight: 700, fill: stroke } as const;
  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} width={totalW} height={totalH}>
      <polygon points={pts([FTL, FTR, BTR, BTL])} fill={fill} opacity={0.8} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={pts([FBR, FTR, BTR, BBR])} fill={fill} opacity={0.55} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={pts([FBL, FBR, FTR, FTL])} fill={fill} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      {g}
      {/* невидимые рёбра */}
      <g stroke={stroke} strokeWidth={1.5} strokeDasharray="4 4" fill="none" opacity={0.7}>
        <line x1={FBL[0]} y1={FBL[1]} x2={BBL[0]} y2={BBL[1]} />
        <line x1={BBL[0]} y1={BBL[1]} x2={BBR[0]} y2={BBR[1]} />
        <line x1={BBL[0]} y1={BBL[1]} x2={BTL[0]} y2={BTL[1]} />
      </g>
      {wl && <text x={(FBL[0] + FBR[0]) / 2} y={FBL[1] + 20} textAnchor="middle" {...tx}>{wl}</text>}
      {dl && <text x={(FBR[0] + BBR[0]) / 2 + 12} y={(FBR[1] + BBR[1]) / 2 + 16} textAnchor="start" {...tx}>{dl}</text>}
      {hl && <text x={BBR[0] + 10} y={(BBR[1] + BTR[1]) / 2 + 5} textAnchor="start" {...tx}>{hl}</text>}
    </svg>
  );
}
 
/** Универсальный «холст» (kind="scene"): рисунок из примитивов в клетках (x вправо, y вниз), чтобы повторять
 *  картинки учебника. scale — пикселей на клетку (по умолчанию 26). Цвет — индекс палитры 0-5 или hex. */
type SceneItem =
  | { t: "rect"; x: number; y: number; w: number; h: number; fill?: number | string | null; dash?: boolean; label?: string }
  | { t: "poly"; pts: [number, number][]; fill?: number | string | null; dash?: boolean; open?: boolean }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; dash?: boolean; color?: number | string }
  | { t: "circle"; cx: number; cy: number; r: number; fill?: number | string | null; dash?: boolean }
  | { t: "sector"; cx: number; cy: number; r: number; a0: number; a1: number; fill?: number | string | null }
  | { t: "arc"; cx: number; cy: number; r: number; a0: number; a1: number; color?: number | string; w?: number }
  | { t: "path"; d: string; fill?: number | string | null; dash?: boolean; color?: number | string; w?: number }
  | { t: "right"; x: number; y: number; dx?: 1 | -1; dy?: 1 | -1 }
  | { t: "text"; x: number; y: number; s: string; anchor?: "start" | "middle" | "end"; color?: number | string; size?: number };
 
function sceneColor(c: number | string | null | undefined, def: number): { fill: string; stroke: string } {
  if (typeof c === "string") return { fill: c, stroke: c };
  return paletteColor(typeof c === "number" ? c : def);
}
 
function Scene({ width, height, items, scale = 26, color = 1 }: { width: number; height: number; items: SceneItem[]; scale?: number; color?: number }) {
  const padX = 56, padY = 34;
  const S = (v: number) => v * scale;
  const W = S(width) + padX * 2, H = S(height) + padY * 2;
  const base = paletteColor(color);
  const P = (x: number, y: number) => `${padX + S(x)},${padY + S(y)}`;
  const polar = (cx: number, cy: number, r: number, a: number): [number, number] => {
    const rad = ((a - 90) * Math.PI) / 180; // 0° — вверх, по часовой
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {items.map((it, i) => {
        const dash = (it as { dash?: boolean }).dash ? "5 4" : undefined;
        if (it.t === "rect") {
          const c = it.fill === null ? null : sceneColor(it.fill, color);
          return (
            <g key={i}>
              <rect x={padX + S(it.x)} y={padY + S(it.y)} width={S(it.w)} height={S(it.h)} fill={c ? c.fill : "none"} fillOpacity={c ? 0.75 : 1} stroke={base.stroke} strokeWidth={2.2} strokeDasharray={dash} strokeLinejoin="round" />
              {it.label && <text x={padX + S(it.x + it.w / 2)} y={padY + S(it.y + it.h / 2) + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={base.stroke}>{it.label}</text>}
            </g>
          );
        }
        if (it.t === "poly") {
          const c = it.fill === null ? null : sceneColor(it.fill, color);
          const pts = it.pts.map((p) => P(p[0], p[1])).join(" ");
          return it.open
            ? <polyline key={i} points={pts} fill="none" stroke={base.stroke} strokeWidth={2.2} strokeDasharray={dash} strokeLinejoin="round" />
            : <polygon key={i} points={pts} fill={c ? c.fill : "none"} fillOpacity={c ? 0.75 : 1} stroke={base.stroke} strokeWidth={2.2} strokeDasharray={dash} strokeLinejoin="round" />;
        }
        if (it.t === "line") {
          const c = it.color !== undefined ? sceneColor(it.color, color).stroke : base.stroke;
          return <line key={i} x1={padX + S(it.x1)} y1={padY + S(it.y1)} x2={padX + S(it.x2)} y2={padY + S(it.y2)} stroke={c} strokeWidth={2} strokeDasharray={dash} />;
        }
        if (it.t === "circle") {
          const c = it.fill === null ? null : sceneColor(it.fill, color);
          return <circle key={i} cx={padX + S(it.cx)} cy={padY + S(it.cy)} r={S(it.r)} fill={c ? c.fill : "none"} fillOpacity={c ? 0.7 : 1} stroke={base.stroke} strokeWidth={2.2} strokeDasharray={dash} />;
        }
        if (it.t === "sector" || it.t === "arc") {
          const [x0, y0] = polar(it.cx, it.cy, it.r, it.a0);
          const [x1, y1] = polar(it.cx, it.cy, it.r, it.a1);
          const large = ((it.a1 - it.a0 + 360) % 360) > 180 ? 1 : 0;
          const d = it.t === "sector"
            ? `M ${P(it.cx, it.cy)} L ${P(x0, y0)} A ${S(it.r)} ${S(it.r)} 0 ${large} 1 ${P(x1, y1)} Z`
            : `M ${P(x0, y0)} A ${S(it.r)} ${S(it.r)} 0 ${large} 1 ${P(x1, y1)}`;
          const c = it.t === "sector" ? (it.fill === null ? null : sceneColor(it.fill, color)) : null;
          const sc = it.t === "arc" && it.color !== undefined ? sceneColor(it.color, color).stroke : base.stroke;
          const sw = it.t === "arc" && it.w ? it.w : 2.2;
          return <path key={i} d={d} fill={c ? c.fill : "none"} fillOpacity={c ? 0.75 : 1} stroke={sc} strokeWidth={sw} strokeLinecap="round" />;
        }
        if (it.t === "path") {
          // d — абсолютные команды M/L/A/Z в клетках: переводим в пиксели
          const tk = it.d.match(/[MLAZ]|-?\d*\.?\d+/g) ?? [];
          const out: string[] = [];
          for (let k = 0; k < tk.length; ) {
            const cmd = tk[k];
            if (cmd === "Z") { out.push("Z"); k++; }
            else if (cmd === "M" || cmd === "L") { out.push(`${cmd} ${P(+tk[k + 1], +tk[k + 2])}`); k += 3; }
            else if (cmd === "A") { out.push(`A ${S(+tk[k + 1])} ${S(+tk[k + 2])} ${tk[k + 3]} ${tk[k + 4]} ${tk[k + 5]} ${P(+tk[k + 6], +tk[k + 7])}`); k += 8; }
            else k++;
          }
          const c = it.fill === undefined || it.fill === null ? null : sceneColor(it.fill, color);
          const sc = it.color !== undefined ? sceneColor(it.color, color).stroke : base.stroke;
          return <path key={i} d={out.join(" ")} fill={c ? c.fill : "none"} fillOpacity={c ? 0.75 : 1} stroke={sc} strokeWidth={it.w ?? 2.2} strokeDasharray={dash} strokeLinejoin="round" strokeLinecap="round" />;
        }
        if (it.t === "right") {
          const dx = it.dx ?? 1, dy = it.dy ?? 1, m = 0.35;
          return <polyline key={i} points={`${P(it.x + dx * m, it.y)} ${P(it.x + dx * m, it.y + dy * m)} ${P(it.x, it.y + dy * m)}`} fill="none" stroke={base.stroke} strokeWidth={1.6} />;
        }
        const c = it.color !== undefined ? sceneColor(it.color, color).stroke : base.stroke;
        return <text key={i} x={padX + S(it.x)} y={padY + S(it.y)} textAnchor={it.anchor ?? "middle"} fontSize={it.size ?? 14} fontWeight={700} fill={c}>{it.s}</text>;
      })}
    </svg>
  );
}
 
/** Пять чисел вокруг центра (kind="cross") — "Связь между числами и фигурами" в логике. Любая
 *  позиция может быть "?" — неизвестное, которое должен найти ученик (эталон на клиент не уходит). */
function NumberCross({
  top, left, center, right, bottom,
}: { top: number | string; left: number | string; center: number | string; right: number | string; bottom: number | string }) {
  const size = 120;
  const cell = 34;
  const cx = size / 2;
  const cy = size / 2;
  const box = (x: number, y: number, val: number | string, bold?: boolean) => (
    <g key={`${x}-${y}`}>
      <rect x={x - cell / 2} y={y - cell / 2} width={cell} height={cell} fill="#fff" stroke="var(--ink, #1b2a4a)" strokeWidth={bold ? 2 : 1} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={bold ? 700 : 400} fill="var(--ink, #1b2a4a)">
        {val}
      </text>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {box(cx, cy - cell, top)}
      {box(cx - cell, cy, left)}
      {box(cx, cy, center, true)}
      {box(cx + cell, cy, right)}
      {box(cx, cy + cell, bottom)}
    </svg>
  );
}
 
/**
 * Диспетчер по spec.kind → параметрический SVG/таблица (шаг 6). kind="placeholder" сюда
 * долетать не должно для задач (их прячет hasPendingFigure), но может попасться внутри
 * блока объяснения темы — на этот случай оставлена текстовая заглушка.
 */
export function Figure({ spec }: { spec: FigureSpec }) {
  const caption = typeof spec.caption === "string" ? spec.caption : undefined;
 
  let content: React.ReactNode;
  switch (spec.kind) {
    case "fraction_bar":
      content = <FractionBar parts={Number(spec.parts) || 1} shaded={(spec.shaded as number[]) ?? []} />;
      break;
    case "circle":
      content = <FractionCircle parts={Number(spec.parts) || 1} shaded={(spec.shaded as number[]) ?? []} />;
      break;
    case "grid":
      content = (
        <FractionGrid
          rows={Number(spec.rows) || 1}
          cols={Number(spec.cols) || 1}
          shaded={(spec.shaded as [number, number][]) ?? []}
        />
      );
      break;
    case "number_line":
      content = (
        <NumberLine
          from={Number(spec.from) || 0}
          to={Number(spec.to) || 1}
          divisions={Number(spec.divisions) || 1}
          marks={(spec.marks as { at: number | [number, number]; label?: string }[]) ?? []}
        />
      );
      break;
    case "table":
      content = <FigureTableEl rows={(spec.rows as string[][]) ?? []} />;
      break;
    case "circle_numbers":
      content = <CircleNumbers values={(spec.values as (number | string)[]) ?? []} />;
      break;
    case "chain":
      content = <Chain cells={(spec.cells as (number | string)[]) ?? []} shape={spec.shape as "circle" | "square" | "hexagon" | undefined} />;
      break;
    case "rectangle":
      content = <RectShape width={spec.width as number | string} height={spec.height as number | string} color={spec.color as number | undefined} names={spec.names as string | undefined} />;
      break;
    case "square":
      content = <SquareShape side={spec.side as number | string} color={spec.color as number | undefined} names={spec.names as string | undefined} />;
      break;
    case "triangle":
      content = <TriangleShape a={spec.a as number | string} b={spec.b as number | string} c={spec.c as number | string} right={spec.right as "A" | "B" | "C" | undefined} color={spec.color as number | undefined} names={spec.names as string | undefined} />;
      break;
    case "circle_measure":
      content = (
        <CircleMeasure
          radius={spec.radius as number | string | undefined}
          diameter={spec.diameter as number | string | undefined}
          square={spec.square as "in" | "out" | undefined}
          color={spec.color as number | undefined}
        />
      );
      break;
    case "path_shape":
      content = <PathShape moves={spec.moves as { dir: "R" | "L" | "U" | "D"; len: number; label?: string }[]} color={spec.color as number | undefined} />;
      break;
    case "scene":
      content = (
        <Scene
          width={spec.width as number}
          height={spec.height as number}
          items={spec.items as SceneItem[]}
          scale={spec.scale as number | undefined}
          color={spec.color as number | undefined}
        />
      );
      break;
    case "box3d":
      content = (
        <Box3D
          width={spec.width as number | string | undefined}
          height={spec.height as number | string | undefined}
          depth={spec.depth as number | string | undefined}
          units={spec.units as [number, number, number] | undefined}
          color={spec.color as number | undefined}
        />
      );
      break;
    case "cross":
      content = (
        <NumberCross
          top={spec.top as number | string}
          left={spec.left as number | string}
          center={spec.center as number | string}
          right={spec.right as number | string}
          bottom={spec.bottom as number | string}
        />
      );
      break;
    case "placeholder": {
      const description = typeof spec.description === "string" ? spec.description : undefined;
      return <div className={ui.figure}>Рисунок в разработке{description ? `: ${description}` : ""}</div>;
    }
    default:
      content = `Рисунок: ${spec.kind}`;
  }
 
  return (
    <div className={ui.figureBox}>
      {content}
      {caption && <div className={ui.muted}>{renderRichInline(caption, "cap")}</div>}
    </div>
  );
}
