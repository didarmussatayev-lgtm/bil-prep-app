import ui from "./ui.module.css";

export function ProgressBar({
  value,
  tone = "default",
  label,
}: {
  value: number;
  tone?: "default" | "ok" | "weak";
  label: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const fill = tone === "weak" ? ui.barFillWeak : tone === "ok" ? ui.barFillOk : "";
  return (
    <div className={ui.bar} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
      <div className={`${ui.barFill} ${fill}`} style={{ width: `${v}%` }} />
    </div>
  );
}
