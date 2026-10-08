/* eslint-disable @next/next/no-img-element */
/** Рисунок-картинка (kind="image"): фрагмент страницы учебника из public/figures/... */
export function FigureImage({ src, alt, width }: { src: string; alt?: string; width?: number }) {
  return (
    <img
      src={src}
      alt={alt ?? "Рисунок из учебника"}
      loading="lazy"
      style={{ display: "block", maxWidth: "100%", height: "auto", width: width ? `${width}px` : undefined }}
    />
  );
}
