import base from "./topic-3-4";
import { applyOverlay, type Overlay } from "../../../overlay";
import { int, dec, frac, mixed, type Figure } from "../../../types";

// Рисунки и задачи, добавленные поверх topic-3-4.ts (см. overlay.ts). Меняйте здесь, базовый файл не трогаем.
const overlay: Overlay = {
  practiceFigures: {
    "2": {"kind": "scene", "width": 22, "height": 16, "items": [{"t": "rect", "x": 0, "y": 0, "w": 16, "h": 16, "fill": "#DBEAFE"}, {"t": "rect", "x": 16, "y": 10, "w": 6, "h": 6, "fill": "#DBEAFE"}, {"t": "text", "x": -0.532, "y": -0.473, "s": "D", "anchor": "middle", "size": 15}, {"t": "text", "x": 16.0, "y": -0.591, "s": "C", "anchor": "middle", "size": 15}, {"t": "text", "x": -0.532, "y": 17.005, "s": "A", "anchor": "middle", "size": 15}, {"t": "text", "x": 16.0, "y": 17.005, "s": "B", "anchor": "middle", "size": 15}, {"t": "text", "x": 22.118, "y": 17.005, "s": "E", "anchor": "middle", "size": 15}, {"t": "text", "x": 15.468, "y": 9.705, "s": "G", "anchor": "middle", "size": 15}, {"t": "text", "x": 22.532, "y": 9.705, "s": "F", "anchor": "middle", "size": 15}], "scale": 22},
  },
  testFigures: {
    "2": {"kind": "scene", "width": 20.0, "height": 10.0, "items": [{"t": "rect", "x": 0.0, "y": 0.0, "w": 20.0, "h": 10.0, "fill": "#BBF7D0"}, {"t": "line", "x1": 10.0, "y1": 0.0, "x2": 10.0, "y2": 10.0}, {"t": "circle", "cx": 10.0, "cy": 5.0, "r": 1.2, "fill": null}, {"t": "rect", "x": 0.0, "y": 3.8, "w": 0.5, "h": 2.4, "fill": null}, {"t": "rect", "x": 19.5, "y": 3.8, "w": 0.5, "h": 2.4, "fill": null}], "scale": 22, "color": 3},
  },
  addTest: [
    { after: "3", task: { n: "4", q: "Ученики изучали аппликацию. На квадратный лист со стороной 19 см наклеили два квадрата. Найдите периметр синей части.", figure: {"kind": "scene", "width": 19, "height": 19, "items": [{"t": "rect", "x": 0, "y": 0, "w": 19, "h": 19, "fill": "#93C5FD"}, {"t": "rect", "x": 0, "y": 9, "w": 10, "h": 10, "fill": "#FCA5A5"}, {"t": "rect", "x": 10.5, "y": 0, "w": 7, "h": 7, "fill": "#FDE68A"}, {"t": "text", "x": 14.0, "y": -0.414, "s": "7 см", "anchor": "middle", "size": 14}, {"t": "text", "x": -0.355, "y": 14.177, "s": "10 см", "anchor": "end", "size": 14}], "scale": 22, "color": 2}, choice: {"options": ["83 см", "90 см", "102 см", "108 см", "120 см"], "correct": "B"}, solution: "Красный квадрат со стороной 10 см стоит в углу: убираем две его стороны с границы листа (10+10) и вместо них получаем две внутренние (10+10) — периметр не меняется. Жёлтый квадрат со стороной 7 см примыкает к верхней стороне: из верхней стороны листа выпадает 7 см, зато добавляются три стороны жёлтого квадрата: 7+7+7=21 см. Периметр: 4·19 − 7 + 21 = 76 + 14 = 90 см.", review: "Расположение квадратов считано с рисунка: красный в левом нижнем углу, жёлтый касается верхней стороны листа и не касается красного. Ответ B (90 см) получен расчётом, сверить с книгой." } },
  ],
  pending: [
  ],
};

export default applyOverlay(base, overlay);
