import type { FigureSpec } from "@/lib/content/types";
import ui from "@/components/student/ui.module.css";

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
      {caption && <div className={ui.muted}>{caption}</div>}
    </div>
  );
}
