/**
 * Служебный инструмент: рисует рисунки kind=scene из темы в PNG-листы, чтобы их можно было посмотреть глазами.
 * npx tsx prisma/seed/tools-render.ts <v2-файл темы> <папка вывода> [kk-файл]
 * Листы: <папка>/sheet-1.png, sheet-2.png … (по 8 рисунков, подпись — задача p:<n> / t:<n>). Если указан kk-файл —
 * рисуются только казахские варианты рисунков (task.figure в kk), чтобы проверить переведённые подписи.
 * Нужен headless chromium (PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers).
 */
import { mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import type { Figure, SeedTopic } from "./types";

const PAL = [
  { fill: "#FDE68A", stroke: "#B45309" }, { fill: "#BFDBFE", stroke: "#1D4ED8" }, { fill: "#FBCFE8", stroke: "#BE185D" },
  { fill: "#BBF7D0", stroke: "#15803D" }, { fill: "#FED7AA", stroke: "#C2410C" }, { fill: "#DDD6FE", stroke: "#6D28D9" },
];
const pal = (i = 0) => PAL[((i % PAL.length) + PAL.length) % PAL.length];
const sc = (c: unknown, def: number) => (typeof c === "string" ? { fill: c, stroke: c } : pal(typeof c === "number" ? c : def));
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** Копия рисовалки Scene из src/components/content/Figure.tsx в виде строки SVG (держать в синхроне при правках). */
function sceneSvg(f: Extract<Figure, { kind: "scene" }>): string {
  const scale = f.scale ?? 26, color = f.color ?? 1, padX = 56, padY = 34;
  const S = (v: number) => v * scale;
  const W = S(f.width) + padX * 2, H = S(f.height) + padY * 2;
  const base = pal(color);
  const P = (x: number, y: number) => `${padX + S(x)},${padY + S(y)}`;
  const polar = (cx: number, cy: number, r: number, a: number): [number, number] => {
    const rad = ((a - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const out: string[] = [];
  for (const raw of f.items) {
    const it = raw as any;
    const dash = it.dash ? ` stroke-dasharray="5 4"` : "";
    if (it.t === "rect") {
      const c = it.fill === null ? null : sc(it.fill, color);
      out.push(`<rect x="${padX + S(it.x)}" y="${padY + S(it.y)}" width="${S(it.w)}" height="${S(it.h)}" fill="${c ? c.fill : "none"}" fill-opacity="${c ? 0.75 : 1}" stroke="${base.stroke}" stroke-width="2.2"${dash}/>`);
      if (it.label) out.push(`<text x="${padX + S(it.x + it.w / 2)}" y="${padY + S(it.y + it.h / 2) + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="${base.stroke}">${esc(String(it.label))}</text>`);
    } else if (it.t === "poly") {
      const c = it.fill === null ? null : sc(it.fill, color);
      const pts = it.pts.map((p: number[]) => P(p[0], p[1])).join(" ");
      out.push(it.open
        ? `<polyline points="${pts}" fill="none" stroke="${base.stroke}" stroke-width="2.2"${dash}/>`
        : `<polygon points="${pts}" fill="${c ? c.fill : "none"}" fill-opacity="${c ? 0.75 : 1}" stroke="${base.stroke}" stroke-width="2.2"${dash}/>`);
    } else if (it.t === "line") {
      const c = it.color !== undefined ? sc(it.color, color).stroke : base.stroke;
      out.push(`<line x1="${padX + S(it.x1)}" y1="${padY + S(it.y1)}" x2="${padX + S(it.x2)}" y2="${padY + S(it.y2)}" stroke="${c}" stroke-width="2"${dash}/>`);
    } else if (it.t === "circle") {
      const c = it.fill === null ? null : sc(it.fill, color);
      out.push(`<circle cx="${padX + S(it.cx)}" cy="${padY + S(it.cy)}" r="${S(it.r)}" fill="${c ? c.fill : "none"}" fill-opacity="${c ? 0.7 : 1}" stroke="${base.stroke}" stroke-width="2.2"${dash}/>`);
    } else if (it.t === "sector" || it.t === "arc") {
      const [x0, y0] = polar(it.cx, it.cy, it.r, it.a0), [x1, y1] = polar(it.cx, it.cy, it.r, it.a1);
      const large = ((it.a1 - it.a0 + 360) % 360) > 180 ? 1 : 0;
      const d = it.t === "sector"
        ? `M ${P(it.cx, it.cy)} L ${P(x0, y0)} A ${S(it.r)} ${S(it.r)} 0 ${large} 1 ${P(x1, y1)} Z`
        : `M ${P(x0, y0)} A ${S(it.r)} ${S(it.r)} 0 ${large} 1 ${P(x1, y1)}`;
      const c = it.t === "sector" ? (it.fill === null ? null : sc(it.fill, color)) : null;
      const st = it.t === "arc" && it.color !== undefined ? sc(it.color, color).stroke : base.stroke;
      out.push(`<path d="${d}" fill="${c ? c.fill : "none"}" fill-opacity="${c ? 0.75 : 1}" stroke="${st}" stroke-width="${it.t === "arc" && it.w ? it.w : 2.2}" stroke-linecap="round"/>`);
    } else if (it.t === "path") {
      const tk: string[] = it.d.match(/[MLAZ]|-?\d*\.?\d+/g) ?? [];
      const o: string[] = [];
      for (let k = 0; k < tk.length; ) {
        const cmd = tk[k];
        if (cmd === "Z") { o.push("Z"); k++; }
        else if (cmd === "M" || cmd === "L") { o.push(`${cmd} ${P(+tk[k + 1], +tk[k + 2])}`); k += 3; }
        else if (cmd === "A") { o.push(`A ${S(+tk[k + 1])} ${S(+tk[k + 2])} ${tk[k + 3]} ${tk[k + 4]} ${tk[k + 5]} ${P(+tk[k + 6], +tk[k + 7])}`); k += 8; }
        else k++;
      }
      const c = it.fill === undefined || it.fill === null ? null : sc(it.fill, color);
      const st = it.color !== undefined ? sc(it.color, color).stroke : base.stroke;
      out.push(`<path d="${o.join(" ")}" fill="${c ? c.fill : "none"}" fill-opacity="${c ? 0.75 : 1}" stroke="${st}" stroke-width="${it.w ?? 2.2}"${dash} stroke-linejoin="round" stroke-linecap="round"/>`);
    } else if (it.t === "right") {
      const dx = it.dx ?? 1, dy = it.dy ?? 1, m = 0.35;
      out.push(`<polyline points="${P(it.x + dx * m, it.y)} ${P(it.x + dx * m, it.y + dy * m)} ${P(it.x, it.y + dy * m)}" fill="none" stroke="${base.stroke}" stroke-width="1.6"/>`);
    } else if (it.t === "text") {
      const c = it.color !== undefined ? sc(it.color, color).stroke : base.stroke;
      out.push(`<text x="${padX + S(it.x)}" y="${padY + S(it.y)}" text-anchor="${it.anchor ?? "middle"}" font-size="${it.size ?? 14}" font-weight="700" fill="${c}">${esc(String(it.s))}</text>`);
    }
  }
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">${out.join("")}</svg>`;
}

(async () => {
  const [file, outDir, kkFile] = process.argv.slice(2);
  if (!file || !outDir) throw new Error("usage: tools-render.ts <v2-файл> <папка> [kk-файл]");
  const topic: SeedTopic = (await import(resolve(file))).default;
  const kk = kkFile ? (await import(resolve(kkFile))).default : null;
  mkdirSync(outDir, { recursive: true });
  const cells: string[] = [];
  const add = (label: string, fig: unknown) => {
    const list = (Array.isArray(fig) ? fig : [fig]) as Figure[];
    for (const f of list) {
      if (f?.kind === "scene") cells.push(`<div class="c"><b>${esc(label)}</b>${sceneSvg(f)}</div>`);
      else if (f) cells.push(`<div class="c"><b>${esc(label)}</b><i>${esc(f.kind)}${f.kind === "image" ? " " + esc((f as any).src) : ""}</i></div>`);
    }
  };
  for (const [p, list] of [["p", topic.practice], ["t", topic.test]] as const) {
    for (const t of list) {
      const kt = kk?.tasks?.[`${p}:${t.n}`];
      const fig = kk ? kt?.figure : t.figure;
      if (fig) add(`${p}:${t.n}`, fig);
    }
  }
  const PER = 8;
  for (let i = 0, n = 1; i < cells.length; i += PER, n++) {
    const html = `<meta charset="utf-8"><style>body{margin:0;background:#fff;font-family:sans-serif}.g{display:flex;flex-wrap:wrap;width:1500px}.c{border:1px solid #ccc;margin:4px;padding:2px;max-width:730px;overflow:hidden}b{display:block;color:#a00;font-size:13px}i{font-size:12px}</style><div class="g">${cells.slice(i, i + PER).join("")}</div>`;
    const h = join(outDir, `sheet-${n}.html`);
    writeFileSync(h, html);
    const bin = join("/opt/pw-browsers", readdirSync("/opt/pw-browsers").find((d) => d.startsWith("chromium_headless_shell"))!, "chrome-linux", "headless_shell");
    const r = spawnSync(bin, ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", `--screenshot=${join(outDir, `sheet-${n}.png`)}`, "--window-size=1520,1300", "file://" + resolve(h)], { stdio: "ignore" });
    if (r.status !== 0) console.error("chromium завершился с кодом", r.status);
  }
  console.log(`${topic.code}: рисунков ${cells.length}, листов ${Math.ceil(cells.length / PER)} → ${outDir}`);
})();
