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

/** Прямоугольник с подписанными шириной и высотой (kind="rectangle"). */
function RectShape({ width, height, color = 1 }: { width?: number | string; height?: number | string; color?: number }) {
  const w = 170, h = 104, pad = 34;
  const { fill, stroke } = paletteColor(color);
  return (
    <svg viewBox={`0 0 ${w + pad * 2} ${h + pad * 2}`} width={w + pad * 2} height={h + pad * 2}>
      <rect x={pad} y={pad} width={w} height={h} rx={5} fill={fill} stroke={stroke} strokeWidth={2.5} />
      <text x={pad + w / 2} y={pad - 11} textAnchor="middle" fontSize={16} fontWeight={700} fill={stroke}>{width}</text>
      <text x={pad + w + 16} y={pad + h / 2 + 5} textAnchor="start" fontSize={16} fontWeight={700} fill={stroke}>{height}</text>
    </svg>
  );
}

/** Квадрат с подписанной стороной (kind="square"). */
function SquareShape({ side, color = 0 }: { side: number | string; color?: number }) {
  const s = 128, pad = 34;
  const { fill, stroke } = paletteColor(color);
  return (
    <svg viewBox={`0 0 ${s + pad * 2} ${s + pad * 2}`} width={s + pad * 2} height={s + pad * 2}>
      <rect x={pad} y={pad} width={s} height={s} rx={5} fill={fill} stroke={stroke} strokeWidth={2.5} />
      <text x={pad + s / 2} y={pad - 11} textAnchor="middle" fontSize={16} fontWeight={700} fill={stroke}>{side}</text>
      <text x={pad + s + 16} y={pad + s / 2 + 5} textAnchor="start" fontSize={16} fontWeight={700} fill={stroke}>{side}</text>
    </svg>
  );
}

/** Треугольник с тремя подписанными сторонами (kind="triangle").
 *  Если right задан (любой из "A"|"B"|"C" — просто флаг "это прямоугольный треугольник"),
 *  рисуется прямоугольный треугольник: a и b — катеты (вертикальный и горизонтальный), c — гипотенуза.
 *  Если right не задан — рисуется обычный (равнобедренный на вид) треугольник: a — основание (низ), b — левая сторона, c — правая сторона. */
function TriangleShape({ a, b, c, right, color = 2 }: { a: number | string; b: number | string; c: number | string; right?: "A" | "B" | "C"; color?: number }) {
  const w = 190, h = 136, pad = 34;
  const { fill, stroke } = paletteColor(color);
  if (right) {
    const pTop = [pad, pad], pBL = [pad, pad + h], pBR = [pad + w, pad + h];
    const points = `${pTop[0]},${pTop[1]} ${pBL[0]},${pBL[1]} ${pBR[0]},${pBR[1]}`;
    return (
      <svg viewBox={`0 0 ${w + pad * 2} ${h + pad * 2}`} width={w + pad * 2} height={h + pad * 2}>
        <polygon points={points} fill={fill} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
        <rect x={pTop[0]} y={pTop[1]} width={14} height={14} fill="none" stroke={stroke} strokeWidth={2} />
        <text x={pTop[0] - 12} y={(pTop[1] + pBL[1]) / 2} textAnchor="end" fontSize={16} fontWeight={700} fill={stroke}>{a}</text>
        <text x={(pBL[0] + pBR[0]) / 2} y={pBL[1] + 24} textAnchor="middle" fontSize={16} fontWeight={700} fill={stroke}>{b}</text>
        <text x={(pTop[0] + pBR[0]) / 2 + 16} y={(pTop[1] + pBR[1]) / 2 - 2} textAnchor="start" fontSize={16} fontWeight={700} fill={stroke}>{c}</text>
      </svg>
    );
  }
  const Ax = pad + w * 0.35, Ay = pad;
  const Bx = pad, By = pad + h;
  const Cx = pad + w, Cy = pad + h;
  return (
    <svg viewBox={`0 0 ${w + pad * 2} ${h + pad * 2}`} width={w + pad * 2} height={h + pad * 2}>
      <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill={fill} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      <text x={(Bx + Cx) / 2} y={By + 24} textAnchor="middle" fontSize={16} fontWeight={700} fill={stroke}>{a}</text>
      <text x={(Ax + Bx) / 2 - 14} y={(Ay + By) / 2} textAnchor="end" fontSize={16} fontWeight={700} fill={stroke}>{b}</text>
      <text x={(Ax + Cx) / 2 + 14} y={(Ay + Cy) / 2} textAnchor="start" fontSize={16} fontWeight={700} fill={stroke}>{c}</text>
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
      {radius !== undefined && (
        <>
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={stroke} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={3.5} fill={stroke} />
          <text x={cx + r / 2} y={cy - 10} textAnchor="middle" fontSize={15} fontWeight={700} fill={stroke}>{radius}</text>
        </>
      )}
      {diameter !== undefined && (
        <>
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={stroke} strokeWidth={2.5} />
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize={15} fontWeight={700} fill={stroke}>{diameter}</text>
        </>
      )}
    </svg>
  );
}

/** Произвольная прямоугольная ("ступенчатая") фигура, заданная последовательностью ходов
 *  (как черепашья графика: R/L/U/D + длина в условных клетках + подпись). Контур автоматически
 *  замыкается последним сегментом обратно в начальную точку (kind="path_shape"). */
function PathShape({
  moves, color = 3,
}: { moves: { dir: "R" | "L" | "U" | "D"; len: number; label?: string }[]; color?: number }) {
  const scale = 24;
  let x = 0, y = 0;
  const points: [number, number][] = [[0, 0]];
  const labels: { x: number; y: number; text: string; vertical: boolean }[] = [];
  for (const m of moves) {
    const dx = m.dir === "R" ? m.len : m.dir === "L" ? -m.len : 0;
    const dy = m.dir === "D" ? m.len : m.dir === "U" ? -m.len : 0;
    const nx = x + dx, ny = y + dy;
    if (m.label) labels.push({ x: (x + nx) / 2, y: (y + ny) / 2, text: m.label, vertical: dx === 0 });
    x = nx; y = ny;
    points.push([x, y]);
  }
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const padUnits = 1.4;
  const gw = maxX - minX + padUnits * 2, gh = maxY - minY + padUnits * 2;
  const toSvg = (p: [number, number]): [number, number] => [(p[0] - minX + padUnits) * scale, (p[1] - minY + padUnits) * scale];
  const { fill, stroke } = paletteColor(color);
  const W = gw * scale, H = gh * scale;
  const dispW = Math.min(W, 340);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={dispW} height={(dispW * H) / W}>
      <polygon points={points.map((p) => toSvg(p).join(",")).join(" ")} fill={fill} fillOpacity={0.6} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      {labels.map((l, i) => {
        const [sx, sy] = toSvg([l.x, l.y]);
        return (
          <text
            key={i}
            x={sx + (l.vertical ? 16 : 0)}
            y={sy + (l.vertical ? 4 : -8)}
            textAnchor="middle"
            fontSize={13}
            fontWeight={700}
            fill={stroke}
          >
            {l.text}
          </text>
        );
      })}
    </svg>
  );
}

/** Прямоугольный параллелепипед в псевдо-3D с подписанными шириной/высотой/глубиной (kind="box3d").
 *  Если units=[x,y,z] задан — на трёх видимых гранях рисуется сетка единичных кубиков (вместо подписей размеров). */
function Box3D({
  width, height, depth, units, color = 1,
}: { width?: number | string; height?: number | string; depth?: number | string; units?: [number, number, number]; color?: number }) {
  const W = 130, H = 90, D = 58, pad = 28;
  const skx = D * 0.62, sky = D * 0.42;
  const ox = pad + skx, oy = pad + H + sky;
  const FBL: [number, number] = [ox, oy];
  const FBR: [number, number] = [ox + W, oy];
  const FTR: [number, number] = [ox + W, oy - H];
  const FTL: [number, number] = [ox, oy - H];
  const BTL: [number, number] = [ox - skx, oy - H - sky];
  const BTR: [number, number] = [ox + W - skx, oy - H - sky];
  const BBR: [number, number] = [ox + W - skx, oy - sky];
  const { fill, stroke } = paletteColor(color);
  const darker = paletteColor(color).stroke;
  const totalW = W + skx + pad * 2, totalH = H + sky + pad * 2;
  const [ux, uy, uz] = units ?? [0, 0, 0];
  const gridLines: React.ReactNode[] = [];
  if (units) {
    for (let i = 1; i < ux; i++) {
      const t = i / ux;
      gridLines.push(<line key={`f-v-${i}`} x1={FBL[0] + t * W} y1={FBL[1]} x2={FTL[0] + t * W} y2={FTL[1]} stroke={darker} strokeWidth={1} opacity={0.5} />);
    }
    for (let i = 1; i < uz; i++) {
      const t = i / uz;
      gridLines.push(<line key={`f-h-${i}`} x1={FBL[0]} y1={FBL[1] - t * H} x2={FBR[0]} y2={FBR[1] - t * H} stroke={darker} strokeWidth={1} opacity={0.5} />);
    }
    for (let i = 1; i < uy; i++) {
      const t = i / uy;
      const bx = FTL[0] + (BTL[0] - FTL[0]) * t, by = FTL[1] + (BTL[1] - FTL[1]) * t;
      const fx = FTR[0] + (BTR[0] - FTR[0]) * t, fy = FTR[1] + (BTR[1] - FTR[1]) * t;
      gridLines.push(<line key={`t-${i}`} x1={bx} y1={by} x2={fx} y2={fy} stroke={darker} strokeWidth={1} opacity={0.5} />);
    }
  }
  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} width={totalW} height={totalH}>
      <polygon points={[FTL, FTR, BTR, BTL].map((p) => p.join(",")).join(" ")} fill={fill} opacity={0.85} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={[FBR, FTR, BTR, BBR].map((p) => p.join(",")).join(" ")} fill={fill} opacity={0.55} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={[FBL, FBR, FTR, FTL].map((p) => p.join(",")).join(" ")} fill={fill} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      {gridLines}
      {width !== undefined && <text x={(FBL[0] + FBR[0]) / 2} y={FBL[1] + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{width}</text>}
      {height !== undefined && <text x={FBR[0] + 14} y={(FBR[1] + FTR[1]) / 2 + 5} textAnchor="start" fontSize={14} fontWeight={700} fill={stroke}>{height}</text>}
      {depth !== undefined && <text x={(FTR[0] + BTR[0]) / 2 + 8} y={(FTR[1] + BTR[1]) / 2 - 8} textAnchor="start" fontSize={14} fontWeight={700} fill={stroke}>{depth}</text>}
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
      content = <RectShape width={spec.width as number | string} height={spec.height as number | string} color={spec.color as number | undefined} />;
      break;
    case "square":
      content = <SquareShape side={spec.side as number | string} color={spec.color as number | undefined} />;
      break;
    case "triangle":
      content = <TriangleShape a={spec.a as number | string} b={spec.b as number | string} c={spec.c as number | string} right={spec.right as "A" | "B" | "C" | undefined} color={spec.color as number | undefined} />;
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
